import { auth } from "@/auth"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { FeelingType } from "@prisma/client"

// Map database FeelingType to display names
const feelingDisplayNames: Record<FeelingType, string> = {
  STRESS: "Stress",
  ANXIETY: "Anxiety",
  DEPRESSION: "Depression",
  FRUSTRATION: "Frustration",
}

// Map feeling types to colors for UI
const feelingColors: Record<FeelingType, string> = {
  STRESS: "oklch(0.65 0.2 30)",
  ANXIETY: "oklch(0.75 0.15 80)",
  DEPRESSION: "oklch(0.7 0.1 240)",
  FRUSTRATION: "oklch(0.68 0.18 45)",
}

// Helper function to format date for grouping
function formatDateForGrouping(date: Date): string {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  const checkInDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())

  if (checkInDate.getTime() === today.getTime()) {
    return "Today"
  }
  if (checkInDate.getTime() === yesterday.getTime()) {
    return "Yesterday"
  }
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

// Helper function to format time
function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })
}

// Calculate consecutive days streak
async function calculateStreak(userId: string): Promise<number> {
  const checkIns = await prisma.moodCheckIn.findMany({
    where: { userId },
    select: { createdAt: true },
    orderBy: { createdAt: "desc" },
  })

  if (checkIns.length === 0) return 0

  let streak = 0
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Group check-ins by date
  const dates = new Set(
    checkIns.map((ci) => {
      const d = new Date(ci.createdAt)
      d.setHours(0, 0, 0, 0)
      return d.getTime()
    })
  )

  const sortedDates = Array.from(dates).sort((a, b) => b - a)

  // Check if there's a check-in today or yesterday to start the streak
  const todayTime = today.getTime()
  const yesterdayTime = todayTime - 86400000

  if (sortedDates[0] !== todayTime && sortedDates[0] !== yesterdayTime) {
    return 0 // No recent check-in, streak is broken
  }

  // Count consecutive days
  let expectedDate = sortedDates[0]
  for (const date of sortedDates) {
    if (date === expectedDate) {
      streak++
      expectedDate = date - 86400000 // Previous day
    } else {
      break
    }
  }

  return streak
}

export async function GET(request: Request) {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const userId = user.id

    // Date ranges
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - now.getDay())
    startOfWeek.setHours(0, 0, 0, 0)

    // 1. Total Sessions This Month
    const totalSessionsThisMonth = await prisma.relaxationSession.count({
      where: {
        userId,
        startedAt: {
          gte: startOfMonth,
        },
      },
    })

    // 2. Average Calm Level (average of (10 - severity) for all check-ins this month)
    // Lower severity = calmer, so we invert it: calm level = 10 - severity
    const checkInsThisMonth = await prisma.moodCheckIn.findMany({
      where: {
        userId,
        createdAt: {
          gte: startOfMonth,
        },
      },
      select: { severity: true },
    })

    const avgCalmLevel =
      checkInsThisMonth.length > 0
        ? checkInsThisMonth.reduce((sum, ci) => sum + (10 - ci.severity), 0) / checkInsThisMonth.length
        : 0

    // 3. Meditation Time This Week (sum of durationMinutes)
    const sessionsThisWeek = await prisma.relaxationSession.findMany({
      where: {
        userId,
        startedAt: {
          gte: startOfWeek,
        },
      },
      select: { durationMinutes: true },
    })

    const totalMeditationMinutes = sessionsThisWeek.reduce((sum, s) => sum + s.durationMinutes, 0)
    const meditationHours = totalMeditationMinutes / 60

    // 4. Current Streak
    const currentStreak = await calculateStreak(userId)

    // 5. Mood Distribution This Week
    const checkInsThisWeek = await prisma.moodCheckIn.findMany({
      where: {
        userId,
        createdAt: {
          gte: startOfWeek,
        },
      },
      select: { feeling: true },
    })

    const moodCounts: Record<FeelingType, number> = {
      STRESS: 0,
      ANXIETY: 0,
      DEPRESSION: 0,
      FRUSTRATION: 0,
    }

    checkInsThisWeek.forEach((ci) => {
      moodCounts[ci.feeling]++
    })

    const totalMoods = checkInsThisWeek.length
    const moodDistribution = Object.entries(moodCounts)
      .filter(([_, count]) => count > 0)
      .map(([feeling, count]) => ({
        mood: feelingDisplayNames[feeling as FeelingType],
        percentage: totalMoods > 0 ? Math.round((count / totalMoods) * 100) : 0,
        color: feelingColors[feeling as FeelingType],
        feeling: feeling as FeelingType,
      }))
      .sort((a, b) => b.percentage - a.percentage)

    // 6. History Entries (grouped by date)
    const allCheckIns = await prisma.moodCheckIn.findMany({
      where: { userId },
      include: {
        relaxationSessions: {
          select: {
            durationMinutes: true,
            primaryContentType: true,
          },
          take: 1,
          orderBy: { startedAt: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    })

    // Group entries by date
    const groupedEntries = new Map<string, typeof allCheckIns>()
    allCheckIns.forEach((checkIn) => {
      const dateKey = formatDateForGrouping(checkIn.createdAt)
      if (!groupedEntries.has(dateKey)) {
        groupedEntries.set(dateKey, [])
      }
      groupedEntries.get(dateKey)!.push(checkIn)
    })

    const historyEntries = Array.from(groupedEntries.entries())
      .map(([date, entries]) => ({
        date,
        entries: entries.map((entry) => {
          const session = entry.relaxationSessions[0]
          const feelingDisplay = feelingDisplayNames[entry.feeling]
          const color = feelingColors[entry.feeling]

          // Format session duration if exists
          let sessionText: string | null = null
          if (session) {
            const contentTypeMap: Record<string, string> = {
              MUSIC: "relaxation",
              NATURE_VIDEO: "meditation",
              NATURE_SOUND: "breathing",
              IMAGE: "mindfulness",
              TEXT: "reflection",
              BREATHING_ANIMATION: "breathing",
            }
            const sessionType = contentTypeMap[session.primaryContentType] || "session"
            sessionText = `${session.durationMinutes} min ${sessionType} session`
          }

          return {
            id: entry.id,
            mood: feelingDisplay,
            intensity: entry.severity,
            time: formatTime(entry.createdAt),
            session: sessionText,
            note: entry.notes,
            color,
          }
        }),
      }))
      .sort((a, b) => {
        // Sort by date, with "Today" first, "Yesterday" second, then chronologically
        if (a.date === "Today") return -1
        if (b.date === "Today") return 1
        if (a.date === "Yesterday") return -1
        if (b.date === "Yesterday") return 1
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      })

    return NextResponse.json({
      stats: {
        totalSessions: totalSessionsThisMonth,
        avgCalmLevel: Math.round(avgCalmLevel * 10) / 10, // Round to 1 decimal
        meditationHours: Math.round(meditationHours * 10) / 10, // Round to 1 decimal
        currentStreak,
      },
      moodDistribution,
      historyEntries,
      totalEntries: checkInsThisWeek.length,
    })
  } catch (error) {
    console.error("[History API] Error fetching history:", error)
    return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 })
  }
}

