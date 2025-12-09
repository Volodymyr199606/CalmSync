/**
 * Dashboard Page - Main user dashboard
 * Server component that loads user data and last session
 * Renders mood check-in form and experience view
 */

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { DashboardClient } from './DashboardClient';

export default async function DashboardPage() {
  // 1. Authenticate user
  const session = await auth();

  if (!session?.user?.email) {
    redirect('/api/auth/signin');
  }

  // 2. Load user from database
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      email: true,
      name: true,
    },
  });

  if (!user) {
    redirect('/api/auth/signin');
  }

  // 3. Optionally load last relaxation session
  let lastSession = null;
  let lastSessionItems = null;

  try {
    const recentSession = await prisma.relaxationSession.findFirst({
      where: { userId: user.id },
      orderBy: { startedAt: 'desc' },
      include: {
        sessionItems: {
          include: {
            contentItem: true,
          },
          orderBy: { orderIndex: 'asc' },
        },
      },
    });

    if (recentSession) {
      // Transform to match expected types
      lastSession = {
        id: recentSession.id,
        userId: recentSession.userId,
        moodCheckInId: recentSession.moodCheckInId,
        feeling: recentSession.feeling as 'STRESS' | 'ANXIETY' | 'DEPRESSION' | 'FRUSTRATION',
        severity: recentSession.severity,
        primaryContentType: recentSession.primaryContentType,
        durationMinutes: recentSession.durationMinutes,
        completedAt: recentSession.completedAt,
        createdAt: recentSession.startedAt,
      };

      lastSessionItems = recentSession.sessionItems.map((item) => ({
        id: item.id,
        sessionId: recentSession.id,
        contentType: item.contentItem.type,
        contentId: item.contentItem.id,
        title: item.contentItem.title,
        url: item.contentItem.url,
        description: item.contentItem.description,
        duration: null, // Duration is not stored in ContentItem
        orderIndex: item.orderIndex,
      }));
    }
  } catch (error) {
    console.error('Failed to load last session:', error);
    // Continue without last session
  }

  // 4. Render client component with server data
  // Note: We don't auto-load last session - user must complete check-in to see experience
  return (
    <DashboardClient
      user={user}
      initialSession={null}
      initialItems={[]}
    />
  );
}
