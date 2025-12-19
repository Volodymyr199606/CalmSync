"use server";

import { signIn } from "@/auth";

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
  
  try {
    await signIn("resend", { 
      email, 
      redirectTo: "/dashboard"
    });
    
    // If signIn doesn't throw, return success
    console.log("[AUTH ACTION] signIn completed without error");
    return { success: true, email };
  } catch (error: unknown) {
    // NextAuth signIn may throw a redirect error, which means it worked
    // Check if it's a redirect (which indicates success)
    if (error && typeof error === "object" && "digest" in error) {
      // This is likely a Next.js redirect, which means the email was sent successfully
      console.log("[AUTH ACTION] Redirect detected (email sent successfully)");
      return { success: true, email };
    }
    
    // Log the actual error for debugging
    console.error("[AUTH ACTION] Magic link sign-in error:", {
      error: error instanceof Error ? error.message : String(error),
      errorType: error instanceof Error ? error.constructor.name : typeof error,
      hasDigest: error && typeof error === "object" && "digest" in error,
    });
    
    // Extract meaningful error message
    let errorMessage = "Failed to send magic link. Please try again.";
    if (error instanceof Error) {
      const message = error.message.toLowerCase();
      if (message.includes("resend") || message.includes("api key")) {
        errorMessage = "Email service configuration error. Please check your RESEND_API_KEY in .env.local";
      } else if (message.includes("domain") || message.includes("from")) {
        errorMessage = "Email domain not verified. Please verify your domain in Resend or use onboarding@resend.dev";
      } else if (message.includes("invalid") || message.includes("email")) {
        errorMessage = "Please enter a valid email address.";
      } else if (!message.includes("redirect") && !message.includes("digest")) {
        // Only use custom message if it's not a redirect error
        errorMessage = error.message;
      }
    }
    
    return { error: errorMessage };
  }
}
