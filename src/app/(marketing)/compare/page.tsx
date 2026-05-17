import type { Metadata } from "next";
import Link from "next/link";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { MarketingFooter } from "@/components/marketing/marketing-footer";

export const metadata: Metadata = {
  title: "SaaS App vs Others - Comparison",
  description:
    "Compare SaaS App with alternatives. See why our approach wins.",
  openGraph: {
    title: "SaaS App vs Others",
    description: "The honest comparison.",
  },
};

const competitors = [
  { name: "SaaS App", highlight: true },
  { name: "Competitor A", highlight: false },
  { name: "Competitor B", highlight: false },
  { name: "Competitor C", highlight: false },
];

interface FeatureRow {
  feature: string;
  values: (boolean | string)[];
}

const features: FeatureRow[] = [
  {
    feature: "Price",
    values: [
      "Free plan available",
      "$14.99/mo",
      "$9.99/mo",
      "$19.99/mo",
    ],
  },
  { feature: "Core feature", values: [true, true, true, true] },
  { feature: "Advanced feature", values: [true, false, true, false] },
  { feature: "Privacy first", values: [true, false, false, false] },
  { feature: "Self-hostable", values: [true, false, false, false] },
  { feature: "Open source", values: [true, false, false, false] },
  { feature: "Export data", values: [true, true, false, true] },
  { feature: "Mobile friendly", values: [true, true, true, true] },
  { feature: "No ads", values: [true, false, true, true] },
];

function CheckIcon() {
  return (
    <svg
      aria-label="Yes"
      className="w-4 h-4 text-[var(--accent)] mx-auto"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      aria-label="No"
      className="w-4 h-4 text-[var(--ink-1)] opacity-50 mx-auto"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

const differentiators = [
  {
    title: "Privacy by default",
    description:
      "Your data never leaves your server. No third-party analytics, no data selling.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3 4 6v6c0 4.5 3.2 8.4 8 9 4.8-.6 8-4.5 8-9V6l-8-3Z"
      />
    ),
  },
  {
    title: "Self-hostable",
    description:
      "Run it on your own hardware. You own the data, the database, everything.",
    icon: (
      <>
        <rect x="3" y="5" width="18" height="6" rx="2" />
        <rect x="3" y="13" width="18" height="6" rx="2" />
        <circle cx="7" cy="8" r="0.8" />
        <circle cx="7" cy="16" r="0.8" />
      </>
    ),
  },
  {
    title: "Free forever core",
    description:
      "The core experience is free with no time limits. Pro features exist for power users, but the basics stay free.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.5-7 10-7 10Z"
      />
    ),
  },
];

export default function ComparePage() {
  return (
    <div className="min-h-screen bg-[var(--surface-0)] text-[var(--ink-3)] relative overflow-hidden">
      <div className="bg-mesh" />

      <MarketingNav />

      <section className="relative z-10 max-w-6xl mx-auto px-6 pt-20 pb-12 text-center">
        <span className="inline-flex items-center h-7 px-3 rounded-full border border-[var(--line-1)] bg-[var(--surface-1)] text-[11px] uppercase tracking-[0.06em] text-[var(--ink-1)]">
          Comparison
        </span>
        <h1 className="mt-5 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-[-0.02em] text-[var(--ink-3)]">
          SaaS App vs the rest
        </h1>
        <p className="mt-4 text-[var(--ink-1)] text-lg max-w-2xl mx-auto">
          How we stack up against the alternatives, without the marketing fluff.
        </p>
      </section>

      <section className="relative z-10 max-w-6xl mx-auto px-6 pb-24">
        <div className="overflow-x-auto rounded-[20px] border border-[var(--line-1)] bg-[var(--surface-1)] shadow-[var(--shadow-1)]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--line-1)]">
                <th className="text-left p-4 text-[var(--ink-1)] text-xs uppercase tracking-[0.06em] font-medium min-w-[180px]">
                  Feature
                </th>
                {competitors.map((c) => (
                  <th
                    key={c.name}
                    className={`p-4 text-center text-sm font-semibold min-w-[120px] whitespace-pre-line ${
                      c.highlight
                        ? "text-[var(--ink-3)] bg-[var(--accent-soft)] border-b-2 border-[var(--accent)]"
                        : "text-[var(--ink-2)]"
                    }`}
                  >
                    {c.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {features.map((row, i) => (
                <tr
                  key={row.feature}
                  className={`border-b border-[var(--line-1)] last:border-0 ${
                    i % 2 === 0 ? "bg-[var(--surface-2)]/40" : ""
                  }`}
                >
                  <td className="p-4 text-[var(--ink-2)] font-medium">
                    {row.feature}
                  </td>
                  {row.values.map((val, j) => (
                    <td
                      key={j}
                      className={`p-4 text-center ${
                        j === 0 ? "bg-[var(--accent-soft)]/60" : ""
                      }`}
                    >
                      {typeof val === "boolean" ? (
                        val ? (
                          <CheckIcon />
                        ) : (
                          <XIcon />
                        )
                      ) : (
                        <span
                          className={
                            j === 0
                              ? "text-[var(--accent)] font-medium"
                              : "text-[var(--ink-1)]"
                          }
                        >
                          {val}
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-16">
          {differentiators.map((d) => (
            <div
              key={d.title}
              className="rounded-[20px] border border-[var(--line-1)] bg-[var(--surface-1)] p-6"
            >
              <div className="w-10 h-10 rounded-[12px] bg-[var(--surface-2)] border border-[var(--line-1)] flex items-center justify-center mb-4">
                <svg
                  className="w-5 h-5 text-[var(--ink-3)]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.6}
                >
                  {d.icon}
                </svg>
              </div>
              <h3 className="text-base font-semibold text-[var(--ink-3)] mb-2 tracking-[-0.005em]">
                {d.title}
              </h3>
              <p className="text-sm text-[var(--ink-1)] leading-relaxed">
                {d.description}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <h2 className="text-2xl font-semibold tracking-[-0.01em] text-[var(--ink-3)] mb-5">
            Ready to get started?
          </h2>
          <Link
            href="/register"
            className="inline-flex items-center justify-center h-12 px-8 rounded-[14px] bg-[var(--ink-3)] text-[var(--surface-0)] font-medium text-base hover:opacity-90 transition-opacity focus-ring"
          >
            Start free today
          </Link>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
