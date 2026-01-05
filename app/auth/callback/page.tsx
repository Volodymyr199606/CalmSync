"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

/**
 * Client-side auth callback page for better mobile browser support
 * This handles the OAuth/PKCE callback and ensures cookies are properly set on mobile browsers
 */
export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    // Extract error and code from URL
    const error = searchParams.get("error");
    const errorDescription = searchParams.get("error_description");
    const code = searchParams.get("code");
    
    // If there's an error, redirect to home with error message
    if (error || errorDescription) {
      const errorMessage = errorDescription || error || "Authentication failed";
      router.push(`/?error=${encodeURIComponent(errorMessage)}`);
      return;
    }
    
    // If there's a code, the server callback route should handle it
    // But if we're on this page, it means the server redirect might have failed
    // Redirect to server callback route to handle it properly
    if (code) {
      // Let the server route handle the code exchange
      window.location.href = `/auth/callback?${searchParams.toString()}`;
      return;
    }
    
    // No code or error - redirect to home
    router.push("/");
  }, [router, searchParams]);
  
  // Show loading state while processing
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="text-muted-foreground">Completing sign in...</p>
      </div>
    </div>
  );
}
