import type { Metadata } from "next";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { PricingTiers } from "@/components/marketing/pricing-tiers";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Simple, transparent pricing. Start free, upgrade when you are ready. Cancel anytime.",
};

const faqs = [
  {
    q: "Is there a free plan?",
    a: "Yes. Our Free plan includes core features, a basic dashboard, and community support. It is free forever with no credit card required.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Absolutely. You can cancel your subscription at any time from your account settings. There are no cancellation fees or long-term commitments.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit and debit cards through Stripe, including Visa, Mastercard, and American Express.",
  },
  {
    q: "Is my data secure?",
    a: "Yes. Your data is stored securely and is never shared or sold. We use encryption in transit and at rest.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[var(--surface-0)] text-[var(--ink-3)] relative overflow-hidden">
      <div className="bg-mesh" />
      <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>

      <MarketingNav />

      <section className="relative z-10 max-w-6xl mx-auto px-6 pt-20 pb-6 text-center">
        <span className="inline-flex items-center h-7 px-3 rounded-full border border-[var(--line-1)] bg-[var(--surface-1)] text-[11px] uppercase tracking-[0.06em] text-[var(--ink-1)]">
          Pricing
        </span>
        <h1 className="mt-5 text-4xl md:text-5xl font-semibold tracking-[-0.02em] text-[var(--ink-3)]">
          Simple, transparent pricing
        </h1>
        <p className="mt-4 text-lg text-[var(--ink-1)] max-w-xl mx-auto">
          Start free, upgrade when you are ready. Cancel anytime.
        </p>
      </section>

      <section className="relative z-10 max-w-5xl mx-auto px-6 pt-8 pb-24">
        <PricingTiers />

        <p className="mt-12 text-center text-sm text-[var(--ink-1)]">
          All plans include privacy by default. Your data is never shared or
          sold.
        </p>
      </section>

      <section className="relative z-10 max-w-3xl mx-auto px-6 pb-24">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-semibold tracking-[-0.01em] text-[var(--ink-3)]">
            Frequently asked questions
          </h2>
          <p className="mt-2 text-sm text-[var(--ink-1)]">
            Can&apos;t find what you&apos;re looking for? Email{" "}
            <a
              href="mailto:support@your-app.com"
              className="text-[var(--ink-3)] hover:text-[var(--accent)] underline-offset-4 hover:underline transition-colors"
            >
              support@your-app.com
            </a>
            .
          </p>
        </div>

        <div className="space-y-2">
          {faqs.map((f) => (
            <details
              key={f.q}
              className="group rounded-[14px] border border-[var(--line-1)] bg-[var(--surface-1)] open:bg-[var(--surface-2)] transition-colors"
            >
              <summary className="cursor-pointer list-none px-5 py-4 flex items-center justify-between gap-4 text-sm font-medium text-[var(--ink-3)] focus-ring rounded-[14px]">
                {f.q}
                <svg
                  className="w-4 h-4 text-[var(--ink-1)] transition-transform group-open:rotate-180"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.6}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m6 9 6 6 6-6"
                  />
                </svg>
              </summary>
              <div className="px-5 pb-5 -mt-1 text-sm text-[var(--ink-1)] leading-relaxed">
                {f.a}
              </div>
            </details>
          ))}
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
