/**
 * POST /api/mood
 * Creates a new mood check-in for the authenticated user
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { moodCheckInSchema } from '@/lib/validation';
import { logger, extractErrorInfo } from '@/lib/logger';
import type { MoodCheckIn } from '@/types/domain';

/**
 * Typed API response for mood check-in creation
 */
interface MoodCheckInResponse {
  success: true;
  data: MoodCheckIn;
}

interface ErrorResponse {
  success: false;
  error: string;
  details?: string;
}

type ApiResponse = MoodCheckInResponse | ErrorResponse;

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    // 1. Authenticate user
    const session = await auth();
    
    if (!session?.user?.email) {
      logger.warn('Unauthorized mood check-in attempt', {
        path: '/api/mood',
        hasSession: !!session,
      });
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      );
    }

    // 2. Parse and validate request body
    const body = await request.json();
    const validation = moodCheckInSchema.safeParse(body);

    if (!validation.success) {
      logger.warn('Invalid mood check-in data', {
        email: session.user.email,
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

    const { feeling, severity, notes } = validation.data;

    // 3. Find user in database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, email: true },
    });

    if (!user) {
      logger.error('Authenticated user not found in database', {
        email: session.user.email,
      });
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // 4. Create mood check-in
    const moodCheckIn = await prisma.moodCheckIn.create({
      data: {
        userId: user.id,
        feeling,
        severity,
        notes: notes || null,
      },
    });

    logger.info('Mood check-in created', {
      userId: user.id,
      moodCheckInId: moodCheckIn.id,
      feeling,
      severity,
    });

    // 5. Return typed response
    const response: MoodCheckIn = {
      id: moodCheckIn.id,
      userId: moodCheckIn.userId,
      feeling: moodCheckIn.feeling as MoodCheckIn['feeling'],
      severity: moodCheckIn.severity,
      notes: moodCheckIn.notes,
      createdAt: moodCheckIn.createdAt,
    };

    return NextResponse.json(
      { success: true, data: response },
      { status: 201 }
    );

  } catch (error) {
    logger.error('Failed to create mood check-in', {
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

