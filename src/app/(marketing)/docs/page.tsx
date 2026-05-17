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

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <span className="inline-flex items-center h-7 px-3 rounded-full border border-[var(--line-1)] bg-[var(--surface-1)] text-[11px] uppercase tracking-[0.06em] text-[var(--ink-1)]">
          Docs
        </span>
        <h1 className="mt-4 text-3xl md:text-4xl font-semibold tracking-[-0.02em] text-[var(--ink-3)]">
          Documentation
        </h1>
        <p className="mt-3 text-[var(--ink-1)] text-lg max-w-2xl leading-relaxed">
          Everything you need to ship with the starter kit. Pick a page from
          the sidebar or jump in below.
        </p>
      </div>

      {docs.length === 0 ? (
        <div className="rounded-[18px] border border-[var(--line-1)] bg-[var(--surface-1)] p-10 text-center">
          <p className="text-sm text-[var(--ink-1)]">
            No docs yet. Add markdown files to{" "}
            <code className="text-[var(--accent)] bg-[var(--accent-soft)] px-1.5 py-0.5 rounded text-xs font-mono">
              content/docs/
            </code>
            .
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {docs.map((doc) => (
            <Link
              key={doc.slug}
              href={`/docs/${doc.slug}`}
              className="group block focus-ring rounded-[14px]"
            >
              <article className="h-full rounded-[14px] border border-[var(--line-1)] bg-[var(--surface-1)] p-5 transition-colors group-hover:border-[var(--line-2)] group-hover:bg-[var(--surface-2)]">
                <h2 className="text-base font-semibold text-[var(--ink-3)] tracking-[-0.005em] mb-1.5">
                  {doc.title}
                </h2>
                {doc.description && (
                  <p className="text-sm text-[var(--ink-1)] leading-relaxed">
                    {doc.description}
                  </p>
                )}
                <div className="mt-4 inline-flex items-center gap-1 text-xs text-[var(--ink-3)] font-medium group-hover:gap-1.5 transition-all">
                  Read
                  <svg
                    className="w-3 h-3"
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
          ))}
        </div>
      )}

      <p className="text-xs text-[var(--ink-1)]">
        Need the raw markdown? Append{" "}
        <code className="text-[var(--ink-2)] font-mono">.md</code> to any docs
        URL — for example,{" "}
        <code className="text-[var(--ink-2)] font-mono">/docs/quickstart.md</code>
        .
      </p>
    </div>
  );
}
