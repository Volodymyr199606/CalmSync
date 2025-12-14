"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { submitEmail } from "@/app/actions/auth"
import Link from "next/link"

export default function LandingPage() {
  const [email, setEmail] = useState("")
  const [isPending, setIsPending] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!email) {
      setError("Email is required")
      return
    }

    setIsPending(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.set("email", email)
      const result = await submitEmail(formData)
      
      if (result?.error) {
        setError(result.error)
        setIsPending(false)
      } else if (result?.success) {
        setIsSuccess(true)
        setIsPending(false)
      }
    } catch (err) {
      // If signIn redirects, it throws - treat as success
      setIsSuccess(true)
      setIsPending(false)
    }
  }

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
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-[#4A9B7F]/30 rounded-full animate-float-slow"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${15 + Math.random() * 10}s`,
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

          {/* Success state */}
          {isSuccess ? (
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
              <p className="text-sm text-gray-500">
                We've sent a magic link to <strong>{email}</strong>
              </p>
              <p className="text-sm text-gray-500">
                Click the link in the email to sign in.
              </p>
            </div>
          ) : (
            <>
              {/* Email form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-700 block">
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isPending}
                    className="h-12 rounded-xl border-gray-200 bg-white/80 backdrop-blur-sm focus-visible:ring-[#4A9B7F] focus-visible:border-[#4A9B7F] transition-all"
                  />
                  {error && (
                    <p className="text-sm text-red-600">{error}</p>
                  )}
                </div>

                <Button 
                  type="submit"
                  disabled={isPending}
                  className="w-full h-12 rounded-xl bg-[#4A9B7F] hover:bg-[#3d8168] text-white font-normal shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPending ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4 mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Sending...
                    </>
                  ) : (
                    "Continue"
                  )}
                </Button>
              </form>

              {/* Info text */}
              <div className="space-y-4 text-center">
                <p className="text-sm text-gray-500">We'll send you a magic link to sign in</p>

                <p className="text-xs text-gray-400">
                  By continuing, you agree to our{" "}
                  <Link href="/terms" className="text-gray-600 hover:text-gray-900 underline underline-offset-2">
                    Terms
                  </Link>
                  {" & "}
                  <Link href="/privacy" className="text-gray-600 hover:text-gray-900 underline underline-offset-2">
                    Privacy Policy
                  </Link>
                </p>
              </div>

              {/* Social proof */}
              <div className="text-center pt-4 border-t border-gray-200/50">
                <p className="text-xs text-gray-400">Join 1,000+ users finding their calm</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}