import { auth } from "../auth";

/**
 * Get the current authenticated user
 * @returns The current user or null if not authenticated
 */
export async function getCurrentUser() {
  const session = await auth();
  return session?.user ?? null;
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

