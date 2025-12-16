import { handlers } from "../../../../auth";
import type { NextRequest } from "next/server";

// Handle Next.js 16 async params for NextAuth v5
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ nextauth: string[] }> }
) {
  const resolvedParams = await context.params;
  return handlers.GET(request, { params: resolvedParams });
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ nextauth: string[] }> }
) {
  const resolvedParams = await context.params;
  return handlers.POST(request, { params: resolvedParams });
}

