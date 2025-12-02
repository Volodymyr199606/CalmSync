import { signIn } from "../auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import type { SVGProps } from "react";

// CalmSync Icon Component - inspired by Airbnb's iconic logo style
function CalmSyncIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
      {/* Wave-like calm symbol with heart shape */}
      <path
        d="M16 28C16 28 6 20 6 12C6 8.68629 8.68629 6 12 6C13.8 6 15.4 6.8 16 8C16.6 6.8 18.2 6 20 6C23.3137 6 26 8.68629 26 12C26 20 16 28 16 28Z"
        fillRule="evenodd"
        clipRule="evenodd"
      />
      {/* Inner wave detail */}
      <path
        d="M16 12C16 12 13 10 11 12C11 12 11 14 13 16C13 16 14 17 16 18C16 18 17 17 18 16C20 14 20 12 20 12C18 10 16 12 16 12Z"
        fill="white"
        opacity="0.4"
      />
    </svg>
  );
}

export default function Home() {
  return (
    <div className="w-full flex flex-col items-center justify-center px-4 py-16 sm:px-6 md:px-8 min-h-[calc(100vh-80px)]">
      <div className="w-full max-w-xl mx-auto space-y-12">
          
          {/* Branding Section */}
          <div className="text-center space-y-8 animate-fade-in">
            
            {/* Logo */}
            <div className="flex justify-center">
              <div className="relative group">
                <CalmSyncIcon className="h-24 w-24 sm:h-32 sm:w-32 text-purple-600 drop-shadow-lg transition-transform duration-300 group-hover:scale-105" />
                <div className="absolute inset-0 blur-2xl bg-purple-400/30 rounded-full -z-10 group-hover:blur-3xl transition-all duration-300" />
              </div>
            </div>
            
            {/* Brand Name */}
            <div className="space-y-4">
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-gray-900 tracking-tight leading-tight">
                CalmSync
              </h1>
              
              {/* Tagline */}
              <div className="max-w-md mx-auto space-y-3 px-4">
                <p className="text-xl sm:text-2xl text-gray-700 font-semibold leading-snug">
                  Your personal relaxation companion
                </p>
                
                {/* Description */}
                <p className="text-base sm:text-lg text-gray-600 leading-relaxed pt-2">
                  Find peace through personalized relaxation experiences tailored to your mood
                </p>
              </div>
            </div>
            
          </div>
          
          {/* Sign In Card */}
          <Card className="backdrop-blur-lg bg-white/95 border-0 shadow-2xl hover:shadow-3xl transition-shadow duration-300">
            
            {/* Card Header */}
            <CardHeader className="space-y-3 text-center pb-6">
              <CardTitle className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
                Welcome
              </CardTitle>
              <CardDescription className="text-base sm:text-lg text-gray-600 max-w-sm mx-auto leading-relaxed">
                Enter your email to receive a magic link to sign in.
                <span className="block text-sm text-gray-500 mt-1">No password needed.</span>
              </CardDescription>
            </CardHeader>
            
            {/* Card Content */}
            <CardContent className="space-y-6 px-6 sm:px-8 pb-8">
              
              <form
                action={async (formData: FormData) => {
                  "use server";
                  const email = formData.get("email") as string;
                  await signIn("resend", { email, redirectTo: "/dashboard" });
                }}
                className="space-y-6"
              >
                
                {/* Email Input */}
                <div className="space-y-3">
                  <label 
                    htmlFor="email" 
                    className="block text-sm font-semibold text-gray-800 tracking-wide"
                  >
                    Email address
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    className="h-12 text-base bg-white border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 rounded-lg transition-all duration-200 placeholder:text-gray-400"
                  />
                </div>
                
                {/* Submit Button */}
                <div className="flex justify-center pt-2">
                  <Button 
                    type="submit" 
                    className="w-auto px-8 py-3 text-sm font-medium text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex flex-col items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600"
                  >
                    <svg
                      className="h-6 w-6 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <span>Send Magic Link</span>
                  </Button>
                </div>
                
              </form>

            </CardContent>
          </Card>
        </div>
      </div>
  );
}

