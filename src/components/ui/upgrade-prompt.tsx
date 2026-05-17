"use client";

import React from "react";
import Link from "next/link";
import { PLANS } from "@/lib/pricing";

interface UpgradePromptProps {
  message?: string;
  features?: string[];
  className?: string;
}

export function UpgradePrompt({
  message = "Upgrade to Pro to unlock this feature",
  features,
  className = "",
}: UpgradePromptProps) {
  return (
    <div
      className={[
        "max-w-lg mx-auto text-center p-8",
        "rounded-[24px] border border-[var(--line-1)] bg-[var(--surface-1)]",
        "shadow-[var(--shadow-2)]",
        className,
      ].join(" ")}
    >
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-[14px] bg-[var(--accent-soft)] mb-5">
        <svg
          className="w-6 h-6 text-[var(--accent)]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.6}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3l2.5 5.5L20 10l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-1.5L12 3z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-[var(--ink-3)] tracking-tight mb-2">
        Pro feature
      </h3>
      <p className="text-sm text-[var(--ink-1)] leading-relaxed mb-6">
        {message}
      </p>

      {features && features.length > 0 && (
        <ul className="text-left space-y-2.5 mb-6 max-w-xs mx-auto">
          {features.map((f) => (
            <li
              key={f}
              className="flex items-start gap-2.5 text-sm text-[var(--ink-2)]"
            >
              <svg
                className="w-4 h-4 text-[var(--accent)] flex-shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              {f}
            </li>
          ))}
        </ul>
      )}

      <Link
        href="/billing?plan=pro"
        className="inline-flex items-center justify-center h-11 px-6 rounded-[12px] bg-[var(--accent)] text-[var(--surface-0)] font-medium text-sm transition-colors hover:bg-[var(--accent-strong)] focus-ring"
      >
        Upgrade to Pro — {PLANS.pro.price}/mo
      </Link>
      <p className="text-xs text-[var(--ink-1)] mt-3">Cancel anytime. No lock-in.</p>
    </div>
  );
}
