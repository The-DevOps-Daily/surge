import Link from "next/link";
import { notFound } from "next/navigation";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { getDocBySlug, getAllDocSlugs, getAllDocs } from "@/lib/docs";
import { TableOfContents } from "@/components/blog/table-of-contents";
import { DocBody } from "@/components/docs/doc-body";
import { seo, SITE_URL } from "@/lib/seo";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllDocSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const doc = await getDocBySlug(slug);
  if (!doc) return { title: "Doc not found" };
  return seo({
    title: doc.title,
    description: doc.description,
    path: `/docs/${slug}`,
    ogImage: `${SITE_URL}/api/og?title=${encodeURIComponent(doc.title)}&type=docs`,
  });
}

export default async function DocPage({ params }: Props) {
  const { slug } = await params;
  const doc = await getDocBySlug(slug);
  if (!doc) notFound();

  const allDocs = getAllDocs();
  const currentIndex = allDocs.findIndex((d) => d.slug === slug);
  const prev = currentIndex > 0 ? allDocs[currentIndex - 1] : null;
  const next =
    currentIndex >= 0 && currentIndex < allDocs.length - 1
      ? allDocs[currentIndex + 1]
      : null;

  return (
    <div className="min-h-screen bg-[var(--surface-0)] text-[var(--ink-3)] relative overflow-hidden">
      <div className="bg-mesh" />

      <MarketingNav />

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-8 pb-12">
        <Link
          href="/docs"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--ink-1)] hover:text-[var(--ink-3)] transition-colors mb-8 focus-ring rounded-md"
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to docs
        </Link>

        <div className="flex gap-12">
          <article className="max-w-3xl flex-1 min-w-0">
            <header className="mb-10 pb-8 border-b border-[var(--line-1)]">
              <h1 className="text-3xl md:text-4xl font-semibold tracking-[-0.02em] text-[var(--ink-3)]">
                {doc.title}
              </h1>
              {doc.description && (
                <p className="mt-3 text-[var(--ink-1)] text-lg leading-relaxed">
                  {doc.description}
                </p>
              )}
              <p className="mt-4 text-xs text-[var(--ink-1)]">
                Updated {doc.updatedAt} ·{" "}
                <a
                  href={`/docs/${doc.slug}.md`}
                  className="hover:text-[var(--accent)] underline-offset-4 hover:underline"
                >
                  View raw markdown
                </a>
              </p>
            </header>

            <DocBody html={doc.content} />

            {(prev || next) && (
              <nav
                aria-label="Doc navigation"
                className="mt-16 grid grid-cols-2 gap-3"
              >
                {prev ? (
                  <Link
                    href={`/docs/${prev.slug}`}
                    className="block rounded-[14px] border border-[var(--line-1)] bg-[var(--surface-1)] p-4 hover:bg-[var(--surface-2)] transition-colors focus-ring"
                  >
                    <p className="text-[11px] uppercase tracking-[0.06em] text-[var(--ink-1)] font-medium">
                      ← Previous
                    </p>
                    <p className="text-sm font-medium text-[var(--ink-3)] mt-1">
                      {prev.title}
                    </p>
                  </Link>
                ) : (
                  <div />
                )}
                {next ? (
                  <Link
                    href={`/docs/${next.slug}`}
                    className="block rounded-[14px] border border-[var(--line-1)] bg-[var(--surface-1)] p-4 hover:bg-[var(--surface-2)] transition-colors focus-ring text-right"
                  >
                    <p className="text-[11px] uppercase tracking-[0.06em] text-[var(--ink-1)] font-medium">
                      Next →
                    </p>
                    <p className="text-sm font-medium text-[var(--ink-3)] mt-1">
                      {next.title}
                    </p>
                  </Link>
                ) : (
                  <div />
                )}
              </nav>
            )}
          </article>

          <aside className="hidden lg:block w-56 flex-shrink-0">
            <TableOfContents />
          </aside>
        </div>
      </div>

      <MarketingFooter />
    </div>
  );
}
