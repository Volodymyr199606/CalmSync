import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { authConfig } from "./auth.config";
import { prisma } from "@/lib/prisma";

// NextAuth v5 requires AUTH_SECRET (or NEXTAUTH_SECRET for backward compatibility)
const authSecret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;

if (!authSecret) {
  console.error("[AUTH] Missing AUTH_SECRET or NEXTAUTH_SECRET environment variable");
  console.error("[AUTH] This is required for NextAuth. Please set it in your environment variables.");
  console.error("[AUTH] You can generate one with: openssl rand -base64 32");
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: authSecret, // Explicitly set the secret
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
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

