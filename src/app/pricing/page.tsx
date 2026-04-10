"use client";

import { useState } from "react";
import Link from "next/link";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { MarketingFooter } from "@/components/marketing/marketing-footer";

import { PLANS } from "@/lib/pricing";

const tiers = Object.values(PLANS);

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is there a free plan?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes! Our Free plan includes core features, a basic dashboard, and community support. It is free forever with no credit card required.",
      },
    },
    {
      "@type": "Question",
      name: "Can I cancel anytime?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Absolutely. You can cancel your subscription at any time from your account settings. There are no cancellation fees or long-term commitments.",
      },
    },
    {
      "@type": "Question",
      name: "What payment methods do you accept?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We accept all major credit and debit cards through Stripe, including Visa, Mastercard, and American Express.",
      },
    },
    {
      "@type": "Question",
      name: "Is my data secure?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Your data is stored securely and is never shared or sold. We use encryption in transit and at rest.",
      },
    },
  ],
};

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-500/[0.04] rounded-full blur-[128px]" />
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-teal-500/[0.03] rounded-full blur-[128px]" />
      </div>

      <MarketingNav />

      {/* Header */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-16 pb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
            Simple, transparent pricing
          </span>
        </h1>
        <p className="text-lg text-gray-400 max-w-xl mx-auto mb-8">
          Start free, upgrade when you are ready. Cancel anytime.
        </p>

        {/* Monthly / Yearly toggle */}
        <div className="inline-flex items-center gap-3 bg-white/[0.04] rounded-full border border-white/[0.06] p-1">
          <button
            onClick={() => setIsYearly(false)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              !isYearly
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : "text-gray-400 border border-transparent hover:text-gray-300"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setIsYearly(true)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
              isYearly
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : "text-gray-400 border border-transparent hover:text-gray-300"
            }`}
          >
            Yearly
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold">
              Save 2 months
            </span>
          </button>
        </div>
      </div>

      {/* Pricing cards */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tiers.map((tier) => {
            const displayPrice = isYearly && tier.yearlyPriceNum > 0
              ? `$${Math.round(tier.yearlyPriceNum / 12)}`
              : tier.monthlyPrice;
            const displayPeriod = tier.period === "forever"
              ? "forever"
              : isYearly
                ? "/month"
                : "/month";

            return (
              <div
                key={tier.name}
                className={`relative rounded-2xl border p-6 flex flex-col transition-all duration-300 ${
                  tier.highlighted
                    ? "bg-white/[0.06] border-emerald-500/30 shadow-lg shadow-emerald-500/10"
                    : "bg-white/[0.04] border-white/[0.06] hover:bg-white/[0.07]"
                }`}
              >
                {tier.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full text-xs font-semibold text-white">
                    Most Popular
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-100 mb-1">{tier.name}</h3>
                  <p className="text-sm text-gray-500 mb-4">{tier.description}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-gray-100">{displayPrice}</span>
                    <span className="text-sm text-gray-500">{displayPeriod}</span>
                  </div>
                  {isYearly && tier.yearlySavings && (
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-xs text-emerald-400 font-medium">
                        {tier.yearlyPrice} billed annually
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-semibold">
                        {tier.yearlySavings}
                      </span>
                    </div>
                  )}
                </div>

                <ul className="space-y-3 mb-4 flex-1">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-300">
                      <svg className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                  {tier.notIncluded.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                      <svg className="w-5 h-5 text-gray-700 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href={tier.href}
                  className={`inline-flex items-center justify-center px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200 mt-4 ${
                    tier.highlighted
                      ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40"
                      : "bg-white/[0.06] text-gray-300 border border-white/[0.08] hover:bg-white/[0.1]"
                  }`}
                >
                  {tier.cta}
                </Link>
              </div>
            );
          })}
        </div>

        {/* FAQ-like note */}
        <div className="mt-16 text-center">
          <p className="text-sm text-gray-500">
            All plans include privacy by default. Your data is never shared or sold.
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Questions? Reach out at support@your-app.com
          </p>
        </div>
      </div>

      <MarketingFooter />
    </div>
  );
}
