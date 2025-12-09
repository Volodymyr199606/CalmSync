import type { NextAuthConfig } from "next-auth";
import Resend from "next-auth/providers/resend";
import { sendMagicLinkEmail } from "@/lib/email";

export const authConfig: NextAuthConfig = {
  providers: [
    Resend({
      from: process.env.EMAIL_FROM || "onboarding@resend.dev",
      apiKey: process.env.RESEND_API_KEY,
      sendVerificationRequest: async ({ identifier, url }) => {
        try {
          await sendMagicLinkEmail(identifier, url);
        } catch (error) {
          // Log error with context
          console.error("Error in sendVerificationRequest:", {
            identifier,
            error: error instanceof Error ? error.message : String(error),
          });
          // Re-throw to let NextAuth handle it properly
          throw error;
        }
      },
    }),
  ],
  pages: {
    signIn: "/",
    verifyRequest: "/verify-request",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      }
      
      // Allow all other requests - middleware handles logged-in user redirects
      return true;
    },
  },
};

