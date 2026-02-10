import { getCurrentUser } from "@/lib/auth"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Try to find user in database (optional - app works without it)
    let user;
    try {
      user = await prisma.user.findUnique({
        where: { email: currentUser.email },
        select: { id: true },
      });
    } catch (dbError) {
      // Database unavailable - return empty array
      const errorMessage = dbError instanceof Error ? dbError.message : String(dbError);
      const isConnectionError = 
        errorMessage.includes("Can't reach database server") ||
        errorMessage.includes("P1001") ||
        errorMessage.includes("connection") ||
        errorMessage.includes("connect") ||
        errorMessage.includes("timeout") ||
        errorMessage.includes("ECONNREFUSED");
      
      if (!isConnectionError) {
        console.warn("[v0] Database error (returning empty mood check-ins):", errorMessage);
      }
      
      return NextResponse.json({ moodCheckIns: [] });
    }

    if (!user) {
      return NextResponse.json({ moodCheckIns: [] })
    }

    const moodCheckIns = await prisma.moodCheckIn.findMany({
      where: {
        userId: user.id,
      },
      include: {
        relaxationSessions: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 50,
    })

    return NextResponse.json({ moodCheckIns })
  } catch (error) {
    // Only log unexpected errors (not connection errors)
    const errorMessage = error instanceof Error ? error.message : String(error);
    const isConnectionError = 
      errorMessage.includes("Can't reach database server") ||
      errorMessage.includes("P1001") ||
      errorMessage.includes("connection") ||
      errorMessage.includes("connect") ||
      errorMessage.includes("timeout") ||
      errorMessage.includes("ECONNREFUSED");
    
    if (!isConnectionError) {
      console.error("[v0] Error fetching mood check-ins:", error);
    }
    
    // Return empty array instead of 500 error
    return NextResponse.json({ moodCheckIns: [] });
  }
}
