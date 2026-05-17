import Link from "next/link";
import { notFound } from "next/navigation";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { getPostBySlug, getAllSlugs, getAllPosts } from "@/lib/blog";
import { ReadingProgress } from "@/components/blog/reading-progress";
import { ShareButtons } from "@/components/blog/share-buttons";
import { TableOfContents } from "@/components/blog/table-of-contents";
import { seo, articleJsonLd, SITE_URL } from "@/lib/seo";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return { title: "Post Not Found" };
  }

  return {
    ...seo({
      title: post.title,
      description: post.excerpt,
      path: `/blog/${slug}`,
      ogImage: `${SITE_URL}/api/og?title=${encodeURIComponent(post.title)}&type=blog`,
      type: "article",
      publishedTime: post.date,
      tags: post.tags,
    }),
    authors: [{ name: post.author }],
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const allPosts = getAllPosts();
  const relatedPosts = allPosts
    .filter((p) => p.slug !== slug)
    .slice(0, 2);

  const postUrl = `${SITE_URL}/blog/${slug}`;

  const jsonLd = articleJsonLd(
    post.title,
    post.excerpt,
    post.date,
    post.author,
    postUrl
  );

  return (
    <div className="min-h-screen bg-[var(--surface-0)] text-[var(--ink-3)] relative overflow-hidden">
      <div className="bg-mesh" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ReadingProgress />

      <MarketingNav />

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-8 pb-4">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--ink-1)] hover:text-[var(--ink-3)] transition-colors mb-8 focus-ring rounded-md"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to blog
        </Link>

        <div className="rounded-[24px] border border-[var(--line-1)] bg-[var(--surface-1)] p-8 md:p-10 mb-10 shadow-[var(--shadow-1)]">
          {post.coverEmoji && (
            <div className="w-16 h-16 rounded-[18px] bg-[var(--surface-2)] border border-[var(--line-1)] flex items-center justify-center text-3xl mb-6">
              {post.coverEmoji}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2 mb-4 text-sm text-[var(--ink-1)]">
            <time>{post.date}</time>
            <span>·</span>
            <span>{post.readingTime} min read</span>
            <span>·</span>
            <span>By {post.author}</span>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-[-0.02em] mb-5 leading-tight text-[var(--ink-3)]">
            {post.title}
          </h1>
          <p className="text-[var(--ink-1)] text-lg leading-relaxed mb-6">{post.excerpt}</p>

          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-3 py-1 rounded-full bg-[var(--surface-2)] border border-[var(--line-1)] text-[var(--ink-1)]"
              >
                {tag}
              </span>
            ))}
          </div>

          <ShareButtons title={post.title} url={postUrl} />
        </div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 pb-12">
        <div className="flex gap-12">
          <article className="max-w-3xl flex-1 min-w-0">
            <div
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            <div className="mt-16 rounded-[20px] border border-[var(--line-1)] bg-[var(--surface-1)] p-8 text-center shadow-[var(--shadow-1)]">
              <h3 className="text-xl font-semibold text-[var(--ink-3)] mb-2 tracking-[-0.01em]">
                Ready to get started?
              </h3>
              <p className="text-sm text-[var(--ink-1)] mb-6">
                Free to start, no credit card required.
              </p>
              <Link
                href="/register"
                className="inline-flex items-center justify-center h-11 px-6 rounded-[12px] bg-[var(--ink-3)] text-[var(--surface-0)] text-sm font-medium hover:opacity-90 transition-opacity focus-ring"
              >
                Get started for free
              </Link>
            </div>

            {relatedPosts.length > 0 && (
              <div className="mt-16">
                <h3 className="text-lg font-semibold text-[var(--ink-3)] mb-6 tracking-[-0.005em]">
                  Related posts
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  {relatedPosts.map((related) => (
                    <Link
                      key={related.slug}
                      href={`/blog/${related.slug}`}
                      className="group block focus-ring rounded-[16px]"
                    >
                      <div className="rounded-[16px] border border-[var(--line-1)] bg-[var(--surface-1)] p-5 transition-colors group-hover:border-[var(--line-2)] group-hover:bg-[var(--surface-2)] h-full">
                        {related.coverEmoji && (
                          <div className="w-9 h-9 rounded-[10px] bg-[var(--surface-2)] border border-[var(--line-1)] flex items-center justify-center text-base mb-3">
                            {related.coverEmoji}
                          </div>
                        )}
                        <h4 className="text-sm font-semibold text-[var(--ink-3)] mb-2">
                          {related.title}
                        </h4>
                        <p className="text-xs text-[var(--ink-1)] line-clamp-2 leading-relaxed">
                          {related.excerpt}
                        </p>
                        <div className="mt-3 inline-flex items-center gap-1 text-xs text-[var(--ink-3)] font-medium group-hover:gap-1.5 transition-all">
                          Read more
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
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
