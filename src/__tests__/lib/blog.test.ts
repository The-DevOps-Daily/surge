import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import fs from "fs";
import path from "path";

// We test the real blog module against the actual content/blog directory.
// If the directory does not exist or is empty, some tests may be skipped.

import { getAllPosts, getPostBySlug, getAllSlugs } from "@/lib/blog";

const BLOG_DIR = path.join(process.cwd(), "content/blog");
const blogDirExists = fs.existsSync(BLOG_DIR);
const blogFiles = blogDirExists
  ? fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"))
  : [];

describe("getAllPosts", () => {
  it("returns all blog posts", () => {
    const posts = getAllPosts();
    expect(Array.isArray(posts)).toBe(true);
    expect(posts.length).toBe(blogFiles.length);
  });

  it("returns posts sorted by date (newest first)", () => {
    const posts = getAllPosts();
    if (posts.length < 2) return; // nothing to sort
    for (let i = 0; i < posts.length - 1; i++) {
      expect(posts[i].date >= posts[i + 1].date).toBe(true);
    }
  });

  it("each post has required fields", () => {
    const posts = getAllPosts();
    for (const post of posts) {
      expect(post.title).toBeDefined();
      expect(typeof post.title).toBe("string");
      expect(post.excerpt).toBeDefined();
      expect(post.date).toBeDefined();
      expect(post.slug).toBeDefined();
      expect(Array.isArray(post.tags)).toBe(true);
      expect(typeof post.readingTime).toBe("number");
      expect(post.readingTime).toBeGreaterThanOrEqual(1);
    }
  });

  it("coverEmoji is extracted from frontmatter", () => {
    const posts = getAllPosts();
    // At least the known post "getting-started" has a coverEmoji
    const knownPost = posts.find((p) => p.slug === "getting-started");
    if (knownPost) {
      expect(knownPost.coverEmoji).toBeTruthy();
    }
  });
});

describe("getPostBySlug", () => {
  it("returns correct post for valid slug", async () => {
    if (blogFiles.length === 0) return;
    const slug = blogFiles[0].replace(/\.md$/, "");
    const post = await getPostBySlug(slug);
    expect(post).not.toBeNull();
    expect(post!.slug).toBe(slug);
    expect(post!.title).toBeDefined();
    expect(post!.content).toBeDefined();
  });

  it("returns null for non-existent slug", async () => {
    const post = await getPostBySlug("this-slug-does-not-exist-12345");
    expect(post).toBeNull();
  });

  it("post content is rendered as HTML (not raw markdown)", async () => {
    if (blogFiles.length === 0) return;
    const slug = blogFiles[0].replace(/\.md$/, "");
    const post = await getPostBySlug(slug);
    expect(post).not.toBeNull();
    // HTML content should contain tags
    expect(post!.content).toMatch(/<[a-z]/i);
    // Should not start with markdown heading syntax
    expect(post!.content.trimStart().startsWith("##")).toBe(false);
  });
});

describe("getAllSlugs", () => {
  it("returns array of strings", () => {
    const slugs = getAllSlugs();
    expect(Array.isArray(slugs)).toBe(true);
    for (const slug of slugs) {
      expect(typeof slug).toBe("string");
      // Slugs should not contain file extensions
      expect(slug).not.toContain(".md");
    }
  });

  it("returns same count as blog files", () => {
    const slugs = getAllSlugs();
    expect(slugs.length).toBe(blogFiles.length);
  });
});
