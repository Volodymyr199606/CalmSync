import { handlers } from "../../../../auth";
import type { NextRequest } from "next/server";

// Wrap handlers to properly handle Next.js 16 async params
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ nextauth: string[] }> }
) {
  // Resolve params before passing to NextAuth to avoid serialization issues
  const resolvedParams = await context.params;
  return handlers.GET(request, { params: resolvedParams });
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ nextauth: string[] }> }
) {
  // Resolve params before passing to NextAuth to avoid serialization issues
  const resolvedParams = await context.params;
  return handlers.POST(request, { params: resolvedParams });
}

