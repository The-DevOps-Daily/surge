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
        <h1 className="text-2xl font-bold text-gray-100">Content Management</h1>
        <p className="text-sm text-gray-500 mt-1">
          Blog post inventory (read-only)
        </p>
      </div>

      <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-white/[0.06]">
                <th className="px-6 py-4 font-medium">Title</th>
                <th className="px-6 py-4 font-medium">Slug</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Author</th>
                <th className="px-6 py-4 font-medium">Tags</th>
                <th className="px-6 py-4 font-medium">Reading Time</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : posts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No blog posts found. Add markdown files to the content/blog
                    directory.
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr
                    key={post.slug}
                    className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {post.coverEmoji && (
                          <span className="text-lg">{post.coverEmoji}</span>
                        )}
                        <span className="text-gray-200 font-medium">
                          {post.title}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <a
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-violet-400 hover:text-violet-300 transition-colors"
                      >
                        {post.slug}
                      </a>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{post.date}</td>
                    <td className="px-6 py-4 text-gray-400">{post.author}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[11px] px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {post.readingTime} min
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-violet-500/5 border border-violet-500/20 rounded-xl p-4">
        <p className="text-sm text-violet-300">
          Blog posts are stored as markdown files in{" "}
          <code className="text-violet-400 bg-violet-500/10 px-1.5 py-0.5 rounded text-xs">
            content/blog/
          </code>
          . To add or edit content, modify the markdown files directly.
        </p>
      </div>
    </div>
  );
}
