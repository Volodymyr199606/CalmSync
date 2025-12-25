"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { getMultipleNaturePrompts } from "@/lib/image-prompts"

interface GeneratedImage {
  url: string
  prompt: string
}

export function DashboardForm() {
  const router = useRouter()
  const [feeling, setFeeling] = useState<string | null>(null)
  const [intensity, setIntensity] = useState(5)
  const [notes, setNotes] = useState("")
  const [backgroundImages, setBackgroundImages] = useState<GeneratedImage[]>([])
  const [imagesLoading, setImagesLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const feelings = [
    { id: "stress", emoji: "😰", label: "Stress" },
    { id: "anxiety", emoji: "😟", label: "Anxiety" },
    { id: "depression", emoji: "😔", label: "Depression" },
    { id: "frustration", emoji: "😤", label: "Frustration" },
  ]

  // Handle form submission - redirects to chill page after creating experience
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!feeling) return

    setIsSubmitting(true)

    try {
      // Submit to API to create experience FIRST
      const response = await fetch("/api/experience", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          feeling: feeling.toUpperCase(),
          severity: intensity,
          notes: notes || undefined,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create experience")
      }

      const data = await response.json()
      
      // Redirect to chill page after successful experience creation
      if (data.success && data.data?.session) {
        // Redirect to chill page - it will fetch the latest session
        router.push("/chill")
        return // Exit early to prevent any further execution
      } else {
        console.error("Experience creation response missing session data:", data)
        alert("Failed to create experience. Please try again.")
      }
    } catch (error) {
      console.error("Error creating experience:", error)
      alert("Failed to create experience. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

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
        // Get 12 unique prompts for all background images (8 side + 4 floating)
        const prompts = getMultipleNaturePrompts(12)
        
        // Generate images in parallel
        // Add timestamp to ensure fresh images each time (cache-busting)
        const timestamp = Date.now()
        const imagePromises = prompts.map(async (prompt, index) => {
          try {
            // Add random seed and timestamp to ensure different images each time
            const response = await fetch(
              `/api/images/generate?prompt=${encodeURIComponent(prompt)}&width=512&height=512&t=${timestamp}&i=${index}`,
              { cache: 'no-store' }
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
      {/* Subtle vignette effect to draw focus to center - minimal to show images better */}
      <div 
        className="fixed inset-0 pointer-events-none z-[5]" 
        style={{
          background: 'radial-gradient(ellipse 90% 90% at 50% 50%, transparent 0%, rgba(250, 249, 246, 0.05) 80%, rgba(250, 249, 246, 0.15) 100%)'
        }} 
      />
      
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {!imagesLoading && backgroundImages.length >= 12 && (
          <>
            {/* Left side animated panels - well-spaced vertically to avoid overlap */}
            <motion.div
              className="absolute left-0 top-8 w-56 h-80"
              initial={{ opacity: 0, x: -40, y: 0, rotate: -15 }}
              animate={{
                opacity: [0.5, 0.7, 0.5],
                x: [-40, -25, -35, -28, -40],
                y: [0, -10, 8, -3, 0],
                rotate: [-15, -12, -17, -13, -15],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0,
              }}
            >
              <img
                src={backgroundImages[0].url}
                alt={backgroundImages[0].prompt}
                className="w-full h-full object-cover rounded-2xl shadow-xl pointer-events-none"
                style={{ filter: "contrast(1.2) saturate(1.3) brightness(1.1)" }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = `https://source.unsplash.com/featured/512x512/?${encodeURIComponent(
                    backgroundImages[0].prompt
                  )}`
                }}
              />
            </motion.div>

            <motion.div
              className="absolute left-4 top-[420px] w-52 h-64"
              initial={{ opacity: 0, x: -30, y: 0, rotate: -12 }}
              animate={{
                opacity: [0.55, 0.75, 0.55],
                x: [-30, -15, -28, -18, -30],
                y: [0, 12, -8, 4, 0],
                rotate: [-12, -9, -14, -10, -12],
              }}
              transition={{
                duration: 24,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 3,
              }}
            >
              <img
                src={backgroundImages[1].url}
                alt={backgroundImages[1].prompt}
                className="w-full h-full object-cover rounded-2xl shadow-lg pointer-events-none"
                style={{ filter: "contrast(1.3) saturate(1.4) brightness(1.05)" }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=512&h=512&q=85&fit=crop"
                }}
              />
            </motion.div>

            <motion.div
              className="absolute left-2 bottom-16 w-48 h-56"
              initial={{ opacity: 0, x: -25, y: 0, rotate: -10 }}
              animate={{
                opacity: [0.5, 0.7, 0.5],
                x: [-25, -12, -22, -15, -25],
                y: [0, -15, 12, -6, 0],
                rotate: [-10, -7, -12, -8, -10],
              }}
              transition={{
                duration: 22,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 6,
              }}
            >
              <img
                src={backgroundImages[8].url}
                alt={backgroundImages[8].prompt}
                className="w-full h-full object-cover rounded-2xl shadow-lg pointer-events-none"
                style={{ filter: "contrast(1.25) saturate(1.35) brightness(1.08)" }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=512&h=512&q=85&fit=crop"
                }}
              />
            </motion.div>

            {/* Right side animated panels - well-spaced vertically to avoid overlap */}
            <motion.div
              className="absolute right-0 top-16 w-64 h-72"
              initial={{ opacity: 0, x: 40, y: 0, rotate: 15 }}
              animate={{
                opacity: [0.5, 0.7, 0.5],
                x: [40, 25, 35, 28, 40],
                y: [0, -12, 10, -6, 0],
                rotate: [15, 12, 17, 13, 15],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2,
              }}
            >
              <img
                src={backgroundImages[2].url}
                alt={backgroundImages[2].prompt}
                className="w-full h-full object-cover rounded-2xl shadow-xl pointer-events-none"
                style={{ filter: "contrast(1.2) saturate(1.3) brightness(1.1)" }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = `https://source.unsplash.com/featured/512x512/?${encodeURIComponent(
                    backgroundImages[2].prompt
                  )}`
                }}
              />
            </motion.div>

            <motion.div
              className="absolute right-4 top-[400px] w-52 h-64"
              initial={{ opacity: 0, x: 30, y: 0, rotate: 18 }}
              animate={{
                opacity: [0.55, 0.75, 0.55],
                x: [30, 15, 28, 18, 30],
                y: [0, 15, -12, 8, 0],
                rotate: [18, 14, 19, 16, 18],
              }}
              transition={{
                duration: 24,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 5,
              }}
            >
              <img
                src={backgroundImages[3].url}
                alt={backgroundImages[3].prompt}
                className="w-full h-full object-cover rounded-2xl shadow-lg pointer-events-none"
                style={{ filter: "contrast(1.3) saturate(1.4) brightness(1.05)" }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=512&h=512&q=85&fit=crop"
                }}
              />
            </motion.div>

            <motion.div
              className="absolute right-2 bottom-20 w-48 h-56"
              initial={{ opacity: 0, x: 25, y: 0, rotate: 12 }}
              animate={{
                opacity: [0.5, 0.7, 0.5],
                x: [25, 12, 22, 15, 25],
                y: [0, -18, 14, -9, 0],
                rotate: [12, 9, 14, 10, 12],
              }}
              transition={{
                duration: 22,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 8,
              }}
            >
              <img
                src={backgroundImages[9].url}
                alt={backgroundImages[9].prompt}
                className="w-full h-full object-cover rounded-2xl shadow-lg pointer-events-none"
                style={{ filter: "contrast(1.25) saturate(1.35) brightness(1.08)" }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = "https://images.unsplash.com/photo-1511497584788-876760111969?w=512&h=512&q=85&fit=crop"
                }}
              />
            </motion.div>

            {/* Center floating images - positioned behind card, well-spaced to avoid overlap */}
            {/* Top center - behind card header */}
            <motion.div
              className="absolute left-[20%] top-[15%] w-40 h-40"
              initial={{ opacity: 0, x: -10, y: 10, rotate: -2 }}
              animate={{
                opacity: [0.5, 0.7, 0.5],
                x: [-10, 15, -8, 12, -10],
                y: [10, -12, 8, -10, 10],
                rotate: [-2, 3, -1, 2, -2],
              }}
              transition={{
                duration: 28,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 8,
              }}
            >
              <img
                src={backgroundImages[6].url}
                alt={backgroundImages[6].prompt}
                className="w-full h-full object-cover rounded-xl shadow-md pointer-events-none"
                style={{ filter: "contrast(1.3) saturate(1.4) brightness(1.05)" }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = `https://source.unsplash.com/featured/512x512/?${encodeURIComponent(
                    backgroundImages[6].prompt
                  )}`
                }}
              />
            </motion.div>

            {/* Center left - behind card middle */}
            <motion.div
              className="absolute left-[25%] top-[45%] w-36 h-36"
              initial={{ opacity: 0, x: -8, y: 12, rotate: -3 }}
              animate={{
                opacity: [0.5, 0.7, 0.5],
                x: [-8, 12, -5, 10, -8],
                y: [12, -8, 10, -6, 12],
                rotate: [-3, 2, -1, 1, -3],
              }}
              transition={{
                duration: 26,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 10,
              }}
            >
              <img
                src={backgroundImages[10].url}
                alt={backgroundImages[10].prompt}
                className="w-full h-full object-cover rounded-xl shadow-md pointer-events-none"
                style={{ filter: "contrast(1.2) saturate(1.3) brightness(1.05)" }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=512&h=512&q=85&fit=crop"
                }}
              />
            </motion.div>

            {/* Center right - behind card middle */}
            <motion.div
              className="absolute right-[25%] top-[50%] w-40 h-36"
              initial={{ opacity: 0, x: 10, y: -12, rotate: 4 }}
              animate={{
                opacity: [0.5, 0.7, 0.5],
                x: [10, -12, 8, -10, 10],
                y: [-12, 15, -10, 12, -12],
                rotate: [4, -2, 3, -1, 4],
              }}
              transition={{
                duration: 29,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 14,
              }}
            >
              <img
                src={backgroundImages[11].url}
                alt={backgroundImages[11].prompt}
                className="w-full h-full object-cover rounded-xl shadow-md pointer-events-none"
                style={{ filter: "contrast(1.25) saturate(1.35) brightness(1.08)" }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = "https://images.unsplash.com/photo-1469474968028-56645f4e32e6?w=512&h=512&q=85&fit=crop"
                }}
              />
            </motion.div>

            {/* Bottom center - behind card bottom */}
            <motion.div
              className="absolute right-[28%] bottom-[25%] w-44 h-32"
              initial={{ opacity: 0, x: 12, y: -8, rotate: 2 }}
              animate={{
                opacity: [0.5, 0.7, 0.5],
                x: [12, -10, 8, -6, 12],
                y: [-8, 12, -10, 8, -8],
                rotate: [2, -3, 1, -2, 2],
              }}
              transition={{
                duration: 32,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 12,
              }}
            >
              <img
                src={backgroundImages[7].url}
                alt={backgroundImages[7].prompt}
                className="w-full h-full object-cover rounded-xl shadow-md pointer-events-none"
                style={{ filter: "contrast(1.15) saturate(1.25)" }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=512&h=512&q=85&fit=crop"
                }}
              />
            </motion.div>

            {/* Additional floating images - positioned to avoid overlap */}
            <motion.div
              className="absolute left-20 bottom-32 w-40 h-40"
              initial={{ opacity: 0, x: -20, y: 20, rotate: -5 }}
              animate={{
                opacity: [0.4, 0.65, 0.4],
                x: [-20, 10, -15, 5, -20],
                y: [20, -10, 15, -5, 20],
                rotate: [-5, 2, -3, 1, -5],
              }}
              transition={{
                duration: 25,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0,
              }}
            >
              <img
                src={backgroundImages[4].url}
                alt={backgroundImages[4].prompt}
                className="w-full h-full object-cover rounded-xl shadow-md pointer-events-none"
                style={{ filter: "contrast(1.3) saturate(1.4) brightness(1.05)" }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = `https://source.unsplash.com/featured/512x512/?${encodeURIComponent(
                    backgroundImages[4].prompt
                  )}`
                }}
              />
            </motion.div>

            <motion.div
              className="absolute right-32 top-32 w-32 h-48"
              initial={{ opacity: 0, x: 15, y: -15, rotate: 3 }}
              animate={{
                opacity: [0.35, 0.6, 0.35],
                x: [15, -8, 12, -5, 15],
                y: [-15, 8, -12, 5, -15],
                rotate: [3, -2, 4, -1, 3],
              }}
              transition={{
                duration: 30,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 5,
              }}
            >
              <img
                src={backgroundImages[5].url}
                alt={backgroundImages[5].prompt}
                className="w-full h-full object-cover rounded-xl shadow-md pointer-events-none"
                style={{ filter: "contrast(1.15) saturate(1.25)" }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=512&h=512&q=85&fit=crop"
                }}
              />
            </motion.div>
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

          {/* Content card with enhanced visual hierarchy - semi-transparent to show background images */}
          <form onSubmit={handleSubmit} className="bg-white/85 backdrop-blur-sm rounded-2xl border border-gray-200/80 shadow-2xl p-8 space-y-8 ring-1 ring-black/5">
            {/* Feeling selection */}
            <div className="space-y-4">
              <label className="text-sm font-medium text-gray-700">How are you feeling?</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {feelings.map((item) => (
                  <button
                    key={item.id}
                    type="button"
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
                    type="button"
                    onClick={() => setIntensity(num)}
                    className={`
                      h-10 w-full rounded-lg text-sm font-medium transition-all shadow-sm
                      ${
                        intensity >= num
                          ? "bg-[#3d8168] hover:bg-[#35705a] text-white shadow-md"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                      }
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
              <div className="relative">
                <div className="absolute inset-0 bg-gray-50/80 rounded-xl -z-10" />
                <Textarea
                  placeholder="Add any additional context about how you're feeling..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-24 resize-none rounded-xl border-gray-200 bg-white/90 focus-visible:ring-2 focus-visible:ring-[#4A9B7F]/20 focus-visible:border-[#4A9B7F] transition-all"
                />
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full h-12 rounded-xl bg-[#3d8168] hover:bg-[#35705a] text-white font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              disabled={!feeling || isSubmitting}
            >
              {isSubmitting ? "Creating Experience..." : "Create Relaxation Experience"}
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
}
