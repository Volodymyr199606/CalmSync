import type React from "react"
import { getCurrentUser } from "@/lib/auth"
import { NavigationHeader } from "@/components/navigation-header"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()
  
  // Calculate user initials
  const userName = user?.name || null
  const userEmail = user?.email || null
  const userInitials = userName
    ? userName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : userEmail
      ? userEmail.slice(0, 2).toUpperCase()
      : "U"

  const displayName = userName || userEmail || "User"

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader
        userName={displayName}
        userInitials={userInitials}
        userEmail={userEmail || undefined}
      />
      <main>{children}</main>
    </div>
  )
}
