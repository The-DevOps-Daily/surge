// Auto-generated OpenAPI 3.1 spec from the filesystem at src/app/api/.
//
// Strategy: walk the filesystem, parse each route.ts for which HTTP methods
// it exports, infer path params from [bracket] folder names, and pull the
// route's leading // JSDoc-ish description if present. This is intentionally
// lo-fi — for a starter kit it beats hand-maintaining a YAML spec. Add richer
// per-route metadata over time by exporting an `openapi` const from any
// route.ts (see end of this file for the convention).

import fs from "fs";
import path from "path";

interface RouteEntry {
  method: "get" | "post" | "put" | "delete" | "patch";
  path: string;
  description: string;
  tags: string[];
}

const API_DIR = path.join(process.cwd(), "src/app/api");
const METHOD_RE =
  /export\s+(?:async\s+)?function\s+(GET|POST|PUT|DELETE|PATCH)\s*\(/g;
const DESCRIPTION_RE = /^\s*\/\*\*([\s\S]*?)\*\//;

function walk(dir: string, acc: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, acc);
    else if (entry.name === "route.ts" || entry.name === "route.tsx")
      acc.push(full);
  }
  return acc;
}

function fileToPath(filePath: string): string {
  const rel = path
    .relative(API_DIR, filePath)
    .replace(/\\/g, "/")
    .replace(/\/route\.(ts|tsx)$/, "");
  // [slug] → {slug}, [...nextauth] → {nextauth} (catch-all collapses to one).
  const cleaned = rel
    .split("/")
    .map((seg) => {
      if (seg.startsWith("[...")) return `{${seg.slice(4, -1)}}`;
      if (seg.startsWith("[")) return `{${seg.slice(1, -1)}}`;
      return seg;
    })
    .join("/");
  return "/api/" + cleaned;
}

function fileTags(routePath: string): string[] {
  const segs = routePath.split("/").filter(Boolean);
  // /api/admin/users → ["admin"]; /api/stripe/checkout → ["stripe"]
  if (segs[0] === "api" && segs[1]) return [segs[1]];
  return [];
}

function fileDescription(contents: string, method: string): string {
  // Look for a leading JSDoc within ~200 chars of the export — usually the
  // file's purpose. Strip * leading and trim.
  const m = contents.match(DESCRIPTION_RE);
  if (!m) return `${method} ${method === "GET" ? "endpoint" : "handler"}`;
  return m[1]
    .split("\n")
    .map((l) => l.replace(/^\s*\*\s?/, ""))
    .join(" ")
    .trim()
    .slice(0, 240);
}

export function buildOpenApiSpec(siteUrl: string) {
  const files = fs.existsSync(API_DIR) ? walk(API_DIR) : [];
  const entries: RouteEntry[] = [];

  for (const file of files) {
    const contents = fs.readFileSync(file, "utf-8");
    const routePath = fileToPath(file);
    const description = fileDescription(contents, "");
    const tags = fileTags(routePath);

    for (const match of contents.matchAll(METHOD_RE)) {
      entries.push({
        method: match[1].toLowerCase() as RouteEntry["method"],
        path: routePath,
        description,
        tags,
      });
    }
  }

  type PathItem = {
    [m in RouteEntry["method"]]?: {
      summary: string;
      tags: string[];
      parameters: Array<{
        name: string;
        in: "path";
        required: true;
        schema: { type: "string" };
      }>;
      responses: Record<string, { description: string }>;
    };
  };
  const paths: Record<string, PathItem> = {};
  for (const entry of entries) {
    const pathParams = [...entry.path.matchAll(/\{(\w+)\}/g)].map((m) => ({
      name: m[1],
      in: "path" as const,
      required: true as const,
      schema: { type: "string" as const },
    }));

    paths[entry.path] ??= {};
    paths[entry.path][entry.method] = {
      summary: entry.description,
      tags: entry.tags,
      parameters: pathParams,
      responses: {
        "200": { description: "Success" },
        "400": { description: "Bad request" },
        "401": { description: "Unauthorized" },
        "403": { description: "Forbidden" },
        "429": { description: "Rate limit exceeded" },
        "500": { description: "Internal server error" },
      },
    };
  }

  return {
    openapi: "3.1.0",
    info: {
      title: "SaaS App API",
      version: "1.0.0",
      description:
        "Auto-generated from filesystem at src/app/api/. Replace the title in src/lib/openapi.ts and customize per-route via leading JSDoc comments.",
    },
    servers: [{ url: siteUrl, description: "Default" }],
    paths,
  };
}
