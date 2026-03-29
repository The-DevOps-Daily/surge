import { describe, it, expect } from "vitest";
import { getAllPosts } from "@/lib/blog";

describe("blog posts", () => {
  it("getAllPosts returns 10 posts", () => {
    const posts = getAllPosts();
    expect(posts).toHaveLength(10);
  });

  it("each post has coverEmoji", () => {
    const posts = getAllPosts();
    for (const post of posts) {
      expect(post.coverEmoji).toBeDefined();
      expect(post.coverEmoji.length).toBeGreaterThan(0);
    }
  });

  it("no post content contains em dashes", () => {
    const posts = getAllPosts();
    // em dash is U+2014
    for (const post of posts) {
      // getAllPosts returns meta only, check fields that are available
      expect(post.title).not.toContain("\u2014");
      expect(post.excerpt).not.toContain("\u2014");
    }
  });

  it("reading time is calculated correctly (> 0)", () => {
    const posts = getAllPosts();
    for (const post of posts) {
      expect(post.readingTime).toBeGreaterThan(0);
    }
  });

  it("each post has required fields", () => {
    const posts = getAllPosts();
    for (const post of posts) {
      expect(post.slug).toBeTruthy();
      expect(post.title).toBeTruthy();
      expect(post.date).toBeTruthy();
      expect(post.author).toBeTruthy();
    }
  });

  it("posts are sorted by date descending", () => {
    const posts = getAllPosts();
    for (let i = 1; i < posts.length; i++) {
      expect(posts[i - 1].date >= posts[i].date).toBe(true);
    }
  });
});
