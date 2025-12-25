import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Connection URL validation
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("[PRISMA] DATABASE_URL environment variable is not set");
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

// Handle connection errors gracefully
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// Note: We don't test the connection on startup in production
// because it can cause issues if the database is temporarily unavailable.
// Individual queries will handle connection errors gracefully.




