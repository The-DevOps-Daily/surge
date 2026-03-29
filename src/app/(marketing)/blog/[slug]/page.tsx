import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug, getAllSlugs, getAllPosts } from "@/lib/blog";
import { ReadingProgress } from "@/components/blog/reading-progress";
import { ShareButtons } from "@/components/blog/share-buttons";
import { TableOfContents } from "@/components/blog/table-of-contents";
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
    title: `${post.title} - SaaS App`,
    description: post.excerpt,
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
      images: [{ url: `/og/blog/${slug}.svg`, width: 1200, height: 630 }],
    },
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

  const postUrl = `https://your-app.com/blog/${slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    author: { "@type": "Person", name: post.author },
    datePublished: post.date,
    publisher: { "@type": "Organization", name: "SaaS App" },
    description: post.excerpt,
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ReadingProgress />

      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-500/[0.04] rounded-full blur-[128px]" />
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-teal-500/[0.03] rounded-full blur-[128px]" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between max-w-6xl mx-auto px-6 py-6">
        <Link href="/landing" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <span className="text-lg font-bold text-gray-100">SaaS App</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/blog" className="text-sm text-gray-400 hover:text-gray-200 transition-colors">
            Blog
          </Link>
          <Link
            href="/register"
            className="text-sm bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-5 py-2 rounded-xl font-medium shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:from-emerald-400 hover:to-teal-400 transition-all duration-200"
          >
            Start Free
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-8 pb-4">
        {/* Back link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-emerald-400 transition-colors mb-8"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Blog
        </Link>

        {/* Hero Card */}
        <div className="bg-gradient-to-br from-white/[0.06] to-white/[0.02] backdrop-blur-xl rounded-2xl border border-white/[0.08] p-8 md:p-10 mb-8">
          {post.coverEmoji && (
            <div className="text-[80px] leading-none mb-6">{post.coverEmoji}</div>
          )}

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <time className="text-sm text-gray-500">{post.date}</time>
            <span className="text-sm text-gray-600">|</span>
            <span className="text-sm text-gray-500">{post.readingTime} min read</span>
            <span className="text-sm text-gray-600">|</span>
            <span className="text-sm text-gray-500">By {post.author}</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
            {post.title}
          </h1>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Share Buttons */}
          <ShareButtons title={post.title} url={postUrl} />
        </div>
      </div>

      {/* Content with TOC sidebar */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 pb-12">
        <div className="flex gap-12">
          {/* Main Content */}
          <article className="max-w-3xl flex-1 min-w-0">
            <div
              className="blog-content prose prose-invert prose-emerald max-w-none
                prose-headings:text-gray-100 prose-headings:font-semibold
                prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
                prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                prose-p:text-gray-400 prose-p:leading-relaxed prose-p:mb-4
                prose-strong:text-gray-200
                prose-li:text-gray-400
                prose-a:text-emerald-400 prose-a:no-underline hover:prose-a:underline
                prose-ol:space-y-2 prose-ul:space-y-2"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* CTA */}
            <div className="mt-16 bg-white/[0.04] backdrop-blur-xl rounded-2xl border border-white/[0.06] p-8 text-center">
              <h3 className="text-xl font-semibold text-gray-100 mb-2">
                Ready to get started?
              </h3>
              <p className="text-sm text-gray-400 mb-6">
                Start building your financial picture today. Free forever, no credit card required.
              </p>
              <Link
                href="/register"
                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-medium text-sm shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-200"
              >
                Get Started for Free
              </Link>
            </div>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <div className="mt-16">
                <h3 className="text-lg font-semibold text-gray-100 mb-6">Related Posts</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  {relatedPosts.map((related) => (
                    <Link key={related.slug} href={`/blog/${related.slug}`}>
                      <div className="bg-white/[0.04] backdrop-blur-xl rounded-2xl border border-white/[0.06] p-5 hover:bg-white/[0.07] hover:border-white/[0.1] transition-all duration-300 h-full">
                        {related.coverEmoji && (
                          <div className="text-3xl mb-3">{related.coverEmoji}</div>
                        )}
                        <h4 className="text-sm font-semibold text-gray-200 mb-2">{related.title}</h4>
                        <p className="text-xs text-gray-500 line-clamp-2">{related.excerpt}</p>
                        <div className="mt-3 text-xs text-emerald-400 font-medium">
                          Read more &rarr;
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* TOC Sidebar */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <TableOfContents />
          </aside>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">&copy; {new Date().getFullYear()} SaaS App</p>
          <div className="flex gap-6 text-xs text-gray-500">
            <Link href="/landing" className="hover:text-gray-300 transition-colors">Home</Link>
            <Link href="/blog" className="hover:text-gray-300 transition-colors">Blog</Link>
            <Link href="/pricing" className="hover:text-gray-300 transition-colors">Pricing</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
