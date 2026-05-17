import Link from "next/link";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { MarketingFooter } from "@/components/marketing/marketing-footer";

const ART = String.raw`  __ __  ___  __ __
 / // / / _ \/ // /
/_  _/ / // /_  _/
 /_/   \___/  /_/   `;

const suggestions = [
  { href: "/", label: "Home", description: "Back to the landing page" },
  { href: "/docs", label: "Docs", description: "Quickstart, conventions, MCP" },
  { href: "/blog", label: "Blog", description: "Writing on the AI-first kit" },
  { href: "/pricing", label: "Pricing", description: "Plans and FAQ" },
];

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--surface-0)] text-[var(--ink-3)] relative overflow-hidden flex flex-col">
      <div className="bg-mesh" />

      <MarketingNav />

      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-xl">
          <div className="rounded-[20px] border border-[var(--line-1)] bg-[var(--surface-1)] shadow-[var(--shadow-2)] overflow-hidden">
            <div className="flex items-center gap-1.5 px-4 h-9 border-b border-[var(--line-1)] bg-[var(--surface-2)]">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--danger)] opacity-70" />
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--warn)] opacity-70" />
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent)] opacity-70" />
              <span className="ml-3 text-xs text-[var(--ink-1)] font-mono">
                ~/surge › 404
              </span>
            </div>
            <div className="p-7 sm:p-9">
              <pre
                aria-label="404"
                className="text-[var(--accent)] font-mono text-[11px] sm:text-xs leading-[1.15] whitespace-pre mb-6 select-none"
              >
                {ART}
              </pre>

              <h1 className="text-xl font-semibold tracking-[-0.005em] text-[var(--ink-3)]">
                Page not found
              </h1>
              <p className="mt-1.5 text-sm text-[var(--ink-1)] leading-relaxed">
                The URL doesn&apos;t map to anything on this site. It may have
                been moved, or it never existed.
              </p>

              <div className="mt-7">
                <p className="text-[11px] uppercase tracking-[0.06em] font-medium text-[var(--ink-1)] mb-2">
                  Try one of these
                </p>
                <ul className="divide-y divide-[var(--line-1)] rounded-[12px] border border-[var(--line-1)] bg-[var(--surface-2)]/40 overflow-hidden">
                  {suggestions.map((s) => (
                    <li key={s.href}>
                      <Link
                        href={s.href}
                        className="group flex items-center gap-3 px-4 py-2.5 hover:bg-[var(--surface-2)] transition-colors focus-ring"
                      >
                        <span className="font-mono text-xs text-[var(--ink-1)] w-16 group-hover:text-[var(--ink-3)] transition-colors">
                          {s.href}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[var(--ink-3)]">
                            {s.label}
                          </p>
                          <p className="text-xs text-[var(--ink-1)]">
                            {s.description}
                          </p>
                        </div>
                        <svg
                          className="w-3.5 h-3.5 text-[var(--ink-1)] group-hover:text-[var(--ink-3)] group-hover:translate-x-0.5 transition-all flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.6}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      <MarketingFooter />
    </div>
  );
}
