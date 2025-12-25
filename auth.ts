import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { authConfig } from "./auth.config";
import { prisma } from "@/lib/prisma";

// NextAuth v5 requires AUTH_SECRET (or NEXTAUTH_SECRET for backward compatibility)
const authSecret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;

if (!authSecret) {
  console.warn("[AUTH] Missing AUTH_SECRET or NEXTAUTH_SECRET environment variable");
  console.warn("[AUTH] This is required for NextAuth. Please set it in your environment variables.");
  console.warn("[AUTH] You can generate one with: openssl rand -base64 32");
  // Don't throw here - let NextAuth handle the missing secret with its own validation
  // This allows the build to complete and shows a proper error at runtime
}

// Since we're using JWT sessions, we don't strictly need PrismaAdapter
// But we include it conditionally if database is available for user/account linking
// If database is unavailable, NextAuth will still work with JWT-only sessions
let adapter;
try {
  // Only use PrismaAdapter if database is potentially available
  // The adapter will fail gracefully if database is unavailable
  adapter = PrismaAdapter(prisma);
} catch (error) {
  console.warn("[AUTH] PrismaAdapter initialization warning (this is okay if database is unavailable):", error);
  adapter = undefined; // JWT sessions don't require an adapter
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: authSecret, // Explicitly set the secret
  adapter: adapter, // Optional - JWT sessions work without it
  session: { strategy: "jwt" }, // JWT sessions don't require database
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
    ...authConfig.callbacks,
  },
  ...authConfig,
});

