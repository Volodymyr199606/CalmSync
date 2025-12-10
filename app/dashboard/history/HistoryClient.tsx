"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowUpRight, Clock, Download, Flame, Plus, Smile, Sparkles, TrendingUp } from "lucide-react"
import { useRouter } from "next/navigation"
import type React from "react"

interface MoodDistributionItem {
  mood: string
  percentage: number
  color: string
}

interface HistoryEntry {
  id: string
  mood: string
  intensity: number
  time: string
  session: string | null
  note: string | null
  color: string
}

interface HistoryDateGroup {
  date: string
  entries: HistoryEntry[]
}

interface HistoryClientProps {
  stats: {
    totalSessions: number
    avgCalmLevel: number
    meditationHours: number
    currentStreak: number
  }
  moodDistribution: MoodDistributionItem[]
  historyEntries: HistoryDateGroup[]
  totalEntries: number
}

export function HistoryClient({ stats, moodDistribution, historyEntries, totalEntries }: HistoryClientProps) {
  const router = useRouter()

  const hasNoData = stats.totalSessions === 0 && historyEntries.length === 0

  if (hasNoData) {
    return (
      <div className="flex min-h-[calc(100vh-200px)] items-center justify-center bg-background px-4">
        <div className="mx-auto max-w-md space-y-8 text-center">
          {/* Icon */}
          <div className="mx-auto flex h-24 w-24 items-center justify-center">
            <Sparkles className="h-16 w-16 text-muted-foreground/40" strokeWidth={1.5} />
          </div>

          {/* Content */}
          <div className="space-y-3">
            <h1 className="text-balance text-4xl font-bold tracking-tight">Your History</h1>
            <p className="text-pretty text-lg text-muted-foreground">Track your journey to calm</p>
          </div>

          <p className="text-pretty text-muted-foreground">
            No sessions yet. Start your first relaxation experience to begin tracking your progress.
          </p>

          {/* CTA Button */}
          <Button size="lg" className="mt-4 rounded-full px-8" onClick={() => router.push("/dashboard")}>
            Begin Journey
          </Button>
        </div>
      </div>
    )
  }

  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case "Calm":
        return "😊"
      case "Happiness":
        return "😄"
      case "Anxiety":
        return "😟"
      case "Stress":
        return "😰"
      case "Depression":
        return "😔"
      case "Frustration":
        return "😤"
      default:
        return "😐"
    }
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-6xl space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-balance text-3xl font-bold tracking-tight">Your History</h1>
            <p className="text-pretty text-muted-foreground">Review your past mood check-ins and relaxation sessions</p>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="relative overflow-hidden p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Sessions</p>
                  <p className="text-3xl font-bold">{stats.totalSessions}</p>
                  <p className="text-xs text-muted-foreground">This month</p>
                </div>
                <div className="rounded-full bg-chart-1/10 p-2.5">
                  <TrendingUp className="h-5 w-5 text-chart-1" />
                </div>
              </div>
              <div className="absolute right-3 top-3">
                <ArrowUpRight className="h-4 w-4 text-chart-1" />
              </div>
            </Card>

            <Card className="relative overflow-hidden p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Avg. Calm Level</p>
                  <p className="text-3xl font-bold">{stats.avgCalmLevel.toFixed(1)}</p>
                  <p className="text-xs text-muted-foreground">Out of 10</p>
                </div>
                <div className="rounded-full bg-chart-2/10 p-2.5">
                  <Smile className="h-5 w-5 text-chart-2" />
                </div>
              </div>
              <div className="absolute right-3 top-3">
                <ArrowUpRight className="h-4 w-4 text-chart-2" />
              </div>
            </Card>

            <Card className="relative overflow-hidden p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Meditation Time</p>
                  <p className="text-3xl font-bold">{stats.meditationHours.toFixed(1)}h</p>
                  <p className="text-xs text-muted-foreground">This week</p>
                </div>
                <div className="rounded-full bg-chart-3/10 p-2.5">
                  <Clock className="h-5 w-5 text-chart-3" />
                </div>
              </div>
              <div className="absolute right-3 top-3 text-muted-foreground">
                <span className="text-xs">—</span>
              </div>
            </Card>

            <Card className="relative overflow-hidden p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Current Streak</p>
                  <p className="text-3xl font-bold">{stats.currentStreak} days</p>
                  <p className="text-xs text-muted-foreground">Keep it up!</p>
                </div>
                <div className="rounded-full bg-destructive/10 p-2.5">
                  <Flame className="h-5 w-5 text-destructive" />
                </div>
              </div>
              <div className="absolute right-3 top-3">
                <ArrowUpRight className="h-4 w-4 text-destructive" />
              </div>
            </Card>
          </div>

          {/* Mood Distribution & Quick Actions Row */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Mood Distribution Chart */}
            <Card className="p-6 lg:col-span-2">
              <h2 className="mb-2 text-xl font-semibold">Mood Distribution</h2>
              <p className="mb-6 text-sm text-muted-foreground">This week's emotional patterns</p>

              {moodDistribution.length > 0 ? (
                <div className="flex flex-col gap-8 sm:flex-row sm:items-center">
                  {/* Donut Chart */}
                  <div className="relative mx-auto h-48 w-48 shrink-0">
                    <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90 transform">
                      {
                        moodDistribution.reduce(
                          (acc, item) => {
                            const { segments, currentOffset } = acc
                            const circumference = 2 * Math.PI * 70
                            const segmentLength = (item.percentage / 100) * circumference
                            const strokeDasharray = `${segmentLength} ${circumference - segmentLength}`

                            segments.push(
                              <circle
                                key={item.mood}
                                cx="100"
                                cy="100"
                                r="70"
                                fill="none"
                                stroke={item.color}
                                strokeWidth="24"
                                strokeDasharray={strokeDasharray}
                                strokeDashoffset={-currentOffset}
                                className="transition-all duration-300"
                              />,
                            )

                            return {
                              segments,
                              currentOffset: currentOffset + segmentLength,
                            }
                          },
                          { segments: [] as React.ReactNode[], currentOffset: 0 },
                        ).segments
                      }
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold">{totalEntries}</span>
                      <span className="text-sm text-muted-foreground">entries</span>
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="flex-1 space-y-4">
                    {moodDistribution.map((item) => (
                      <div key={item.mood} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-sm font-medium">{item.mood}</span>
                        </div>
                        <span className="text-sm font-semibold">{item.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-muted-foreground">
                  <p>No mood data available for this week.</p>
                  <p className="mt-2 text-sm">Complete a mood check-in to see your patterns here.</p>
                </div>
              )}
            </Card>

            {/* Quick Actions */}
            <Card className="p-6">
              <h2 className="mb-6 text-xl font-semibold">Quick Actions</h2>
              <div className="space-y-3">
                <Button className="w-full justify-start gap-3" onClick={() => router.push("/dashboard")}>
                  <div className="rounded-full bg-primary-foreground/20 p-1">
                    <Plus className="h-4 w-4" />
                  </div>
                  <span>New Check-in</span>
                </Button>
                <Button variant="outline" className="w-full justify-start gap-3 bg-transparent">
                  <Download className="h-4 w-4" />
                  <span>Export Data</span>
                </Button>
              </div>
            </Card>
          </div>

          {/* Timeline */}
          {historyEntries.length > 0 ? (
            historyEntries.map((group) => (
              <div key={group.date} className="space-y-4">
                <h3 className="text-xl font-semibold">{group.date}</h3>
                <div className="relative space-y-4 border-l-2 border-border pl-8">
                  {group.entries.map((entry) => (
                    <div key={entry.id} className="relative">
                      {/* Timeline Dot */}
                      <div
                        className="absolute -left-[37px] top-6 h-3 w-3 rounded-full border-2 border-background"
                        style={{ backgroundColor: entry.color }}
                      />

                      {/* Entry Card */}
                      <Card className="p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-4">
                            {/* Mood Icon */}
                            <div
                              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full"
                              style={{ backgroundColor: `${entry.color}15` }}
                            >
                              <span className="text-2xl">{getMoodEmoji(entry.mood)}</span>
                            </div>

                            {/* Content */}
                            <div className="flex-1 space-y-3">
                              <h4 className="text-lg font-semibold">{entry.mood}</h4>

                              {/* Intensity Bar */}
                              <div className="space-y-1.5">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-muted-foreground">Intensity</span>
                                  <span className="font-semibold">{entry.intensity}/10</span>
                                </div>
                                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                                  <div
                                    className="h-full rounded-full transition-all"
                                    style={{
                                      width: `${(entry.intensity / 10) * 100}%`,
                                      backgroundColor: entry.color,
                                    }}
                                  />
                                </div>
                              </div>

                              {/* Session Badge */}
                              {entry.session && (
                                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-sm text-primary">
                                  <Clock className="h-3.5 w-3.5" />
                                  <span>{entry.session}</span>
                                </div>
                              )}

                              {/* Note */}
                              {entry.note && <p className="text-sm text-muted-foreground">{entry.note}</p>}
                            </div>
                          </div>

                          {/* Time */}
                          <span className="shrink-0 text-sm text-muted-foreground">{entry.time}</span>
                        </div>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">No history entries yet.</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Complete a mood check-in to start tracking your journey.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
