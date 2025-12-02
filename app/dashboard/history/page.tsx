/**
 * History Page - View past mood check-ins and relaxation sessions
 * Displays user's mood tracking history in reverse chronological order
 */

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default async function HistoryPage() {
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

  // 3. Load mood check-ins with their associated sessions
  const moodCheckIns = await prisma.moodCheckIn.findMany({
    where: { userId: user.id },
    include: {
      relaxationSessions: {
        select: {
          id: true,
          durationMinutes: true,
          completedAt: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 50, // Limit to last 50 entries
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">
            Your History
          </h1>
          <p className="mt-1 text-sm text-white/80 sm:text-base">
            Review your past mood check-ins and relaxation sessions
          </p>
        </div>
        <Link href="/dashboard">
          <Button
            variant="ghost"
            size="sm"
            className="text-white/90 hover:bg-white/10 hover:text-white"
          >
            ← Back to Dashboard
          </Button>
        </Link>
      </div>

      {/* History List */}
      {moodCheckIns.length === 0 ? (
        <Card className="flex min-h-[400px] flex-col items-center justify-center p-8 text-center bg-white/95 backdrop-blur-sm border-0 shadow-xl">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-full sm:h-20 sm:w-20"
            style={{ backgroundColor: 'rgb(243, 232, 255)' }}
          >
            <svg
              className="h-8 w-8 sm:h-10 sm:w-10"
              style={{ color: 'rgb(147, 51, 234)' }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <h3 className="mt-4 text-lg font-semibold sm:text-xl" style={{ color: 'rgb(17, 24, 39)' }}>
            No history yet
          </h3>
          <p className="mt-2 max-w-sm text-sm sm:text-base" style={{ color: 'rgb(75, 85, 99)' }}>
            Start tracking your mood and relaxation sessions from the dashboard.
          </p>
          <Link href="/dashboard" className="mt-6">
            <Button
              className="text-white"
              style={{
                backgroundColor: 'rgb(147, 51, 234)',
              }}
            >
              Go to Dashboard
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {moodCheckIns.map((checkIn) => {
            const session = checkIn.relaxationSessions[0];
            const feelingEmojis: Record<string, string> = {
              STRESS: '😰',
              ANXIETY: '😟',
              DEPRESSION: '😔',
              FRUSTRATION: '😤',
            };
            const feelingColors: Record<string, string> = {
              STRESS: 'rgb(254, 202, 202)',
              ANXIETY: 'rgb(254, 249, 195)',
              DEPRESSION: 'rgb(191, 219, 254)',
              FRUSTRATION: 'rgb(254, 215, 170)',
            };

            return (
              <Card
                key={checkIn.id}
                className="p-4 sm:p-6 bg-white/95 backdrop-blur-sm border-0 shadow-lg"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  {/* Left: Mood info */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-12 w-12 items-center justify-center rounded-full text-2xl"
                        style={{ backgroundColor: feelingColors[checkIn.feeling] }}
                      >
                        {feelingEmojis[checkIn.feeling]}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold" style={{ color: 'rgb(17, 24, 39)' }}>
                          {checkIn.feeling.charAt(0) + checkIn.feeling.slice(1).toLowerCase()}
                        </h3>
                        <p className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
                          Intensity: {checkIn.severity}/10
                        </p>
                      </div>
                    </div>

                    {checkIn.notes && (
                      <div
                        className="mt-2 rounded-lg p-3"
                        style={{ backgroundColor: 'rgb(249, 250, 251)' }}
                      >
                        <p className="text-sm" style={{ color: 'rgb(55, 65, 81)' }}>
                          {checkIn.notes}
                        </p>
                      </div>
                    )}

                    {session && (
                      <div className="flex items-center gap-2 text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>
                          {session.durationMinutes} minute relaxation session
                          {session.completedAt && ' (completed)'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Right: Date/time */}
                  <div className="text-left sm:text-right">
                    <p className="text-sm font-medium" style={{ color: 'rgb(17, 24, 39)' }}>
                      {new Date(checkIn.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                    <p className="text-xs" style={{ color: 'rgb(107, 114, 128)' }}>
                      {new Date(checkIn.createdAt).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Footer note */}
      {moodCheckIns.length > 0 && (
        <div className="text-center">
          <p className="text-sm text-white/70">
            Showing your last {Math.min(moodCheckIns.length, 50)} mood check-ins
          </p>
        </div>
      )}
    </div>
  );
}

