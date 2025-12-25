"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function submitEmail(formData: FormData) {
  const email = formData.get("email") as string;
  
  if (!email) {
    return { error: "Email is required" };
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { error: "Please enter a valid email address" };
  }

  console.log("[AUTH ACTION] Attempting to sign in with email:", email);
  
  // Validate environment variables
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.error("[AUTH ACTION] NEXT_PUBLIC_SUPABASE_URL is not configured");
    return { error: "Authentication service is not configured. Please contact support." };
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error("[AUTH ACTION] NEXT_PUBLIC_SUPABASE_ANON_KEY is not configured");
    return { error: "Authentication service is not configured. Please check your environment variables." };
  }

  // Get the base URL for redirect
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 
                  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 
                  "http://localhost:3000");
  
  try {
    const supabase = await createClient();
    
    // Configure email redirect URL - callback will redirect to /dashboard
    const redirectTo = `${baseUrl}/auth/callback`;
    
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectTo,
        shouldCreateUser: true, // Ensure user is created if they don't exist
      },
    });
    
    if (error) {
      console.error("[AUTH ACTION] Supabase signInWithOtp error:", error);
      return { error: error.message || "Failed to send magic link. Please try again." };
    }
    
    console.log("[AUTH ACTION] Magic link sent successfully to:", email);
    return { success: true, email };
  } catch (error: unknown) {
    console.error("[AUTH ACTION] Unexpected error:", {
      error: error instanceof Error ? error.message : String(error),
      errorType: error instanceof Error ? error.constructor.name : typeof error,
    });
    
    return { error: "Failed to send magic link. Please try again." };
  }
}

/**
 * Sign out the current user
 */
export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/');
}
