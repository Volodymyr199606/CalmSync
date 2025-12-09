import { auth } from "@/auth"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const moodCheckIns = await prisma.moodCheckIn.findMany({
      where: {
        userId: user.id,
      },
      include: {
        relaxationSession: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 50,
    })

    return NextResponse.json({ moodCheckIns })
  } catch (error) {
    console.error("[v0] Error fetching mood check-ins:", error)
    return NextResponse.json({ error: "Failed to fetch mood check-ins" }, { status: 500 })
  }
}
