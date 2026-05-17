"use client";

import { useState } from "react";
import Link from "next/link";
import { PLANS } from "@/lib/pricing";

const tiers = Object.values(PLANS);

export function PricingTiers() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <>
      <div className="flex justify-center mb-12">
        <div
          role="tablist"
          aria-label="Billing period"
          className="inline-flex items-center rounded-full border border-[var(--line-1)] bg-[var(--surface-1)] p-1 shadow-[var(--shadow-1)]"
        >
          <button
            role="tab"
            aria-selected={!isYearly}
            onClick={() => setIsYearly(false)}
            className={`px-5 h-9 rounded-full text-sm font-medium transition-colors focus-ring ${
              !isYearly
                ? "bg-[var(--ink-3)] text-[var(--surface-0)]"
                : "text-[var(--ink-1)] hover:text-[var(--ink-3)]"
            }`}
          >
            Monthly
          </button>
          <button
            role="tab"
            aria-selected={isYearly}
            onClick={() => setIsYearly(true)}
            className={`px-5 h-9 rounded-full text-sm font-medium transition-colors focus-ring inline-flex items-center gap-2 ${
              isYearly
                ? "bg-[var(--ink-3)] text-[var(--surface-0)]"
                : "text-[var(--ink-1)] hover:text-[var(--ink-3)]"
            }`}
          >
            Yearly
            <span
              className={`text-[10px] uppercase tracking-[0.06em] px-1.5 py-0.5 rounded-full font-semibold ${
                isYearly
                  ? "bg-[var(--surface-0)] text-[var(--accent)]"
                  : "bg-[var(--accent-soft)] text-[var(--accent)]"
              }`}
            >
              Save 2 mo
            </span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {tiers.map((tier) => {
          const showYearly = isYearly && tier.yearlyPriceNum > 0;
          const displayPrice = showYearly
            ? `$${Math.round(tier.yearlyPriceNum / 12)}`
            : tier.monthlyPrice;
          const displayPeriod = tier.period === "forever" ? "forever" : "/month";

          return (
            <div
              key={tier.name}
              className={`relative rounded-[20px] border p-7 flex flex-col transition-colors ${
                tier.highlighted
                  ? "border-[var(--ink-3)] bg-[var(--surface-1)] shadow-[var(--shadow-2)]"
                  : "border-[var(--line-1)] bg-[var(--surface-1)] hover:border-[var(--line-2)]"
              }`}
            >
              {tier.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[11px] uppercase tracking-[0.06em] font-semibold bg-[var(--ink-3)] text-[var(--surface-0)]">
                  Most popular
                </div>
              )}
              <div className="mb-6">
                <h3 className="text-base font-semibold text-[var(--ink-3)] mb-1">
                  {tier.name}
                </h3>
                <p className="text-sm text-[var(--ink-1)] mb-5">
                  {tier.description}
                </p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-[40px] leading-none font-semibold tracking-[-0.02em] text-[var(--ink-3)]">
                    {displayPrice}
                  </span>
                  <span className="text-sm text-[var(--ink-1)]">
                    {displayPeriod}
                  </span>
                </div>
                {showYearly && (
                  <p className="text-xs text-[var(--ink-1)] mt-2">
                    {tier.yearlyPrice} billed annually
                    {tier.yearlySavings && (
                      <span className="ml-2 text-[var(--accent)] font-medium">
                        · {tier.yearlySavings}
                      </span>
                    )}
                  </p>
                )}
              </div>

              <ul className="space-y-2.5 mb-6 flex-1">
                {tier.features.map((f) => (
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
                {tier.notIncluded.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2.5 text-sm text-[var(--ink-1)] opacity-60"
                  >
                    <svg
                      className="w-4 h-4 flex-shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href={tier.href}
                className={`inline-flex items-center justify-center h-11 rounded-[12px] text-sm font-medium transition-colors focus-ring ${
                  tier.highlighted
                    ? "bg-[var(--ink-3)] text-[var(--surface-0)] hover:opacity-90"
                    : "bg-[var(--surface-2)] text-[var(--ink-3)] border border-[var(--line-2)] hover:bg-[var(--surface-3)]"
                }`}
              >
                {tier.cta}
              </Link>
            </div>
          );
        })}
      </div>
    </>
  );
}
