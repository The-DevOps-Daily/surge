'use client';
import Link from 'next/link';
import { LandingNav } from '@/components/landing-nav';

export function MarketingNav() {
  return (
    <nav className="sticky top-0 z-50 bg-[var(--surface-0)]/85 backdrop-blur-xl border-b border-[var(--line-1)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Logo: solid mark instead of the previous emerald gradient bubble. */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-[8px] bg-[var(--ink-3)] text-[var(--surface-0)] flex items-center justify-center">
            <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2 2 22h20L12 2z" />
            </svg>
          </div>
          <span className="text-[15px] font-semibold text-[var(--ink-3)] tracking-tight">
            SaaS App
          </span>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/pricing"
            className="hidden sm:inline-flex h-9 items-center rounded-[10px] px-3 text-sm text-[var(--ink-1)] hover:text-[var(--ink-3)] hover:bg-[var(--surface-2)] transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="/blog"
            className="hidden sm:inline-flex h-9 items-center rounded-[10px] px-3 text-sm text-[var(--ink-1)] hover:text-[var(--ink-3)] hover:bg-[var(--surface-2)] transition-colors"
          >
            Blog
          </Link>
          <Link
            href="/docs"
            className="hidden sm:inline-flex h-9 items-center rounded-[10px] px-3 text-sm text-[var(--ink-1)] hover:text-[var(--ink-3)] hover:bg-[var(--surface-2)] transition-colors"
          >
            Docs
          </Link>
          <Link
            href="/compare"
            className="hidden sm:inline-flex h-9 items-center rounded-[10px] px-3 text-sm text-[var(--ink-1)] hover:text-[var(--ink-3)] hover:bg-[var(--surface-2)] transition-colors"
          >
            Compare
          </Link>
          <div className="hidden sm:block relative group">
            <button className="inline-flex h-9 items-center rounded-[10px] px-3 text-sm text-[var(--ink-1)] hover:text-[var(--ink-3)] hover:bg-[var(--surface-2)] transition-colors">
              Tools
            </button>
            <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
              <div className="bg-[var(--surface-2)] border border-[var(--line-2)] rounded-[14px] shadow-[var(--shadow-3)] p-1.5 min-w-[220px]">
                <Link
                  href="/tools/sample-tool"
                  className="flex items-center h-9 px-3 text-sm text-[var(--ink-2)] hover:text-[var(--ink-3)] hover:bg-[var(--surface-3)] rounded-[10px] transition-colors"
                >
                  Growth calculator
                </Link>
              </div>
            </div>
          </div>
          <span className="hidden sm:block mx-1 h-5 w-px bg-[var(--line-1)]" />
          <LandingNav />
        </div>
      </div>
    </nav>
  );
}
