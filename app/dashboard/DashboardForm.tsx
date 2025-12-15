"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { getMultipleNaturePrompts } from "@/lib/image-prompts"

interface GeneratedImage {
  url: string
  prompt: string
}

export function DashboardForm() {
  const [feeling, setFeeling] = useState<string | null>(null)
  const [intensity, setIntensity] = useState(5)
  const [notes, setNotes] = useState("")
  const [backgroundImages, setBackgroundImages] = useState<GeneratedImage[]>([])
  const [imagesLoading, setImagesLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(false)

  const feelings = [
    { id: "stress", emoji: "😰", label: "Stress" },
    { id: "anxiety", emoji: "😟", label: "Anxiety" },
    { id: "depression", emoji: "😔", label: "Depression" },
    { id: "frustration", emoji: "😤", label: "Frustration" },
  ]

  // Set mounted state to avoid hydration mismatch
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Generate background images on component mount
  useEffect(() => {
    let isCancelled = false

    async function generateImages() {
      if (isCancelled) return
      setImagesLoading(true)
      try {
        // Get 8 unique prompts for all background images
        const prompts = getMultipleNaturePrompts(8)
        
        // Generate images in parallel
        const imagePromises = prompts.map(async (prompt) => {
          try {
            const response = await fetch(
              `/api/images/generate?prompt=${encodeURIComponent(prompt)}&width=512&height=512`
            )
            if (!response.ok) throw new Error("Failed to generate image")
            const data = await response.json()
            return { url: data.url, prompt }
          } catch (error) {
            if (isCancelled) return { url: "", prompt }
            console.error(`Error generating image for prompt "${prompt}":`, error)
            // Return a reliable Unsplash fallback on error
            const fallbackImages = [
              "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=512&h=512&q=85&fit=crop",
              "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=512&h=512&q=85&fit=crop",
              "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=512&h=512&q=85&fit=crop",
              "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=512&h=512&q=85&fit=crop",
              "https://images.unsplash.com/photo-1511497584788-876760111969?w=512&h=512&q=85&fit=crop",
              "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=512&h=512&q=85&fit=crop",
            ];
            const randomFallback = fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
            return {
              url: randomFallback,
              prompt,
            }
          }
        })

        const images = await Promise.all(imagePromises)
        if (!isCancelled) {
          setBackgroundImages(images)
        }
      } catch (error) {
        if (!isCancelled) {
          console.error("Error generating background images:", error)
        }
      } finally {
        if (!isCancelled) {
          setImagesLoading(false)
        }
      }
    }

    generateImages()

    return () => {
      isCancelled = true
    }
  }, [])

  return (
    <div className="min-h-screen bg-[#FAF9F6] relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {!imagesLoading && backgroundImages.length >= 8 && (
          <>
            {/* Left side diagonal panels */}
            <div className="absolute -left-32 top-20 w-64 h-96 diagonal-panel opacity-20">
              <img
                src={backgroundImages[0].url}
                alt={backgroundImages[0].prompt}
                className="w-full h-full object-cover rounded-2xl shadow-xl"
                style={{ transform: "rotate(-15deg)" }}
                onError={(e) => {
                  // Fallback to placeholder if image fails to load
                  const target = e.target as HTMLImageElement
                  target.src = `https://source.unsplash.com/featured/512x512/?${encodeURIComponent(
                    backgroundImages[0].prompt
                  )}`
                }}
              />
            </div>

            <div className="absolute -left-20 top-96 w-48 h-64 diagonal-panel-delayed opacity-30">
              <img
                src={backgroundImages[1].url}
                alt={backgroundImages[1].prompt}
                className="w-full h-full object-cover rounded-2xl shadow-lg"
                style={{ transform: "rotate(-12deg)" }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=512&h=512&q=85&fit=crop"
                }}
              />
            </div>

            {/* Right side diagonal panels */}
            <div className="absolute -right-32 top-40 w-72 h-80 diagonal-panel-slow opacity-20">
              <img
                src={backgroundImages[2].url}
                alt={backgroundImages[2].prompt}
                className="w-full h-full object-cover rounded-2xl shadow-xl"
                style={{ transform: "rotate(15deg)" }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = `https://source.unsplash.com/featured/512x512/?${encodeURIComponent(
                    backgroundImages[2].prompt
                  )}`
                }}
              />
            </div>

            <div className="absolute -right-24 bottom-32 w-56 h-72 diagonal-panel-delayed-slow opacity-30">
              <img
                src={backgroundImages[3].url}
                alt={backgroundImages[3].prompt}
                className="w-full h-full object-cover rounded-2xl shadow-lg"
                style={{ transform: "rotate(18deg)" }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=512&h=512&q=85&fit=crop"
                }}
              />
            </div>

            {/* Floating nature cards (Pinterest style) */}
            <div className="absolute left-20 bottom-20 w-40 h-40 floating-card opacity-10">
              <img
                src={backgroundImages[4].url}
                alt={backgroundImages[4].prompt}
                className="w-full h-full object-cover rounded-xl shadow-md"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = `https://source.unsplash.com/featured/512x512/?${encodeURIComponent(
                    backgroundImages[4].prompt
                  )}`
                }}
              />
            </div>

            <div className="absolute right-32 top-32 w-32 h-48 floating-card-delayed opacity-28">
              <img
                src={backgroundImages[5].url}
                alt={backgroundImages[5].prompt}
                className="w-full h-full object-cover rounded-xl shadow-md"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=512&h=512&q=85&fit=crop"
                }}
              />
            </div>

            <div className="absolute left-1/4 top-1/3 w-36 h-36 floating-card-slow opacity-22">
              <img
                src={backgroundImages[6].url}
                alt={backgroundImages[6].prompt}
                className="w-full h-full object-cover rounded-xl shadow-md"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = `https://source.unsplash.com/featured/512x512/?${encodeURIComponent(
                    backgroundImages[6].prompt
                  )}`
                }}
              />
            </div>

            <div className="absolute right-1/4 bottom-1/4 w-44 h-32 floating-card-delayed-slow opacity-10">
              <img
                src={backgroundImages[7].url}
                alt={backgroundImages[7].prompt}
                className="w-full h-full object-cover rounded-xl shadow-md"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=512&h=512&q=85&fit=crop"
                }}
              />
            </div>
          </>
        )}
      </div>

      <main className={`container mx-auto px-4 py-12 max-w-2xl relative ${isMounted ? 'z-20' : 'z-10'}`}>
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
