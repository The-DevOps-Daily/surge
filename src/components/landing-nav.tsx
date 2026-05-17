'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export function LandingNav() {
  const { data: session, status } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop CTA cluster */}
      <div className="hidden sm:flex items-center gap-2">
        {status === 'loading' ? (
          <div className="h-9 w-20" />
        ) : session ? (
          <Link
            href="/dashboard"
            className="inline-flex h-9 items-center rounded-[10px] px-4 text-sm font-medium bg-[var(--ink-3)] text-[var(--surface-0)] hover:bg-[var(--ink-2)] transition-colors focus-ring"
          >
            Dashboard
          </Link>
        ) : (
          <>
            <Link
              href="/login"
              className="inline-flex h-9 items-center rounded-[10px] px-3 text-sm text-[var(--ink-2)] hover:text-[var(--ink-3)] hover:bg-[var(--surface-2)] transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="inline-flex h-9 items-center rounded-[10px] px-4 text-sm font-medium bg-[var(--ink-3)] text-[var(--surface-0)] hover:bg-[var(--ink-2)] transition-colors focus-ring"
            >
              Start free
            </Link>
          </>
        )}
      </div>

      {/* Mobile hamburger */}
      <button
        type="button"
        className="sm:hidden inline-flex h-9 w-9 items-center justify-center rounded-[10px] text-[var(--ink-2)] hover:bg-[var(--surface-2)] hover:text-[var(--ink-3)] transition-colors focus-ring"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle menu"
        aria-expanded={mobileOpen}
      >
        {mobileOpen ? (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M6 18 18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Mobile sheet */}
      {mobileOpen && (
        <div
          className="absolute top-full left-0 right-0 bg-[var(--surface-1)] border-b border-[var(--line-1)] sm:hidden z-50 shadow-[var(--shadow-2)] animate-slide-up"
        >
          <div className="max-w-6xl mx-auto px-4 py-4 space-y-1">
            <Link
              href="/pricing"
              onClick={() => setMobileOpen(false)}
              className="flex items-center h-11 px-4 text-sm font-medium text-[var(--ink-2)] hover:text-[var(--ink-3)] hover:bg-[var(--surface-2)] rounded-[12px] transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/blog"
              onClick={() => setMobileOpen(false)}
              className="flex items-center h-11 px-4 text-sm font-medium text-[var(--ink-2)] hover:text-[var(--ink-3)] hover:bg-[var(--surface-2)] rounded-[12px] transition-colors"
            >
              Blog
            </Link>
            <Link
              href="/compare"
              onClick={() => setMobileOpen(false)}
              className="flex items-center h-11 px-4 text-sm font-medium text-[var(--ink-2)] hover:text-[var(--ink-3)] hover:bg-[var(--surface-2)] rounded-[12px] transition-colors"
            >
              Compare
            </Link>
            <div className="px-4 pt-3 pb-1 text-[11px] font-medium uppercase tracking-[0.06em] text-[var(--ink-1)]">
              Free tools
            </div>
            <Link
              href="/tools/sample-tool"
              onClick={() => setMobileOpen(false)}
              className="flex items-center h-11 px-4 text-sm font-medium text-[var(--ink-2)] hover:text-[var(--ink-3)] hover:bg-[var(--surface-2)] rounded-[12px] transition-colors"
            >
              Growth calculator
            </Link>

            <div className="pt-3 border-t border-[var(--line-1)] mt-3 space-y-2">
              {status !== 'loading' && session ? (
                <Link
                  href="/dashboard"
                  className="flex items-center justify-center h-11 px-4 bg-[var(--ink-3)] text-[var(--surface-0)] rounded-[12px] font-medium text-sm"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="flex items-center justify-center h-11 px-4 bg-[var(--surface-2)] text-[var(--ink-3)] rounded-[12px] font-medium text-sm"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/register"
                    className="flex items-center justify-center h-11 px-4 bg-[var(--ink-3)] text-[var(--surface-0)] rounded-[12px] font-medium text-sm"
                  >
                    Start free
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
