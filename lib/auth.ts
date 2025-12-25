import { createClient } from "@/lib/supabase/server";
import { syncSupabaseUserToPrisma } from "@/lib/supabase/user-sync";

/**
 * Get the current authenticated user from Supabase
 * @returns The current user or null if not authenticated
 */
export async function getCurrentUser() {
  try {
    const supabase = await createClient();
    const {
      data: { user: supabaseUser },
      error: getUserError,
    } = await supabase.auth.getUser();

    if (getUserError || !supabaseUser) {
      return null;
    }

    // Sync Supabase user to Prisma
    try {
      const prismaUser = await syncSupabaseUserToPrisma(supabaseUser);

      // Return user in a format compatible with existing code
      return {
        id: prismaUser.id,
        email: prismaUser.email,
        name: prismaUser.name,
        image: prismaUser.image,
      };
    } catch (syncError) {
      // Check if it's a database connection error
      const isConnectionError = syncError instanceof Error && 
        (syncError.message.includes("Can't reach database server") ||
         syncError.message.includes("P1001") ||
         syncError.message.includes("connection"));
      
      if (isConnectionError) {
        console.error("[AUTH] Database connection error - returning Supabase user data as fallback:", syncError.message);
      } else {
        console.error("[AUTH] Error syncing user to Prisma:", syncError);
      }
      // If sync fails, still return basic user info from Supabase
      return {
        id: supabaseUser.id,
        email: supabaseUser.email || "",
        name: supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name || null,
        image: supabaseUser.user_metadata?.avatar_url || supabaseUser.user_metadata?.picture || null,
      };
    }
  } catch (error) {
    console.error("[AUTH] Error in getCurrentUser:", error);
    return null;
  }
}

/**
 * Get the current user's ID
 * @returns The current user's ID or null if not authenticated
 */
export async function getCurrentUserId() {
  const user = await getCurrentUser();
  return user?.id ?? null;
}

/**
 * Check if the user is authenticated
 * @returns True if the user is authenticated, false otherwise
 */
export async function isAuthenticated() {
  const user = await getCurrentUser();
  return !!user;
}

/**
 * Get the current Supabase session (for direct Supabase operations)
 * @returns The Supabase session or null if not authenticated
 */
export async function getSupabaseSession() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}
