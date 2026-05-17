"use client";

import { useEffect, useState } from "react";

interface BlogPostMeta {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  tags: string[];
  coverEmoji: string;
  readingTime: number;
}

export default function AdminContentPage() {
  const [posts, setPosts] = useState<BlogPostMeta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/content")
      .then((res) => res.json())
      .then((data) => {
        setPosts(data.posts || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold tracking-[-0.01em] text-[var(--ink-3)]">
          Content management
        </h1>
        <p className="text-sm text-[var(--ink-1)] mt-1.5">
          Blog post inventory (read-only).
        </p>
      </div>

      <div className="rounded-[18px] border border-[var(--line-1)] bg-[var(--surface-1)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-[var(--line-1)]">
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-[0.05em] text-[var(--ink-1)]">Title</th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-[0.05em] text-[var(--ink-1)]">Slug</th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-[0.05em] text-[var(--ink-1)]">Date</th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-[0.05em] text-[var(--ink-1)]">Author</th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-[0.05em] text-[var(--ink-1)]">Tags</th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-[0.05em] text-[var(--ink-1)]">Reading time</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[var(--ink-1)]">
                    Loading...
                  </td>
                </tr>
              ) : posts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[var(--ink-1)]">
                    No blog posts found. Add markdown files to{" "}
                    <code className="text-[var(--warn)] bg-[var(--warn-soft)] px-1.5 py-0.5 rounded text-xs font-mono">
                      content/blog/
                    </code>
                    .
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr
                    key={post.slug}
                    className="border-b border-[var(--line-1)] last:border-0 hover:bg-[var(--surface-2)]/50 transition-colors"
                  >
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2">
                        {post.coverEmoji && (
                          <span className="w-7 h-7 rounded-[8px] bg-[var(--surface-2)] border border-[var(--line-1)] flex items-center justify-center text-sm flex-shrink-0">
                            {post.coverEmoji}
                          </span>
                        )}
                        <span className="text-[var(--ink-3)] font-medium">
                          {post.title}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <a
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--warn)] hover:underline underline-offset-4 transition-colors font-mono text-xs"
                      >
                        {post.slug}
                      </a>
                    </td>
                    <td className="px-6 py-3 text-[var(--ink-1)] tabular-nums">
                      {post.date}
                    </td>
                    <td className="px-6 py-3 text-[var(--ink-2)]">
                      {post.author}
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex flex-wrap gap-1">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[11px] px-2 py-0.5 rounded-full bg-[var(--surface-2)] border border-[var(--line-1)] text-[var(--ink-1)]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-3 text-[var(--ink-1)] tabular-nums">
                      {post.readingTime} min
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-[14px] border border-[var(--line-1)] bg-[var(--warn-soft)] p-4">
        <p className="text-sm text-[var(--ink-2)]">
          Blog posts are stored as markdown files in{" "}
          <code className="text-[var(--warn)] bg-[var(--surface-1)] px-1.5 py-0.5 rounded text-xs font-mono">
            content/blog/
          </code>
          . To add or edit content, modify the markdown files directly.
        </p>
      </div>
    </div>
  );
}
