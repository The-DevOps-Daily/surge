"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--surface-0)] relative overflow-hidden">
      <div className="bg-mesh" />
      <div className="relative z-10 text-center max-w-md w-full">
        <div className="w-14 h-14 mx-auto mb-6 rounded-[16px] bg-[var(--surface-1)] border border-[var(--line-1)] flex items-center justify-center shadow-[var(--shadow-1)]">
          <svg
            className="w-6 h-6 text-[var(--warn)]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.6}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v4m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 18c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-semibold tracking-[-0.02em] text-[var(--ink-3)] mb-3">
          Something went wrong
        </h1>
        <p className="text-[var(--ink-1)] mb-8">
          An unexpected error occurred. Please try again or return to the
          dashboard.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button onClick={reset} variant="primary" size="lg">
            Try again
          </Button>
          <Link
            href="/"
            className="inline-flex items-center justify-center h-11 px-6 rounded-[12px] bg-[var(--surface-2)] border border-[var(--line-2)] text-[var(--ink-3)] text-sm font-medium hover:bg-[var(--surface-3)] transition-colors focus-ring"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
