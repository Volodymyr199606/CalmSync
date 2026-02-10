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
    notes: z.string().optional(), // Allow notes but don't require them
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

    // 3. Try to find user in database (optional - app works without it)
    let user;
    let databaseAvailable = false;
    try {
      user = await prisma.user.findUnique({
        where: { email: currentUser.email },
        select: { id: true, email: true },
      });
      databaseAvailable = true;
    } catch (dbError) {
      // Database unavailable - continue without saving to database
      // Use Supabase user ID as fallback
      databaseAvailable = false;
      user = {
        id: currentUser.id,
        email: currentUser.email,
      };
      
      // Only log if it's not a connection error (those are expected when DB is unavailable)
      const errorMessage = dbError instanceof Error ? dbError.message : String(dbError);
      const isConnectionError = 
        errorMessage.includes("Can't reach database server") ||
        errorMessage.includes("P1001") ||
        errorMessage.includes("connection") ||
        errorMessage.includes("connect") ||
        errorMessage.includes("timeout") ||
        errorMessage.includes("ECONNREFUSED");
      
      if (!isConnectionError) {
        logger.warn('Database error (continuing without DB)', {
          email: currentUser.email,
          error: errorMessage,
        });
      }
    }

    // Ensure we have a user object for the rest of the handler (findUnique can return null)
    const resolvedUser = user ?? {
      id: currentUser.id,
      email: currentUser.email,
    };

    // 4. Determine feeling and severity
    let feeling: Feeling;
    let severity: number;
    let moodCheckInId: string | null = null;

    if ('moodCheckInId' in requestData) {
      if (!databaseAvailable) {
        // Can't load from database if it's unavailable
        return NextResponse.json(
          { success: false, error: 'Database unavailable. Please provide feeling and severity directly.' },
          { status: 503 }
        );
      }
      
      // Load mood from database
      const moodCheckIn = await prisma.moodCheckIn.findUnique({
        where: {
          id: requestData.moodCheckInId,
          userId: resolvedUser.id, // Ensure user owns this mood check-in
        },
      });

      if (!moodCheckIn) {
        logger.warn('Mood check-in not found or unauthorized', {
          userId: resolvedUser.id,
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
        userId: resolvedUser.id,
        moodCheckInId,
        feeling,
        severity,
      });
    } else {
      // Use provided feeling and severity
      feeling = requestData.feeling;
      severity = requestData.severity;

      logger.debug('Using direct mood input for experience', {
        userId: resolvedUser.id,
        feeling,
        severity,
      });
    }

    // 5. Generate relaxation experience using the engine
    const experience = generateRelaxationExperience({ feeling, severity: severity as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 });

    logger.info('Relaxation experience generated', {
      userId: resolvedUser.id,
      feeling,
      severity,
      primaryType: experience.primaryType,
      itemCount: experience.items.length,
    });

    // 6. Save to database if available, otherwise generate response without saving
    let responseSession: RelaxationSession;
    let sessionItemsData: SessionItem[];

    if (databaseAvailable) {
      // Create RelaxationSession in database
      const relaxationSession = await prisma.relaxationSession.create({
        data: {
          userId: resolvedUser.id,
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
      sessionItemsData = createdSessionItems.map(sessionItem => {
        const mapEntry = contentItemsMap.get(sessionItem.orderIndex);
        if (!mapEntry) {
          logger.error('Missing content item mapping', {
            orderIndex: sessionItem.orderIndex,
            sessionId: relaxationSession.id,
          });
          throw new Error(`Missing content item mapping for orderIndex ${sessionItem.orderIndex}`);
        }
        const { dbItem, contentItem } = mapEntry;
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
        userId: resolvedUser.id,
        sessionId: relaxationSession.id,
        itemsCreated: sessionItemsData.length,
      });

      // Format response session
      responseSession = {
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
    } else {
      // Database unavailable - generate response without saving
      // Generate a temporary session ID
      const tempSessionId = `temp-${Date.now()}-${Math.random().toString(36).substring(7)}`;
      
      responseSession = {
        id: tempSessionId,
        userId: resolvedUser.id,
        moodCheckInId: moodCheckInId,
        feeling,
        severity,
        primaryContentType: experience.primaryType,
        durationMinutes: experience.sessionDurationMinutes,
        completedAt: null,
        createdAt: new Date(),
      };

      // Build session items from experience directly (without database)
      sessionItemsData = experience.items.map((contentItem, index) => ({
        id: `temp-${index}-${Date.now()}`,
        sessionId: tempSessionId,
        contentType: contentItem.type,
        contentId: `temp-content-${index}`,
        title: contentItem.title,
        url: contentItem.url || null,
        description: contentItem.description || null,
        duration: contentItem.durationSeconds || null,
        orderIndex: index,
      }));

      logger.info('Relaxation experience generated without database', {
        userId: resolvedUser.id,
        feeling,
        severity,
        itemCount: sessionItemsData.length,
      });
    }

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
