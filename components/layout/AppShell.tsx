/**
 * AppShell - Main application layout with navigation and user menu
 * Provides warm gradient background and responsive navigation
 */

import Link from 'next/link';
import { auth, signOut } from '@/auth';
import { Button } from '@/components/ui/button';

/**
 * User avatar menu component
 */
async function UserMenu() {
  const session = await auth();

  if (!session?.user) {
    return (
      <Link href="/api/auth/signin">
        <Button variant="ghost" size="sm">
          Sign In
        </Button>
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-white/90 hidden sm:inline">
        {session.user.email}
      </span>
      <div className="flex items-center gap-2">
        {/* User avatar */}
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-sm font-medium text-white">
          {session.user.email?.charAt(0).toUpperCase()}
        </div>
        {/* Sign out button */}
        <form
          action={async () => {
            'use server';
            await signOut({ redirectTo: '/' });
          }}
        >
          <Button
            type="submit"
            variant="ghost"
            size="sm"
            className="text-white/90 hover:bg-white/10 hover:text-white"
          >
            Sign Out
          </Button>
        </form>
      </div>
    </div>
  );
}

/**
 * Navigation links
 */
function Navigation() {
  return (
    <nav className="flex items-center gap-1 sm:gap-2">
      <Link href="/dashboard">
        <Button
          variant="ghost"
          size="sm"
          className="text-white/90 hover:bg-white/10 hover:text-white"
        >
          Dashboard
        </Button>
      </Link>
      <Link href="/dashboard/history">
        <Button
          variant="ghost"
          size="sm"
          className="text-white/90 hover:bg-white/10 hover:text-white"
        >
          History
        </Button>
      </Link>
    </nav>
  );
}

/**
 * AppShell - Main layout wrapper with gradient background
 */
export async function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-orange-200">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-white/10 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:h-16 sm:px-6 lg:px-8">
          {/* Logo / Brand */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 text-lg font-bold text-white">
              C
            </div>
            <span className="text-lg font-semibold text-white sm:text-xl">
              CalmSync
            </span>
          </Link>

          {/* Navigation & User Menu */}
          <div className="flex items-center gap-2 sm:gap-4">
            <Navigation />
            <UserMenu />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {children}
      </main>

      {/* Footer with safety notice */}
      <footer className="mt-auto border-t border-white/10 bg-white/5 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 text-center sm:px-6 lg:px-8">
          <p className="text-xs text-white/70 sm:text-sm">
            <strong className="font-medium">Safety Notice:</strong> CalmSync is
            a wellness tool and not a substitute for professional mental health
            care. If you&apos;re experiencing a mental health crisis, please
            contact a healthcare provider or emergency services.
          </p>
        </div>
      </footer>
    </div>
  );
}

