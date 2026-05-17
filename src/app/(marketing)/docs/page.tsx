import Link from "next/link";
import { getAllDocs } from "@/lib/docs";
import { seo } from "@/lib/seo";

export const metadata = seo({
  title: "Docs",
  description:
    "Documentation for the SaaS App starter kit — getting started, customization, and adding features.",
  path: "/docs",
});

export default function DocsIndexPage() {
  const docs = getAllDocs();
  const featured = docs.find((d) => d.slug === "quickstart");
  const rest = docs.filter((d) => d.slug !== "quickstart");

  return (
    <div className="space-y-10 animate-fade-in max-w-2xl">
      <header>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-[-0.02em] text-[var(--ink-3)]">
          Documentation
        </h1>
        <p className="mt-3 text-[var(--ink-1)] text-base md:text-lg leading-relaxed">
          Everything you need to ship with the starter kit. Use the sidebar to
          jump around, or start at the top below.
        </p>
      </header>

      {featured && (
        <Link
          href={`/docs/${featured.slug}`}
          className="group block focus-ring rounded-[18px]"
        >
          <article className="rounded-[18px] border border-[var(--line-1)] bg-[var(--surface-1)] p-7 transition-colors group-hover:border-[var(--line-2)] group-hover:bg-[var(--surface-2)] shadow-[var(--shadow-1)]">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[11px] uppercase tracking-[0.06em] font-semibold text-[var(--accent)] bg-[var(--accent-soft)] px-2 py-0.5 rounded-full">
                Start here
              </span>
            </div>
            <h2 className="text-xl font-semibold tracking-[-0.01em] text-[var(--ink-3)] mb-2">
              {featured.title}
            </h2>
            {featured.description && (
              <p className="text-[var(--ink-1)] leading-relaxed">
                {featured.description}
              </p>
            )}
            <div className="mt-5 inline-flex items-center gap-1.5 text-sm text-[var(--ink-3)] font-medium group-hover:gap-2 transition-all">
              Read the quickstart
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </article>
        </Link>
      )}

      {rest.length > 0 && (
        <section>
          <h2 className="text-[11px] uppercase tracking-[0.06em] font-medium text-[var(--ink-1)] mb-3 px-1">
            More guides
          </h2>
          <ul className="divide-y divide-[var(--line-1)] rounded-[16px] border border-[var(--line-1)] bg-[var(--surface-1)] overflow-hidden">
            {rest.map((doc) => (
              <li key={doc.slug}>
                <Link
                  href={`/docs/${doc.slug}`}
                  className="group flex items-start gap-4 px-5 py-4 hover:bg-[var(--surface-2)] transition-colors focus-ring"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-[var(--ink-3)] tracking-[-0.005em]">
                      {doc.title}
                    </h3>
                    {doc.description && (
                      <p className="mt-1 text-sm text-[var(--ink-1)] leading-relaxed">
                        {doc.description}
                      </p>
                    )}
                  </div>
                  <svg
                    className="w-4 h-4 text-[var(--ink-1)] flex-shrink-0 mt-0.5 group-hover:text-[var(--ink-3)] group-hover:translate-x-0.5 transition-all"
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
        </section>
      )}

      <p className="text-xs text-[var(--ink-1)] pt-2">
        Need the raw markdown? Append{" "}
        <code className="text-[var(--ink-2)] font-mono">.md</code> to any docs
        URL — for example,{" "}
        <code className="text-[var(--ink-2)] font-mono">/docs/quickstart.md</code>
        .
      </p>
    </div>
  );
}
