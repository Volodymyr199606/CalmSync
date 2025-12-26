import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FeelingType } from '@prisma/client'

// Map database FeelingType to display names
const feelingDisplayNames: Record<FeelingType, string> = {
  STRESS: "Stress",
  ANXIETY: "Anxiety",
  DEPRESSION: "Depression",
  FRUSTRATION: "Frustration",
}

export default async function SessionsPage() {
  try {
    const user = await getCurrentUser()

    if (!user?.email) {
      redirect('/')
    }

    const dbUser = await prisma.user.findUnique({
      where: { email: user.email },
      select: { id: true },
    })

    if (!dbUser) {
      redirect('/')
    }

    // Get all relaxation sessions for the user
    const sessions = await prisma.relaxationSession.findMany({
      where: { userId: dbUser.id },
      include: {
        moodCheckIn: {
          select: {
            feeling: true,
            severity: true,
            createdAt: true,
          },
        },
        sessionItems: {
          include: {
            contentItem: {
              select: {
                type: true,
                title: true,
                url: true,
              },
            },
          },
          take: 5, // Limit items per session for display
          orderBy: { orderIndex: 'asc' },
        },
      },
      orderBy: { startedAt: 'desc' },
      take: 50,
    })

    return (
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6">
          <Link href="/dashboard">
            <Button variant="outline">← Back to Dashboard</Button>
          </Link>
        </div>

        <h1 className="text-3xl font-bold mb-8">My Sessions</h1>

        {sessions.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-gray-500 mb-4">No sessions yet.</p>
              <Link href="/dashboard">
                <Button>Create Your First Session</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {sessions.map((session) => {
              // Use moodCheckIn if available (preferred), otherwise fall back to session's own fields
              const feeling = (session.moodCheckIn?.feeling || session.feeling) as FeelingType
              const feelingDisplay = feelingDisplayNames[feeling] || feeling
              const severity = session.moodCheckIn?.severity ?? session.severity
              const date = new Date(session.startedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
              })

              return (
                <Card key={session.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        {feelingDisplay} Session - {session.durationMinutes} min
                      </CardTitle>
                      <span className="text-sm text-gray-500">{date}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-medium">Intensity: </span>
                        <span className="text-sm">{severity}/10</span>
                      </div>
                      {session.sessionItems.length > 0 && (
                        <div>
                          <span className="text-sm font-medium">Content: </span>
                          <span className="text-sm text-gray-600">
                            {session.sessionItems.length} item(s)
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    )
  } catch (error) {
    console.error('[SESSIONS PAGE] Error loading sessions:', error)
    redirect('/dashboard')
  }
}
