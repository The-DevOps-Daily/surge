import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { seo } from "@/lib/seo";

export const metadata = seo({
  title: "Blog",
  description:
    "Personal finance tips, FIRE movement guides, and wealth-building strategies.",
  path: "/blog",
});

export default function BlogIndexPage() {
  const posts = getAllPosts();
  const featuredPost = posts[0];
  const remainingPosts = posts.slice(1);

  return (
    <div className="min-h-screen bg-[var(--surface-0)] text-[var(--ink-3)] relative overflow-hidden">
      <div className="bg-mesh" />

      <MarketingNav />

      <section className="relative z-10 max-w-4xl mx-auto px-6 pt-20 pb-10 text-center">
        <span className="inline-flex items-center h-7 px-3 rounded-full border border-[var(--line-1)] bg-[var(--surface-1)] text-[11px] uppercase tracking-[0.06em] text-[var(--ink-1)]">
          Writing
        </span>
        <h1 className="mt-5 text-4xl md:text-5xl font-semibold tracking-[-0.02em] text-[var(--ink-3)]">
          The blog
        </h1>
        <p className="mt-4 text-lg text-[var(--ink-1)] max-w-xl mx-auto">
          Practical guides, deep dives, and the occasional opinion piece.
        </p>
      </section>

      <section className="relative z-10 max-w-4xl mx-auto px-6 pb-24">
        {posts.length === 0 ? (
          <div className="text-center py-20 rounded-[20px] border border-[var(--line-1)] bg-[var(--surface-1)]">
            <p className="text-sm text-[var(--ink-1)]">
              No posts yet. Check back soon.
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {featuredPost && (
              <Link
                href={`/blog/${featuredPost.slug}`}
                className="group block focus-ring rounded-[24px]"
              >
                <article className="rounded-[24px] border border-[var(--line-1)] bg-[var(--surface-1)] p-8 md:p-10 transition-colors group-hover:border-[var(--line-2)] group-hover:bg-[var(--surface-2)] shadow-[var(--shadow-1)]">
                  <div className="flex flex-col md:flex-row md:items-start gap-6">
                    {featuredPost.coverEmoji && (
                      <div className="flex-shrink-0 w-16 h-16 rounded-[18px] bg-[var(--surface-2)] border border-[var(--line-1)] flex items-center justify-center text-3xl">
                        {featuredPost.coverEmoji}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-[var(--accent-soft)] text-[var(--accent)] uppercase tracking-[0.06em] font-semibold">
                          Featured
                        </span>
                        <time className="text-xs text-[var(--ink-1)]">
                          {featuredPost.date}
                        </time>
                        <span className="text-xs text-[var(--ink-1)]">·</span>
                        <span className="text-xs text-[var(--ink-1)]">
                          {featuredPost.readingTime} min read
                        </span>
                      </div>
                      <h2 className="text-2xl md:text-3xl font-semibold tracking-[-0.01em] text-[var(--ink-3)] mb-3">
                        {featuredPost.title}
                      </h2>
                      <p className="text-[15px] text-[var(--ink-1)] leading-relaxed mb-5">
                        {featuredPost.excerpt}
                      </p>
                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {featuredPost.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-[11px] px-2 py-0.5 rounded-full bg-[var(--surface-2)] border border-[var(--line-1)] text-[var(--ink-1)]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <span className="inline-flex items-center gap-1 text-sm text-[var(--ink-3)] font-medium group-hover:gap-2 transition-all">
                        Read more
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
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            )}

            {remainingPosts.length > 0 && (
              <div className="grid gap-5 sm:grid-cols-2">
                {remainingPosts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group block focus-ring rounded-[20px]"
                  >
                    <article className="rounded-[20px] border border-[var(--line-1)] bg-[var(--surface-1)] p-6 transition-colors group-hover:border-[var(--line-2)] group-hover:bg-[var(--surface-2)] h-full flex flex-col">
                      {post.coverEmoji && (
                        <div className="w-11 h-11 rounded-[14px] bg-[var(--surface-2)] border border-[var(--line-1)] flex items-center justify-center text-xl mb-4">
                          {post.coverEmoji}
                        </div>
                      )}
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <time className="text-xs text-[var(--ink-1)]">
                          {post.date}
                        </time>
                        <span className="text-xs text-[var(--ink-1)]">·</span>
                        <span className="text-xs text-[var(--ink-1)]">
                          {post.readingTime} min read
                        </span>
                      </div>
                      <h2 className="text-lg font-semibold text-[var(--ink-3)] mb-2 tracking-[-0.005em]">
                        {post.title}
                      </h2>
                      <p className="text-sm text-[var(--ink-1)] leading-relaxed mb-4 flex-1">
                        {post.excerpt}
                      </p>
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-[11px] px-2 py-0.5 rounded-full bg-[var(--surface-2)] border border-[var(--line-1)] text-[var(--ink-1)]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <span className="inline-flex items-center gap-1 text-sm text-[var(--ink-3)] font-medium group-hover:gap-2 transition-all">
                        Read more
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
                      </span>
                    </article>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      <MarketingFooter />
    </div>
  );
}
