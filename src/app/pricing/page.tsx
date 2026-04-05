"use client";

import Link from "next/link";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { MarketingFooter } from "@/components/marketing/marketing-footer";

// TODO: Replace with your actual pricing tiers
const tiers = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for getting started",
    features: [
      "Core features",
      "Basic dashboard",
      "Community support",
    ],
    notIncluded: [
      "Advanced features",
      "CSV & JSON export",
      "Monthly reports",
      "Priority support",
    ],
    cta: "Start Free",
    href: "/register",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$9",
    period: "/month",
    description: "For power users",
    features: [
      "Everything in Free",
      "Unlimited usage",
      "Advanced features",
      "CSV & JSON export",
      "Monthly reports",
      "Priority support",
    ],
    notIncluded: [],
    cta: "Get Pro",
    href: "/billing?plan=pro",
    highlighted: true,
  },
  {
    name: "Team",
    price: "$29",
    period: "/month",
    description: "For teams and organizations",
    features: [
      "Everything in Pro",
      "Multiple seats",
      "Shared dashboards",
      "Admin controls",
      "Dedicated support",
    ],
    notIncluded: [],
    cta: "Get Team",
    href: "/billing?plan=family",
    highlighted: false,
  },
];

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
      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-16 pb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
            Simple, transparent pricing
          </span>
        </h1>
        <p className="text-lg text-gray-400 max-w-xl mx-auto">
          Start free, upgrade when you are ready. Cancel anytime.
        </p>
      </div>

      {/* Pricing cards */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tiers.map((tier) => (
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
                  <span className="text-4xl font-bold text-gray-100">{tier.price}</span>
                  <span className="text-sm text-gray-500">{tier.period}</span>
                </div>
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
          ))}
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
