'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export function LandingNav() {
  const { data: session, status } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop nav items */}
      <div className="hidden sm:flex items-center gap-4">
        {status === 'loading' ? (
          <div className="w-20 h-9" />
        ) : session ? (
          <Link
            href="/dashboard"
            className="text-sm bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-5 py-2 rounded-xl font-medium shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-200"
          >
            Dashboard
          </Link>
        ) : (
          <>
            <Link
              href="/login"
              className="text-sm text-gray-400 hover:text-gray-200 transition-colors"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="text-sm bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-5 py-2 rounded-xl font-medium shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-200"
            >
              Start Free
            </Link>
          </>
        )}
      </div>

      {/* Mobile hamburger */}
      <button
        className="sm:hidden p-2 text-gray-400 hover:text-white transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle menu"
      >
        {mobileOpen ? (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="absolute top-full left-0 right-0 bg-[#0d0d14] border-b border-white/[0.06] sm:hidden z-50 shadow-2xl shadow-black/50">
          <div className="max-w-6xl mx-auto px-6 py-4 space-y-1">
            <Link
              href="/pricing"
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/[0.06] rounded-xl transition-colors min-h-[44px] flex items-center"
            >
              Pricing
            </Link>
            <Link
              href="/blog"
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/[0.06] rounded-xl transition-colors min-h-[44px] flex items-center"
            >
              Blog
            </Link>
            <Link
              href="/compare"
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/[0.06] rounded-xl transition-colors min-h-[44px] flex items-center"
            >
              Compare
            </Link>
            <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">Free Tools</div>
            <Link
              href="/tools/sample-tool"
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/[0.06] rounded-xl transition-colors min-h-[44px] flex items-center"
            >
              Growth Calculator
            </Link>

            <div className="pt-3 border-t border-white/[0.06] mt-3 space-y-2">
              {status !== 'loading' && session ? (
                <Link
                  href="/dashboard"
                  className="block w-full text-center px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-medium text-sm shadow-lg shadow-emerald-500/25 min-h-[44px]"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block w-full text-center px-4 py-3 bg-white/[0.06] text-gray-200 rounded-xl font-medium text-sm min-h-[44px]"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="block w-full text-center px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-medium text-sm shadow-lg shadow-emerald-500/25 min-h-[44px]"
                  >
                    Start Free
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
