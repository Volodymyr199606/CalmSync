"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"

interface Particle {
  id: string
  top: string
  left: string
  delay: string
  duration: string
}

function VerifyRequestContent() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""
  const [particles, setParticles] = useState<Particle[]>([])

  // Generate particles on client side only to avoid hydration mismatch
  useEffect(() => {
    const timestamp = Date.now()
    const generatedParticles = Array.from({ length: 75 }).map((_, index) => ({
      id: `particle-${timestamp}-${index}`,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`,
      duration: `${15 + Math.random() * 10}s`,
    }))
    setParticles(generatedParticles)
  }, [])

  return (
    <div className="relative min-h-screen bg-[#FAF9F6] overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient wave layers - slow moving */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-br from-[#4A9B7F]/15 via-[#4A9B7F]/5 to-transparent rounded-full blur-3xl animate-wave-1" />
        <div className="absolute top-1/3 -right-20 w-[500px] h-[500px] bg-gradient-to-tl from-[#6BB89F]/10 via-transparent to-transparent rounded-full blur-3xl animate-wave-2" />
        <div className="absolute -bottom-40 left-1/3 w-[600px] h-[600px] bg-gradient-to-tr from-[#4A9B7F]/8 to-transparent rounded-full blur-3xl animate-wave-3" />

        {/* Additional gradient waves for richer atmosphere */}
        <div
          className="absolute top-1/4 left-1/4 w-[450px] h-[450px] bg-gradient-to-br from-[#5BAA8A]/12 via-transparent to-[#4A9B7F]/5 rounded-full blur-3xl animate-wave-1"
          style={{ animationDuration: "40s" }}
        />
        <div
          className="absolute bottom-1/4 right-1/3 w-[550px] h-[550px] bg-gradient-to-tl from-[#4A9B7F]/10 via-[#6BB89F]/6 to-transparent rounded-full blur-3xl animate-wave-2"
          style={{ animationDuration: "45s", animationDelay: "5s" }}
        />
        <div
          className="absolute top-2/3 left-1/2 w-[400px] h-[400px] bg-gradient-to-tr from-transparent via-[#5BAA8A]/8 to-[#4A9B7F]/6 rounded-full blur-3xl animate-wave-3"
          style={{ animationDuration: "50s", animationDelay: "10s" }}
        />
        <div
          className="absolute top-10 left-2/3 w-[480px] h-[480px] bg-gradient-to-bl from-[#6BB89F]/9 to-transparent rounded-full blur-3xl animate-wave-1"
          style={{ animationDuration: "55s", animationDelay: "8s" }}
        />
        <div
          className="absolute bottom-10 left-10 w-[520px] h-[520px] bg-gradient-to-br from-[#4A9B7F]/11 via-[#5BAA8A]/7 to-transparent rounded-full blur-3xl animate-wave-2"
          style={{ animationDuration: "48s", animationDelay: "3s" }}
        />

        {/* Bokeh effect circles */}
        <div className="absolute top-20 right-1/4 w-32 h-32 bg-[#4A9B7F]/5 rounded-full blur-2xl animate-float-slow" />
        <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-[#6BB89F]/5 rounded-full blur-2xl animate-float-medium" />
        <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-[#4A9B7F]/8 rounded-full blur-xl animate-float-fast" />

        {/* Floating particles - more prominent */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-1 h-1 bg-[#4A9B7F]/30 rounded-full animate-float-slow pointer-events-none"
            style={{
              top: particle.top,
              left: particle.left,
              animationDelay: particle.delay,
              animationDuration: particle.duration,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12">
        <div className="w-full max-w-md space-y-12 animate-fade-in">
          {/* Logo with enhanced animation */}
          <div className="flex justify-center">
            <div className="relative">
              {/* Outer glow ring */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-[#4A9B7F]/10 animate-pulse-glow" />
              </div>
              {/* Middle ring */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full border-2 border-[#4A9B7F]/20 animate-breathe" />
              </div>
              {/* Inner ring */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full border-2 border-[#4A9B7F]/30 animate-breathe delay-500" />
              </div>
              {/* Core dot with ping */}
              <div className="relative flex items-center justify-center w-24 h-24">
                <div className="absolute w-4 h-4 bg-[#4A9B7F] rounded-full" />
                <div className="absolute w-4 h-4 bg-[#4A9B7F] rounded-full animate-ping" />
              </div>
            </div>
          </div>

          {/* Title and tagline */}
          <div className="text-center space-y-3">
            <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 tracking-tight">CalmSync</h1>
            <p className="text-gray-500 text-base">Your personal relaxation companion</p>
          </div>

          {/* Success message */}
          <div className="space-y-4 text-center animate-fade-in">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#4A9B7F]/10 mb-4">
              <svg
                className="w-6 h-6 text-[#4A9B7F]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Check your email
            </h2>
            {email && (
              <p className="text-sm text-gray-500">
                We've sent a magic link to <strong>{email}</strong>
              </p>
            )}
            <p className="text-sm text-gray-500">
              Click the link in the email to sign in.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
