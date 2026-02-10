import { prisma } from '@/lib/prisma'
import type { User as SupabaseUser } from '@supabase/supabase-js'

/**
 * Syncs a Supabase user to Prisma database
 * @param supabaseUser The Supabase user object
 * @returns The Prisma user object
 * @throws Error if database connection fails or other Prisma errors occur
 */
export async function syncSupabaseUserToPrisma(supabaseUser: SupabaseUser) {
  // Check if DATABASE_URL is configured
  if (!process.env.DATABASE_URL) {
    const error = new Error("DATABASE_URL is not configured");
    error.name = "DatabaseConnectionError";
    throw error;
  }

  try {
    // Check if user exists in Prisma
    let prismaUser = await prisma.user.findUnique({
      where: { email: supabaseUser.email! },
    })

    if (!prismaUser) {
      // Create new user in Prisma
      prismaUser = await prisma.user.create({
        data: {
          email: supabaseUser.email!,
          name: supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name || null,
          image: supabaseUser.user_metadata?.avatar_url || supabaseUser.user_metadata?.picture || null,
          emailVerified: supabaseUser.email_confirmed_at ? new Date(supabaseUser.email_confirmed_at) : null,
        },
      })
    } else {
      // Update existing user if needed
      prismaUser = await prisma.user.update({
        where: { id: prismaUser.id },
        data: {
          name: supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name || prismaUser.name,
          image: supabaseUser.user_metadata?.avatar_url || supabaseUser.user_metadata?.picture || prismaUser.image,
          emailVerified: supabaseUser.email_confirmed_at ? new Date(supabaseUser.email_confirmed_at) : prismaUser.emailVerified,
        },
      })
    }

    return prismaUser
  } catch (error) {
    // Check if it's a database connection error
    const isConnectionError = 
      error instanceof Error && (
        error.message.includes("Can't reach database server") ||
        error.message.includes("P1001") ||
        error.message.includes("connection") ||
        error.message.includes("ECONNREFUSED") ||
        error.message.includes("ETIMEDOUT") ||
        error.name === "DatabaseConnectionError"
      );

    if (isConnectionError) {
      // Re-throw with a specific error type that the caller can handle silently
      const connectionError = new Error("Database connection failed");
      connectionError.name = "DatabaseConnectionError";
      throw connectionError;
    }

    // Re-throw other errors as-is
    throw error;
  }
}

