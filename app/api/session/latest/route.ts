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

    const user = await prisma.user.findUnique({
      where: { email: currentUser.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
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
    console.error('[API] Error fetching latest session:', error);
    return NextResponse.json(
      { error: 'Failed to fetch session' },
      { status: 500 }
    );
  }
}

