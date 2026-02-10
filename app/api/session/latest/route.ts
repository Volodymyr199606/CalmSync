import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/session/latest
 * Gets the most recent relaxation session for the authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Try to find user in database (optional - app works without it)
    let user;
    let databaseAvailable = false;
    try {
      user = await prisma.user.findUnique({
        where: { email: currentUser.email },
        select: { id: true },
      });
      databaseAvailable = true;
    } catch (dbError) {
      // Database unavailable - return 404 (no session found) instead of 500
      databaseAvailable = false;
      // Silently handle connection errors - they're expected when DB is unavailable
      const errorMessage = dbError instanceof Error ? dbError.message : String(dbError);
      const isConnectionError = 
        errorMessage.includes("Can't reach database server") ||
        errorMessage.includes("P1001") ||
        errorMessage.includes("connection") ||
        errorMessage.includes("connect") ||
        errorMessage.includes("timeout") ||
        errorMessage.includes("ECONNREFUSED");
      
      if (!isConnectionError) {
        console.warn('[API] Database error (returning no session):', errorMessage);
      }
      
      // Return 404 when database is unavailable (no session found)
      return NextResponse.json(
        { error: 'No session found' },
        { status: 404 }
      );
    }

    if (!user) {
      return NextResponse.json(
        { error: 'No session found' },
        { status: 404 }
      );
    }

    // Get the latest relaxation session
    const latestSession = await prisma.relaxationSession.findFirst({
      where: {
        userId: user.id,
      },
      orderBy: {
        startedAt: 'desc',
      },
      include: {
        sessionItems: {
          include: {
            contentItem: true,
          },
          orderBy: {
            orderIndex: 'asc',
          },
        },
      },
    });

    if (!latestSession) {
      return NextResponse.json(
        { error: 'No session found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        session: {
          id: latestSession.id,
          feeling: latestSession.feeling,
          severity: latestSession.severity,
          primaryContentType: latestSession.primaryContentType,
          durationMinutes: latestSession.durationMinutes,
          createdAt: latestSession.startedAt,
        },
        items: latestSession.sessionItems.map((item) => ({
          id: item.id,
          type: item.contentItem.type,
          title: item.contentItem.title,
          url: item.contentItem.url,
          orderIndex: item.orderIndex,
        })),
      },
    });
  } catch (error) {
    // Only log unexpected errors (not connection errors)
    const errorMessage = error instanceof Error ? error.message : String(error);
    const isConnectionError = 
      errorMessage.includes("Can't reach database server") ||
      errorMessage.includes("P1001") ||
      errorMessage.includes("connection") ||
      errorMessage.includes("connect") ||
      errorMessage.includes("timeout") ||
      errorMessage.includes("ECONNREFUSED");
    
    if (!isConnectionError) {
      console.error('[API] Error fetching latest session:', error);
    }
    
    // Return 404 instead of 500 for connection errors
    return NextResponse.json(
      { error: 'No session found' },
      { status: 404 }
    );
  }
}

