import type { ReactNode } from "react";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { MarketingFooter } from "@/components/marketing/marketing-footer";

interface LegalPageProps {
  title: string;
  updated: string;
  children: ReactNode;
}

export function LegalPage({ title, updated, children }: LegalPageProps) {
  return (
    <div className="min-h-screen bg-[var(--surface-0)] text-[var(--ink-3)] relative overflow-hidden">
      <div className="bg-mesh" />

      <MarketingNav />

      <div className="relative z-10 max-w-3xl mx-auto px-6 pt-16 pb-24">
        <span className="inline-flex items-center h-7 px-3 rounded-full border border-[var(--line-1)] bg-[var(--surface-1)] text-[11px] uppercase tracking-[0.06em] text-[var(--ink-1)]">
          Legal
        </span>
        <h1 className="mt-5 text-3xl md:text-4xl font-semibold tracking-[-0.02em] text-[var(--ink-3)]">
          {title}
        </h1>
        <p className="mt-2 text-sm text-[var(--ink-1)] mb-10">
          Last updated: {updated}
        </p>

        <div className="rounded-[20px] border border-[var(--line-1)] bg-[var(--surface-1)] p-7 md:p-9 shadow-[var(--shadow-1)]">
          <div className="space-y-8 text-[var(--ink-1)] leading-relaxed text-[15px]">
            {children}
          </div>
        </div>
      </div>

      <MarketingFooter />
    </div>
  );
}

interface LegalSectionProps {
  title: string;
  children: ReactNode;
}

export function LegalSection({ title, children }: LegalSectionProps) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-[var(--ink-3)] mb-3 tracking-[-0.005em]">
        {title}
      </h2>
      {children}
    </section>
  );
}
