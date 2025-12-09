import type React from "react"
import Link from "next/link"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 text-xl font-semibold tracking-tight">
              CalmSync
            </Link>
          </div>
          <nav className="hidden items-center gap-6 md:flex">
            <Link
              href="/dashboard"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Dashboard
            </Link>
            <Link href="/dashboard/history" className="text-sm font-medium transition-colors">
              History
            </Link>
            <Link
              href="/dashboard/sessions"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Sessions
            </Link>
          </nav>
        </div>
      </header>
      <main>{children}</main>
    </div>
  )
}
