"use client";

import { useState } from "react";
import { CalmSyncLogo } from "@/components/CalmSyncLogo";
import { LandingPageForm } from "@/components/LandingPageForm";
import Link from "next/link";

export default function Home() {
  const [isFormSuccess, setIsFormSuccess] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-background relative">
      {/* Background Gradient */}
      <div 
        className="fixed inset-0 -z-10" 
        style={{
          background: 'linear-gradient(to bottom, hsl(120 15% 93%), hsl(120 20% 98%))'
        }}
      />
      
      {/* Content Wrapper */}
      <div className="w-full max-w-sm mx-auto space-y-16">
        
        {/* Logo Container */}
        <div className="flex justify-center">
          <CalmSyncLogo />
        </div>
        
        {/* Brand Name */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            CalmSync
          </h1>
          
          {/* Tagline */}
          <p className="text-base leading-relaxed text-muted-foreground">
            Your personal relaxation companion
          </p>
        </div>
        
        {/* Email Form */}
        <LandingPageForm onSuccessChange={setIsFormSuccess} />
        
        {/* Helper Text - Hidden when form is successful */}
        {!isFormSuccess && (
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              We'll send you a magic link to sign in
            </p>
          </div>
        )}
        
        {/* Footer - Hidden when form is successful */}
        {!isFormSuccess && (
          <div className="text-center mt-6">
            <p className="text-xs text-muted-foreground">
              By continuing, you agree to our{" "}
              <Link 
                href="/terms" 
                className="text-foreground hover:underline transition-colors"
              >
                Terms & Privacy Policy
              </Link>
            </p>
          </div>
        )}
        
      </div>
    </div>
  );
}
