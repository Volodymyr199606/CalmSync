import type { NextAuthConfig } from "next-auth";
import Resend from "next-auth/providers/resend";

export const authConfig: NextAuthConfig = {
  providers: [
    Resend({
      from: process.env.EMAIL_FROM || "onboarding@resend.dev",
      apiKey: process.env.RESEND_API_KEY,
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
      const isVerifyRequest = nextUrl.pathname === "/verify-request";
      
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn && !isVerifyRequest) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }
      return true;
    },
  },
};

