import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog - SaaS App",
  description: "Personal finance tips, FIRE movement guides, and wealth-building strategies.",
  openGraph: {
    title: "Blog - SaaS App",
    description: "Personal finance tips, FIRE movement guides, and wealth-building strategies.",
    images: [{ url: "/og/landing.svg", width: 1200, height: 630 }],
  },
};

export default function BlogIndexPage() {
  const posts = getAllPosts();
  const featuredPost = posts[0];
  const remainingPosts = posts.slice(1);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-100">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-500/[0.04] rounded-full blur-[128px]" />
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-teal-500/[0.03] rounded-full blur-[128px]" />
      </div>

      <MarketingNav />

      {/* Hero Header */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-16 pb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
            Blog
          </span>
        </h1>
        <p className="text-lg text-gray-400 max-w-xl mx-auto">
          Insights on building wealth and financial independence.
        </p>
      </div>

      {/* Posts */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 pb-24">
        {posts.length === 0 ? (
          <p className="text-center text-gray-500">No posts yet. Check back soon.</p>
        ) : (
          <div className="space-y-12">
            {/* Featured Post */}
            {featuredPost && (
              <Link href={`/blog/${featuredPost.slug}`} className="block mb-8">
                <article className="bg-gradient-to-br from-white/[0.06] to-white/[0.02] backdrop-blur-xl rounded-2xl border border-white/[0.08] p-8 md:p-10 hover:bg-white/[0.07] hover:border-white/[0.12] transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/5">
                  <div className="flex flex-col md:flex-row md:items-start gap-6">
                    {featuredPost.coverEmoji && (
                      <div className="text-6xl md:text-7xl flex-shrink-0">{featuredPost.coverEmoji}</div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 font-medium uppercase tracking-wide">
                          Featured
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <time className="text-xs text-gray-500">{featuredPost.date}</time>
                        <span className="text-xs text-gray-600">|</span>
                        <span className="text-xs text-gray-500">{featuredPost.readingTime} min read</span>
                        {featuredPost.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-100 mb-3">
                        {featuredPost.title}
                      </h2>
                      <p className="text-sm text-gray-400 leading-relaxed mb-4">
                        {featuredPost.excerpt}
                      </p>
                      <div className="text-sm text-emerald-400 font-medium">
                        Read more &rarr;
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            )}

            {/* Remaining Posts Grid */}
            {remainingPosts.length > 0 && (
              <div className="grid gap-6 sm:grid-cols-2">
                {remainingPosts.map((post) => (
                  <Link key={post.slug} href={`/blog/${post.slug}`}>
                    <article className="bg-white/[0.04] backdrop-blur-xl rounded-2xl border border-white/[0.06] p-6 hover:bg-white/[0.07] hover:border-white/[0.1] transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/5 h-full">
                      {post.coverEmoji && (
                        <div className="text-4xl mb-4">{post.coverEmoji}</div>
                      )}
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <time className="text-xs text-gray-500">{post.date}</time>
                        <span className="text-xs text-gray-600">|</span>
                        <span className="text-xs text-gray-500">{post.readingTime} min read</span>
                      </div>
                      <h2 className="text-lg font-semibold text-gray-100 mb-2">
                        {post.title}
                      </h2>
                      <p className="text-sm text-gray-400 leading-relaxed mb-3">
                        {post.excerpt}
                      </p>
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="text-sm text-emerald-400 font-medium">
                        Read more &rarr;
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <MarketingFooter />
    </div>
  );
}
