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
        className="fixed inset-0 bg-black/40 z-40 md:hidden"
        onClick={closeMenu}
        aria-hidden="true"
      />

      {/* Floating Menu Panel */}
      <div 
        className="fixed top-4 z-50 w-64 max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)] overflow-y-auto bg-white rounded-xl shadow-lg p-4 md:hidden" 
        style={{ 
          left: 'auto', 
          right: '1rem',
          top: '1rem'
        }}
      >
          {/* Close Button */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
            <button
              onClick={closeMenu}
              className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors"
              aria-label="Close menu"
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
                className="text-gray-600"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>

          {/* Menu Items */}
          <nav className="flex flex-col space-y-1">
            {/* Home */}
            <Link
              href="/dashboard"
              onClick={closeMenu}
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium text-gray-700 transition-colors hover:bg-gray-100"
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
              >
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              <span>Home</span>
            </Link>

            {/* History */}
            <Link
              href="/dashboard/history"
              onClick={closeMenu}
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium text-gray-700 transition-colors hover:bg-gray-100"
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
              >
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                <line x1="16" x2="16" y1="2" y2="6" />
                <line x1="8" x2="8" y1="2" y2="6" />
                <line x1="3" x2="21" y1="10" y2="10" />
              </svg>
              <span>History</span>
            </Link>

            {/* Account Section */}
            {userEmail && (
              <>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-3 px-4 py-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-sm font-medium text-purple-700">
                      {userInitial}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">Account</p>
                      <p className="text-xs text-gray-500 truncate">{userEmail}</p>
                    </div>
                  </div>
                </div>

                {/* Sign Out */}
                <form action={signOutAction} onSubmit={closeMenu}>
                  <button
                    type="submit"
                    className="w-full flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium text-gray-700 transition-colors hover:bg-gray-100 text-left"
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
              <div className="mt-4 pt-4 border-t border-gray-200">
                <Link
                  href="/api/auth/signin"
                  onClick={closeMenu}
                  className="flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium text-gray-700 transition-colors hover:bg-gray-100"
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
                  >
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                    <polyline points="10 17 15 12 10 7" />
                    <line x1="15" x2="3" y1="12" y2="12" />
                  </svg>
                  <span>Sign In</span>
                </Link>
              </div>
            )}
          </nav>
        </div>
    </>
  ) : null;

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsMenuOpen(true)}
        className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors md:hidden"
        aria-label="Open menu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5 text-gray-700"
        >
          <line x1="4" x2="20" y1="6" y2="6" />
          <line x1="4" x2="20" y1="12" y2="12" />
          <line x1="4" x2="20" y1="18" y2="18" />
        </svg>
      </button>

      {/* Render menu in portal to avoid parent overflow constraints */}
      {mounted && menuContent && createPortal(menuContent, document.body)}
    </>
  );
}
