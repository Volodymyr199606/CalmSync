"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

/**
 * Clear PKCE-related cookies to prevent mismatches when switching devices
 * This helps resolve "code challenge does not match" errors on mobile
 * 
 * Supabase stores PKCE code verifiers in cookies with names like:
 * - sb-{project-ref}-auth-token
 * - sb-{project-ref}-auth-token-code-verifier
 * And uses cookie prefixes like "sb-" followed by the project reference
 */
async function clearPkceCookies() {
  const cookieStore = await cookies();
  
  // Get all cookies and clear any that look like Supabase auth/PKCE cookies
  const allCookies = cookieStore.getAll();
  for (const cookie of allCookies) {
    const name = cookie.name.toLowerCase();
    // Match Supabase cookie patterns: sb-*, *-auth-token*, *-code-verifier*
    if (
      name.startsWith("sb-") || 
      name.includes("supabase") ||
      name.includes("auth-token") ||
      name.includes("code-verifier") ||
      name.includes("pkce")
    ) {
      try {
        // Delete with path and domain options to ensure it's cleared properly
        cookieStore.delete({
          name: cookie.name,
          path: "/",
          // Don't specify domain to match the cookie's original domain
        });
      } catch {
        // Ignore errors when clearing cookies (some may be httpOnly)
      }
    }
  }
}

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

  // Get the base URL for redirect - ensure it's the full production URL
  // This is critical for mobile browsers to properly handle redirects
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 
                  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 
                  "http://localhost:3000");
  
  try {
    // Clear any stale PKCE cookies before initiating new login
    // This prevents "code challenge does not match" errors when using magic links on mobile
    await clearPkceCookies();
    
    const supabase = await createClient();
    
    // Configure email redirect URL - use absolute URL for mobile browser compatibility
    // Mobile browsers (especially Safari, Chrome mobile) require absolute URLs
    const redirectTo = `${baseUrl}/auth/callback`;
    
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectTo,
        shouldCreateUser: true, // Ensure user is created if they don't exist
        // PKCE flow is enabled by default in Supabase for better security and mobile support
      },
    });
    
    if (error) {
      console.error("[AUTH ACTION] Supabase signInWithOtp error:", error);
      
      // Provide user-friendly error messages for common issues
      if (error.message?.includes("code challenge") || error.message?.includes("code verifier")) {
        return { 
          error: "Authentication session expired. Please try again. If this persists, try clearing your browser cookies." 
        };
      }

      if (
        error.message?.toLowerCase().includes("rate limit") ||
        error.message?.toLowerCase().includes("email rate limit")
      ) {
        return {
          error:
            "Too many login emails were sent recently. Wait about an hour and try again, or ask the app owner to enable custom SMTP in Supabase (e.g. Resend) for higher limits.",
        };
      }
      
      return { error: error.message || "Failed to send magic link. Please try again." };
    }
    
    console.log("[AUTH ACTION] Magic link sent successfully to:", email);
    return { success: true, email };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[AUTH ACTION] Unexpected error:", {
      error: message,
      errorType: error instanceof Error ? error.constructor.name : typeof error,
    });

    if (
      message.toLowerCase().includes("fetch failed") ||
      message.toLowerCase().includes("econnrefused") ||
      message.toLowerCase().includes("network")
    ) {
      return {
        error:
          "Cannot reach the authentication service. If you recently renewed Supabase, update NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel and redeploy.",
      };
    }

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
