"use client";

import Link from "next/link";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#0a0a0f]">
      <div className="text-center max-w-md">
        <p className="text-6xl mb-6">&#x26A0;&#xFE0F;</p>
        <h1 className="text-3xl font-bold text-gray-100 mb-3">Something went wrong</h1>
        <p className="text-gray-400 mb-8">
          An unexpected error occurred. Please try again or return to the dashboard.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-medium text-white bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:from-emerald-400 hover:to-teal-400 transition-all duration-200 min-h-[44px]"
          >
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-medium text-gray-300 bg-white/[0.06] border border-white/[0.08] hover:bg-white/[0.1] transition-all duration-200 min-h-[44px]"
          >
            Go to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
