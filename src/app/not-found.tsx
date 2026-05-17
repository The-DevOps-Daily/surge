import Link from "next/link";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { MarketingFooter } from "@/components/marketing/marketing-footer";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--surface-0)] text-[var(--ink-3)] relative overflow-hidden flex flex-col">
      <div className="bg-mesh" />

      <MarketingNav />

      <main className="relative z-10 flex-1 flex items-center justify-center p-4">
        <div className="text-center max-w-md w-full">
          <p className="text-[88px] leading-none font-semibold tracking-[-0.04em] text-[var(--ink-3)] mb-3">
            404
          </p>
          <h1 className="text-xl font-semibold text-[var(--ink-3)] mb-3 tracking-[-0.005em]">
            Page not found
          </h1>
          <p className="text-[var(--ink-1)] mb-8 leading-relaxed">
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center h-11 px-6 rounded-[12px] bg-[var(--ink-3)] text-[var(--surface-0)] text-sm font-medium hover:opacity-90 transition-opacity focus-ring"
          >
            Go back home
          </Link>
          <div className="mt-10 flex items-center justify-center gap-6 text-sm">
            <Link
              href="/pricing"
              className="text-[var(--ink-1)] hover:text-[var(--ink-3)] transition-colors focus-ring rounded-md"
            >
              Pricing
            </Link>
            <Link
              href="/blog"
              className="text-[var(--ink-1)] hover:text-[var(--ink-3)] transition-colors focus-ring rounded-md"
            >
              Blog
            </Link>
            <Link
              href="/docs"
              className="text-[var(--ink-1)] hover:text-[var(--ink-3)] transition-colors focus-ring rounded-md"
            >
              Docs
            </Link>
          </div>
        </div>
      </main>

      <MarketingFooter />
    </div>
  );
}
