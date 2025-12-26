import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Connection URL validation
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  const error = "[PRISMA] DATABASE_URL environment variable is not set";
  console.error(error);
  // In production (Vercel), provide helpful error
  if (process.env.VERCEL) {
    console.error(
      "[PRISMA] To fix this, add DATABASE_URL to your Vercel environment variables: " +
      "https://vercel.com/dashboard -> Your Project -> Settings -> Environment Variables"
    );
  }
}

// For serverless environments (Vercel), use connection pooling
// Supabase/Neon provides pooled connections to avoid exhausting connections
// If DATABASE_URL doesn't contain 'pooler' or 'pooling', we might want to use a pooled URL
// However, we'll use the provided DATABASE_URL as-is and let Prisma handle pooling
const prismaConfig: ConstructorParameters<typeof PrismaClient>[0] = {
  log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  // Better error formatting
  errorFormat: process.env.NODE_ENV === "development" ? "pretty" : "minimal",
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient(prismaConfig);

// Handle connection errors gracefully
// In serverless (Vercel), don't persist the client across invocations
// In development, reuse the same client to avoid connection exhaustion
if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
  globalForPrisma.prisma = prisma;
}

// Note: We don't test the connection on startup in production
// because it can cause issues if the database is temporarily unavailable.
// Individual queries will handle connection errors gracefully.




