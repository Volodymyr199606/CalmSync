/**
 * POST /api/experience
 * Generates a personalized relaxation experience based on mood
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateRelaxationExperience } from '@/lib/relaxation-engine';
import { logger, extractErrorInfo } from '@/lib/logger';
import { z } from 'zod';
import { FeelingSchema } from '@/lib/validation';
import type { RelaxationSession, SessionItem, Feeling } from '@/types/domain';

/**
 * Request body validation schema
 * Accept either a moodCheckInId OR feeling + severity
 */
const experienceRequestSchema = z.union([
  z.object({
    moodCheckInId: z.string().min(1),
  }),
  z.object({
    feeling: FeelingSchema,
    severity: z.number().int().min(1).max(10),
  }),
]);

type ExperienceRequest = z.infer<typeof experienceRequestSchema>;

/**
 * Structured response with full experience data
 */
interface ExperienceResponse {
  success: true;
  data: {
    session: RelaxationSession;
    items: SessionItem[];
  };
}

interface ErrorResponse {
  success: false;
  error: string;
  details?: string;
}

type ApiResponse = ExperienceResponse | ErrorResponse;

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    // 1. Authenticate user
    const currentUser = await getCurrentUser();
    
    if (!currentUser?.email) {
      logger.warn('Unauthorized experience request', {
        path: '/api/experience',
        hasUser: !!currentUser,
      });
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      );
    }

    // 2. Parse and validate request body
    const body = await request.json();
    const validation = experienceRequestSchema.safeParse(body);

    if (!validation.success) {
      logger.warn('Invalid experience request data', {
        email: currentUser.email,
        errors: validation.error.issues,
      });
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request data',
          details: validation.error.issues.map(e => e.message).join(', '),
        },
        { status: 400 }
      );
    }

    const requestData = validation.data;

    // 3. Find user in database
    const user = await prisma.user.findUnique({
      where: { email: currentUser.email },
      select: { id: true, email: true },
    });

    if (!user) {
      logger.error('Authenticated user not found in database', {
        email: currentUser.email,
      });
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // 4. Determine feeling and severity
    let feeling: Feeling;
    let severity: number;
    let moodCheckInId: string | null = null;

    if ('moodCheckInId' in requestData) {
      // Load mood from database
      const moodCheckIn = await prisma.moodCheckIn.findUnique({
        where: {
          id: requestData.moodCheckInId,
          userId: user.id, // Ensure user owns this mood check-in
        },
      });

      if (!moodCheckIn) {
        logger.warn('Mood check-in not found or unauthorized', {
          userId: user.id,
          moodCheckInId: requestData.moodCheckInId,
        });
        return NextResponse.json(
          { success: false, error: 'Mood check-in not found' },
          { status: 404 }
        );
      }

      feeling = moodCheckIn.feeling as Feeling;
      severity = moodCheckIn.severity;
      moodCheckInId = moodCheckIn.id;

      logger.debug('Loaded mood check-in for experience', {
        userId: user.id,
        moodCheckInId,
        feeling,
        severity,
      });
    } else {
      // Use provided feeling and severity
      feeling = requestData.feeling;
      severity = requestData.severity;

      logger.debug('Using direct mood input for experience', {
        userId: user.id,
        feeling,
        severity,
      });
    }

    // 5. Generate relaxation experience using the engine
    const experience = generateRelaxationExperience({ feeling, severity: severity as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 });

    logger.info('Relaxation experience generated', {
      userId: user.id,
      feeling,
      severity,
      primaryType: experience.primaryType,
      itemCount: experience.items.length,
    });

    // 6. Create RelaxationSession in database
    const relaxationSession = await prisma.relaxationSession.create({
      data: {
        userId: user.id,
        moodCheckInId: moodCheckInId || undefined,
        feeling,
        severity,
        primaryContentType: experience.primaryType,
        durationMinutes: experience.sessionDurationMinutes,
      },
    });

    // 7. Ensure all content items exist in database (or create them)
    // This is needed because SessionItem references ContentItem via contentItemId
    const sessionItemsCreateData = [];
    const contentItemsMap = new Map<number, { dbItem: any; contentItem: any }>();
    
    for (let i = 0; i < experience.items.length; i++) {
      const contentItem = experience.items[i];
      
      // Check if content item exists in database
      let dbContentItem = await prisma.contentItem.findFirst({
        where: {
          title: contentItem.title,
          type: contentItem.type,
        },
      });

      // Create or update content item to ensure URL is current
      if (!dbContentItem) {
        dbContentItem = await prisma.contentItem.create({
          data: {
            type: contentItem.type,
            title: contentItem.title,
            url: contentItem.url || null,
            content: contentItem.content || null,
            description: contentItem.description || null,
            feeling: contentItem.feeling,
            tags: contentItem.tags,
          },
        });
      } else {
        // Update existing item to use latest URL from content library
        dbContentItem = await prisma.contentItem.update({
          where: { id: dbContentItem.id },
          data: {
            url: contentItem.url || null,
            description: contentItem.description || null,
            tags: contentItem.tags,
          },
        });
      }

      // Store mapping for later
      contentItemsMap.set(i, { dbItem: dbContentItem, contentItem });

      // Prepare session item data for batch creation
      sessionItemsCreateData.push({
        relaxationSessionId: relaxationSession.id,
        contentItemId: dbContentItem.id,
        orderIndex: i,
      });
    }

    // 8. Create all session items in batch
    await prisma.sessionItem.createMany({
      data: sessionItemsCreateData,
    });

    // 9. Fetch created session items to build response
    const createdSessionItems = await prisma.sessionItem.findMany({
      where: { relaxationSessionId: relaxationSession.id },
      orderBy: { orderIndex: 'asc' },
    });

    // Build response items array
    // IMPORTANT: Use URL from contentItem (content library) not dbItem (database)
    // This ensures we always use the latest URLs even if database has old ones
    const sessionItemsData: SessionItem[] = createdSessionItems.map(sessionItem => {
      const { dbItem, contentItem } = contentItemsMap.get(sessionItem.orderIndex)!;
      return {
        id: sessionItem.id,
        sessionId: relaxationSession.id,
        contentType: dbItem.type,
        contentId: dbItem.id,
        title: dbItem.title,
        url: contentItem.url || dbItem.url, // Use URL from content library (source of truth)
        description: dbItem.description,
        duration: contentItem.durationSeconds || null,
        orderIndex: sessionItem.orderIndex,
      };
    });

    logger.info('Relaxation session saved to database', {
      userId: user.id,
      sessionId: relaxationSession.id,
      itemsCreated: sessionItemsData.length,
    });

    // 10. Format and return structured response
    const responseSession: RelaxationSession = {
      id: relaxationSession.id,
      userId: relaxationSession.userId,
      moodCheckInId: relaxationSession.moodCheckInId,
      feeling: relaxationSession.feeling as Feeling,
      severity: relaxationSession.severity,
      primaryContentType: relaxationSession.primaryContentType,
      durationMinutes: relaxationSession.durationMinutes,
      completedAt: relaxationSession.completedAt,
      createdAt: relaxationSession.startedAt,
    };

    return NextResponse.json(
      {
        success: true,
        data: {
          session: responseSession,
          items: sessionItemsData,
        },
      },
      { status: 201 }
    );

  } catch (error) {
    logger.error('Failed to create relaxation experience', {
      error: extractErrorInfo(error),
    });

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' 
          ? (error instanceof Error ? error.message : String(error))
          : undefined,
      },
      { status: 500 }
    );
  }
}
