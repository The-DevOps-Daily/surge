'use client';
import Link from 'next/link';
import { LandingNav } from '@/components/landing-nav';

export function MarketingNav() {
  return (
    <nav className="sticky top-0 z-50 bg-[#0a0a0f]/95 backdrop-blur-md border-b border-white/[0.04]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <span className="text-lg font-bold text-gray-100">SaaS App</span>
        </Link>

        {/* Desktop links */}
        <div className="flex items-center gap-4">
          <Link href="/pricing" className="hidden sm:block text-sm text-gray-400 hover:text-gray-200 transition-colors">Pricing</Link>
          <Link href="/blog" className="hidden sm:block text-sm text-gray-400 hover:text-gray-200 transition-colors">Blog</Link>
          <Link href="/compare" className="hidden sm:block text-sm text-gray-400 hover:text-gray-200 transition-colors">Compare</Link>
          <div className="hidden sm:block relative group">
            <button className="text-sm text-gray-400 hover:text-gray-200 transition-colors">Tools</button>
            <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="bg-[#1a1a2e] border border-white/[0.08] rounded-xl shadow-xl p-2 min-w-[200px]">
                <Link href="/tools/sample-tool" className="block px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/[0.06] rounded-lg transition-colors">Growth Calculator</Link>
              </div>
            </div>
          </div>
          <LandingNav />
        </div>
      </div>
    </nav>
  );
}
