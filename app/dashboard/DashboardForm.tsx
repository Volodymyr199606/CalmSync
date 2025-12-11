"use client"

import { useState } from "react"
import { NavigationHeader } from "@/components/navigation-header"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface DashboardFormProps {
  userName?: string | null
  userEmail?: string | null
}

export function DashboardForm({ userName, userEmail }: DashboardFormProps) {
  const [feeling, setFeeling] = useState<string | null>(null)
  const [intensity, setIntensity] = useState(5)
  const [notes, setNotes] = useState("")

  const feelings = [
    { id: "stress", emoji: "😰", label: "Stress" },
    { id: "anxiety", emoji: "😟", label: "Anxiety" },
    { id: "depression", emoji: "😔", label: "Depression" },
    { id: "frustration", emoji: "😤", label: "Frustration" },
  ]

  // Calculate user initials
  const userInitials = userName
    ? userName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : userEmail
      ? userEmail.slice(0, 2).toUpperCase()
      : "U"

  const displayName = userName || userEmail || "User"

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      <NavigationHeader
        userName={displayName}
        userInitials={userInitials}
        userEmail={userEmail || undefined}
      />

      <main className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="space-y-12">
          {/* Header */}
          <div className="space-y-2">
            <h2 className="text-3xl font-semibold text-gray-900">Welcome back</h2>
            <p className="text-gray-500">Take a moment to check in with yourself</p>
          </div>

          {/* Content card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8 space-y-8">
            {/* Feeling selection */}
            <div className="space-y-4">
              <label className="text-sm font-medium text-gray-700">How are you feeling?</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {feelings.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setFeeling(item.id)}
                    className={`
                      p-4 rounded-xl border transition-all
                      ${
                        feeling === item.id
                          ? "border-[#4A9B7F] bg-[#4A9B7F]/5"
                          : "border-gray-200 hover:border-gray-300"
                      }
                    `}
                  >
                    <div className="text-3xl mb-2">{item.emoji}</div>
                    <div className="text-sm font-medium text-gray-700">{item.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Intensity */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Intensity</label>
                <span className="text-sm text-gray-500">{intensity}/10</span>
              </div>
              <div className="flex items-center gap-2">
                {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                  <button
                    key={num}
                    onClick={() => setIntensity(num)}
                    className={`
                      h-10 w-full rounded-lg text-sm transition-all
                      ${intensity >= num ? "bg-[#4A9B7F] text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-600"}
                    `}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-4">
              <label className="text-sm font-medium text-gray-700">Notes (optional)</label>
              <Textarea
                placeholder="Add any additional context about how you're feeling..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-24 resize-none rounded-xl border-gray-200 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>

            {/* Submit */}
            <Button
              className="w-full h-12 rounded-xl bg-[#4A9B7F] hover:bg-[#3d8168] text-white font-normal"
              disabled={!feeling}
            >
              Create Relaxation Experience
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}

