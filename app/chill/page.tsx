"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { X, Volume2, VolumeX } from "lucide-react"

export default function ChillPage() {
  const router = useRouter()
  const audioRef = useRef<HTMLAudioElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isMuted, setIsMuted] = useState(false)
  const animationRef = useRef<number>()

  useEffect(() => {
    // Auto-play ambient music when page loads
    if (audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.log("[v0] Audio autoplay prevented:", error)
      })
    }

    // Setup canvas animation
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    const leaves: Array<{
      x: number
      y: number
      vx: number
      vy: number
      size: number
      rotation: number
      rotationSpeed: number
      opacity: number
      hue: number
    }> = []

    // Create leaves with natural colors
    const leafCount = 30
    for (let i = 0; i < leafCount; i++) {
      leaves.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: Math.random() * 0.2 + 0.1, // Gentle downward drift
        size: Math.random() * 8 + 4,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        opacity: Math.random() * 0.4 + 0.2,
        hue: Math.random() * 30 + 140, // Green-teal natural tones
      })
    }

    const waves: Array<{
      baseY: number
      amplitude: number
      frequency: number
      speed: number
      color: string
    }> = [
      {
        baseY: canvas.height * 0.3,
        amplitude: 60,
        frequency: 0.003,
        speed: 0.3,
        color: "rgba(134, 239, 172, 0.08)", // Soft green
      },
      {
        baseY: canvas.height * 0.5,
        amplitude: 80,
        frequency: 0.002,
        speed: 0.2,
        color: "rgba(147, 197, 253, 0.08)", // Soft blue
      },
      {
        baseY: canvas.height * 0.7,
        amplitude: 50,
        frequency: 0.004,
        speed: 0.25,
        color: "rgba(196, 181, 253, 0.06)", // Soft purple
      },
    ]

    // Animation loop
    let time = 0
    const animate = () => {
      time += 0.01

      const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      bgGradient.addColorStop(0, "rgb(15, 23, 42)") // Dark blue
      bgGradient.addColorStop(0.5, "rgb(17, 24, 39)") // Dark gray
      bgGradient.addColorStop(1, "rgb(20, 30, 48)") // Deep blue
      ctx.fillStyle = bgGradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      waves.forEach((wave) => {
        ctx.fillStyle = wave.color
        ctx.beginPath()
        ctx.moveTo(0, canvas.height)

        for (let x = 0; x <= canvas.width; x += 10) {
          const y =
            wave.baseY +
            Math.sin(x * wave.frequency + time * wave.speed) * wave.amplitude +
            Math.sin(x * wave.frequency * 1.5 + time * wave.speed * 0.7) * (wave.amplitude * 0.5)

          if (x === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        }

        ctx.lineTo(canvas.width, canvas.height)
        ctx.lineTo(0, canvas.height)
        ctx.closePath()
        ctx.fill()
      })

      leaves.forEach((leaf) => {
        // Natural swaying motion with gentle breeze effect
        leaf.x += leaf.vx + Math.sin(time * 0.5 + leaf.y * 0.01) * 0.3
        leaf.y += leaf.vy
        leaf.rotation += leaf.rotationSpeed

        // Reset leaves that drift off screen
        if (leaf.y > canvas.height + 20) {
          leaf.y = -20
          leaf.x = Math.random() * canvas.width
        }
        if (leaf.x < -20) leaf.x = canvas.width + 20
        if (leaf.x > canvas.width + 20) leaf.x = -20

        // Draw leaf shape with soft glow
        ctx.save()
        ctx.translate(leaf.x, leaf.y)
        ctx.rotate(leaf.rotation)

        // Soft outer glow
        const glowGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, leaf.size * 2)
        glowGradient.addColorStop(0, `hsla(${leaf.hue}, 60%, 70%, ${leaf.opacity * 0.6})`)
        glowGradient.addColorStop(1, "transparent")
        ctx.fillStyle = glowGradient
        ctx.beginPath()
        ctx.arc(0, 0, leaf.size * 2, 0, Math.PI * 2)
        ctx.fill()

        // Leaf shape (organic oval)
        ctx.fillStyle = `hsla(${leaf.hue}, 50%, 60%, ${leaf.opacity})`
        ctx.beginPath()
        ctx.ellipse(0, 0, leaf.size, leaf.size * 0.6, 0, 0, Math.PI * 2)
        ctx.fill()

        ctx.restore()
      })

      if (Math.random() > 0.95) {
        const sparkleX = Math.random() * canvas.width
        const sparkleY = Math.random() * canvas.height * 0.5 // Upper half only
        const sparkleSize = Math.random() * 2 + 1

        ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.3})`
        ctx.beginPath()
        ctx.arc(sparkleX, sparkleY, sparkleSize, 0, Math.PI * 2)
        ctx.fill()
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted
      setIsMuted(!isMuted)
    }
  }

  const handleExit = () => {
    if (audioRef.current) {
      audioRef.current.pause()
    }
    router.push("/dashboard")
  }

  return (
    <div className="relative w-full h-screen bg-slate-900 overflow-hidden">
      {/* Canvas for natural generative animations */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Subtle vignette for depth */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-slate-900/40 pointer-events-none" />

      {/* Top controls */}
      <div className="absolute top-6 right-6 flex items-center gap-4 z-10">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleMute}
          className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border border-white/20"
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleExit}
          className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border border-white/20"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        <div className="text-center space-y-4">
          <h1 className="text-5xl md:text-6xl font-light text-white/90 tracking-wide">Breathe</h1>
          <p className="text-lg text-white/60 font-light">Let the moment flow through you</p>
        </div>
      </div>

      {/* Audio player */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-2xl">
          <p className="text-xs text-white/60 mb-2 text-center">Ambient Experience</p>
          <audio ref={audioRef} controls loop className="w-80">
            <source src="/placeholder.mp3?query=ambient chill relaxation music" type="audio/mpeg" />
          </audio>
        </div>
      </div>

      {/* Breathing guide circle (gentle pulsing) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative">
          <div
            className="w-32 h-32 rounded-full border-2 border-emerald-300/20 animate-ping"
            style={{ animationDuration: "4s" }}
          />
          <div
            className="absolute inset-0 w-32 h-32 rounded-full border-2 border-emerald-300/30 animate-pulse"
            style={{ animationDuration: "3s" }}
          />
        </div>
      </div>
    </div>
  )
}