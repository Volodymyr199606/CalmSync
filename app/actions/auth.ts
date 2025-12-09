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

  try {
    await signIn("resend", { 
      email, 
      redirectTo: "/dashboard"
    });
    
    // If signIn doesn't throw, return success
    return { success: true, email };
  } catch (error: unknown) {
    // NextAuth signIn may throw a redirect error, which means it worked
    // Check if it's a redirect (which indicates success)
    if (error && typeof error === "object" && "digest" in error) {
      // This is likely a Next.js redirect, which means the email was sent successfully
      return { success: true, email };
    }
    
    // Log the actual error for debugging
    console.error("Magic link sign-in error:", error);
    
    // Extract meaningful error message
    let errorMessage = "Failed to send magic link. Please try again.";
    if (error instanceof Error) {
      const message = error.message.toLowerCase();
      if (message.includes("resend") || message.includes("api key")) {
        errorMessage = "Email service is not properly configured. Please contact support.";
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
