'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface MobileMenuProps {
  userEmail?: string | null;
  userInitial?: string;
  signOutAction: () => Promise<void>;
}

export function MobileMenu({ userEmail, userInitial, signOutAction }: MobileMenuProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const closeMenu = () => setIsMenuOpen(false);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const menuContent = isMenuOpen ? (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 z-[9998] md:hidden"
        onClick={closeMenu}
        aria-hidden="true"
        style={{
          position: 'fixed',
          zIndex: 9998,
          isolation: 'isolate',
        }}
      />

      {/* Floating Menu Panel */}
      <div 
        className="fixed right-4 top-14 z-[9999] w-64 rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-900/10 p-4 space-y-4 max-h-[calc(100vh-4rem)] overflow-y-auto md:hidden"
        style={{
          position: 'fixed',
          right: '1rem',
          top: '3.5rem',
          zIndex: 9999,
          isolation: 'isolate',
          pointerEvents: 'auto',
          willChange: 'transform',
        }}
      >
        {/* Header with Menu title and Close Button */}
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900">Menu</h2>
          <button
            onClick={closeMenu}
            className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-300 bg-slate-50 text-slate-600 hover:bg-white hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-300"
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          <Link
            href="/dashboard"
            onClick={closeMenu}
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-slate-700 hover:bg-purple-50 hover:text-purple-700 no-underline"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-purple-600 w-5 h-5"
            >
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <span>Home</span>
          </Link>

          <Link
            href="/dashboard/history"
            onClick={closeMenu}
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-slate-700 hover:bg-purple-50 hover:text-purple-700 no-underline"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-purple-600 w-5 h-5"
            >
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
              <line x1="16" x2="16" y1="2" y2="6" />
              <line x1="8" x2="8" y1="2" y2="6" />
              <line x1="3" x2="21" y1="10" y2="10" />
            </svg>
            <span>History</span>
          </Link>
        </nav>

        {/* Divider */}
        <div className="border-t border-slate-200" />

        {/* Account Section */}
        {userEmail && (
          <>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Account
              </div>
              <div className="mt-1 text-sm text-slate-700 break-all">
                {userEmail}
              </div>
            </div>

            {/* Sign Out */}
            <form action={signOutAction} onSubmit={closeMenu}>
              <button
                type="submit"
                className="mt-2 w-full inline-flex items-center justify-center gap-1.5 rounded-lg bg-slate-900 px-3 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" x2="9" y1="12" y2="12" />
                </svg>
                <span>Sign Out</span>
              </button>
            </form>
          </>
        )}

        {/* Sign In (if not logged in) */}
        {!userEmail && (
          <>
            <div className="border-t border-slate-200" />
            <Link
              href="/api/auth/signin"
              onClick={closeMenu}
              className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-slate-700 hover:bg-purple-50 hover:text-purple-700 no-underline"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-purple-600 w-5 h-5"
              >
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" x2="3" y1="12" y2="12" />
              </svg>
              <span>Sign In</span>
            </Link>
          </>
        )}
      </div>
    </>
  ) : null;

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsMenuOpen(true)}
        className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white p-1.5 text-slate-700 shadow-sm hover:bg-slate-50 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-300 md:hidden"
        aria-label="Open menu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
        >
          <line x1="4" x2="20" y1="6" y2="6" />
          <line x1="4" x2="20" y1="12" y2="12" />
          <line x1="4" x2="20" y1="18" y2="18" />
        </svg>
      </button>

      {/* Render menu in portal to avoid parent overflow constraints */}
      {mounted && isMenuOpen && createPortal(menuContent, document.body)}
    </>
  );
}
