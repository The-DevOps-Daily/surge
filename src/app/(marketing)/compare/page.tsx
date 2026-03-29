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

// TODO: Replace with your actual competitors
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

// TODO: Replace with your actual feature comparison
const features: FeatureRow[] = [
  { feature: "Price", values: ["Free forever", "$14.99/mo", "$9.99/mo", "$19.99/mo"] },
  { feature: "Core Feature", values: [true, true, true, true] },
  { feature: "Advanced Feature", values: [true, false, true, false] },
  { feature: "Privacy First", values: [true, false, false, false] },
  { feature: "Self-Hostable", values: [true, false, false, false] },
  { feature: "Open Source", values: [true, false, false, false] },
  { feature: "Export Data", values: [true, true, false, true] },
  { feature: "Mobile Friendly", values: [true, true, true, true] },
  { feature: "No Ads", values: [true, false, true, true] },
];

function CheckIcon() {
  return (
    <svg className="w-5 h-5 text-emerald-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg className="w-5 h-5 text-gray-600 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

export default function ComparePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-100">
      <MarketingNav />

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-12 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
          <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
            SaaS App
          </span>{" "}
          vs The Rest
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          {/* TODO: Replace with your competitive positioning */}
          See how we compare to the alternatives. We built this because existing tools were not good enough.
        </p>
      </section>

      {/* Comparison Table */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="overflow-x-auto rounded-2xl border border-white/[0.06]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-left p-4 text-gray-500 font-medium min-w-[180px]">Feature</th>
                {competitors.map((c) => (
                  <th
                    key={c.name}
                    className={`p-4 text-center font-medium min-w-[120px] whitespace-pre-line ${
                      c.highlight
                        ? "text-emerald-400 bg-emerald-500/[0.05]"
                        : "text-gray-300"
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
                  className={`border-b border-white/[0.04] ${
                    i % 2 === 0 ? "bg-white/[0.02]" : ""
                  }`}
                >
                  <td className="p-4 text-gray-300 font-medium">{row.feature}</td>
                  {row.values.map((val, j) => (
                    <td
                      key={j}
                      className={`p-4 text-center ${
                        j === 0 ? "bg-emerald-500/[0.05]" : ""
                      }`}
                    >
                      {typeof val === "boolean" ? (
                        val ? <CheckIcon /> : <XIcon />
                      ) : (
                        <span className={j === 0 ? "text-emerald-400 font-medium" : "text-gray-400"}>
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

        {/* Key Differentiators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          {[
            {
              icon: "🔒",
              title: "Privacy by Default",
              description: "Your data never leaves your server. No third-party analytics, no data selling.",
            },
            {
              icon: "🏠",
              title: "Self-Hostable",
              description: "Run it on your own hardware. You own the data, the database, everything.",
            },
            {
              icon: "💚",
              title: "Free Forever Core",
              description: "The core experience is free with no time limits. Pro features exist for power users, but the basics stay free.",
            },
          ].map((d) => (
            <div
              key={d.title}
              className="bg-white/[0.04] backdrop-blur-xl rounded-2xl border border-white/[0.06] p-6"
            >
              <div className="text-3xl mb-3">{d.icon}</div>
              <h3 className="text-lg font-semibold text-gray-100 mb-2">{d.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{d.description}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <h2 className="text-2xl font-bold text-gray-100 mb-4">
            Ready to get started?
          </h2>
          <Link
            href="/register"
            className="inline-flex items-center justify-center px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold text-base shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:from-emerald-400 hover:to-teal-400 transition-all duration-200"
          >
            Start Free Today
          </Link>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
