import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const DOCS_DIR = path.join(process.cwd(), "content/docs");

// gray-matter parses YAML dates as Date objects. Normalize to a YYYY-MM-DD
// string so the value is safe to render as a React child and to JSON-serialize.
function normalizeDate(fromFrontmatter: unknown, fallback: Date): string {
  if (typeof fromFrontmatter === "string" && fromFrontmatter.length > 0) {
    return fromFrontmatter;
  }
  if (fromFrontmatter instanceof Date && !isNaN(fromFrontmatter.getTime())) {
    return fromFrontmatter.toISOString().slice(0, 10);
  }
  return fallback.toISOString().slice(0, 10);
}

export interface DocPage {
  slug: string;
  title: string;
  description: string;
  order: number;
  content: string;
  rawMarkdown: string;
  updatedAt: string;
}

export interface DocPageMeta {
  slug: string;
  title: string;
  description: string;
  order: number;
  updatedAt: string;
}

export function getAllDocs(): DocPageMeta[] {
  if (!fs.existsSync(DOCS_DIR)) return [];

  const files = fs.readdirSync(DOCS_DIR).filter((f) => f.endsWith(".md"));

  const docs = files.map((filename) => {
    const slug = filename.replace(/\.md$/, "");
    const filePath = path.join(DOCS_DIR, filename);
    const fileContents = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(fileContents);
    const stat = fs.statSync(filePath);

    return {
      slug,
      title: data.title || slug,
      description: data.description || "",
      order: typeof data.order === "number" ? data.order : 999,
      updatedAt: normalizeDate(data.updatedAt, stat.mtime),
    };
  });

  return docs.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
}

export async function getDocBySlug(slug: string): Promise<DocPage | null> {
  const filePath = path.join(DOCS_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const fileContents = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContents);
  const stat = fs.statSync(filePath);

  const processed = await remark().use(html, { sanitize: true }).process(content);

  return {
    slug,
    title: data.title || slug,
    description: data.description || "",
    order: typeof data.order === "number" ? data.order : 999,
    content: processed.toString(),
    rawMarkdown: fileContents,
    updatedAt: data.updatedAt || stat.mtime.toISOString().slice(0, 10),
  };
}

export function getAllDocSlugs(): string[] {
  if (!fs.existsSync(DOCS_DIR)) return [];
  return fs
    .readdirSync(DOCS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

/** Raw markdown source — used by /docs/<slug>.md and llms-full.txt. */
export function getDocRawMarkdown(slug: string): string | null {
  const filePath = path.join(DOCS_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  return fs.readFileSync(filePath, "utf-8");
}
