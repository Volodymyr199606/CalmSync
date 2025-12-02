/**
 * AppShell - Main application layout with navigation and user menu
 * Provides warm gradient background and responsive navigation
 */

import Link from 'next/link';
import { auth, signOut } from '@/auth';
import { Button } from '@/components/ui/button';
import { MobileMenu } from '@/components/layout/MobileMenu';
import type { SVGProps } from 'react';

/**
 * CalmSync Icon Component
 */
function CalmSyncIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M16 28C16 28 6 20 6 12C6 8.68629 8.68629 6 12 6C13.8 6 15.4 6.8 16 8C16.6 6.8 18.2 6 20 6C23.3137 6 26 8.68629 26 12C26 20 16 28 16 28Z"
        fillRule="evenodd"
        clipRule="evenodd"
      />
      <path
        d="M16 12C16 12 13 10 11 12C11 12 11 14 13 16C13 16 14 17 16 18C16 18 17 17 18 16C20 14 20 12 20 12C18 10 16 12 16 12Z"
        fill="currentColor"
        opacity="0.3"
      />
    </svg>
  );
}

/**
 * Desktop Navigation - Home, History, Account, Sign Out
 */
async function DesktopNav() {
  const session = await auth();

  if (!session?.user) {
    return (
      <Link href="/api/auth/signin">
        <Button variant="ghost" size="sm" className="h-8 px-3 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900">
          Sign In
        </Button>
      </Link>
    );
  }

  return (
    <nav className="hidden md:flex items-center gap-2">
      {/* Home */}
      <Link href="/dashboard">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-3 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
        >
          Home
        </Button>
      </Link>

      {/* History */}
      <Link href="/dashboard/history">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-3 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
        >
          History
        </Button>
      </Link>

      {/* Account */}
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-xs font-medium text-purple-700">
          {session.user.email?.charAt(0).toUpperCase()}
        </div>
        <span className="text-xs text-gray-700 hidden lg:inline max-w-[200px] truncate">
          {session.user.email}
        </span>
      </div>

      {/* Sign Out */}
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
          className="h-8 px-3 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
        >
          Sign Out
        </Button>
      </form>
    </nav>
  );
}


/**
 * AppShell - Main layout wrapper with gradient background
 */
export async function AppShell({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const userEmail = session?.user?.email;
  const userInitial = userEmail?.charAt(0).toUpperCase() || '';

  const handleSignOut = async () => {
    'use server';
    await signOut({ redirectTo: '/' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/40 to-purple-50/30">
      {/* Header - Fixed height bar */}
      <header className="sticky top-0 z-30 border-b border-gray-200/50 bg-white/60 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 lg:px-8">
          {/* Logo / Brand - Left */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center">
              <CalmSyncIcon className="h-7 w-7 text-purple-600 drop-shadow-sm" />
            </div>
            <span className="text-lg font-semibold text-gray-900 md:text-xl">
              CalmSync
            </span>
          </Link>

          {/* Desktop Navigation - Right */}
          <DesktopNav />

          {/* Mobile Hamburger Menu - Right */}
          <div className="md:hidden">
            <MobileMenu
              userEmail={userEmail}
              userInitial={userInitial}
              signOutAction={handleSignOut}
            />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-7xl px-3 py-4 sm:px-4 sm:py-6 lg:px-8">
        {children}
      </main>

      {/* Footer with safety notice */}
      <footer className="mt-auto border-t border-gray-200/50 bg-white/40 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-3 py-3 text-center sm:px-4 sm:py-4 lg:px-8">
          <p className="text-[10px] leading-snug text-gray-600 sm:text-xs md:text-sm">
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

