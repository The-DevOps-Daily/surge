import { getAllDocs, getDocRawMarkdown } from "@/lib/docs";
import { getAllPosts, getPostRawMarkdown } from "@/lib/blog";

// One-shot ingestion bundle for AI crawlers. Concatenates every doc and every
// blog post in full so an agent can consume the entire content corpus in one
// request. Format follows the llmstxt.org convention.

export const dynamic = "force-static";
export const revalidate = 3600;

export async function GET() {
  const docs = getAllDocs();
  const posts = getAllPosts();

  const sections: string[] = [
    "# SaaS App — full content bundle\n",
    "> Complete docs + blog corpus, intended for one-shot AI ingestion. See /llms.txt for the link tree.\n",
  ];

  if (docs.length > 0) {
    sections.push("\n---\n\n# Docs\n");
    for (const doc of docs) {
      const raw = getDocRawMarkdown(doc.slug);
      if (raw) {
        sections.push(`\n## Doc: ${doc.title}\n`);
        sections.push(`Source: /docs/${doc.slug}\n`);
        sections.push("\n" + raw + "\n");
      }
    }
  }

  if (posts.length > 0) {
    sections.push("\n---\n\n# Blog\n");
    for (const post of posts) {
      const raw = getPostRawMarkdown(post.slug);
      if (raw) {
        sections.push(`\n## Post: ${post.title}\n`);
        sections.push(`Source: /blog/${post.slug}\n`);
        sections.push("\n" + raw + "\n");
      }
    }
  }

  return new Response(sections.join(""), {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
      "X-Robots-Tag": "all",
    },
  });
}
