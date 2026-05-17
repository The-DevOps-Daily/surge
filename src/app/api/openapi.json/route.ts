import { NextResponse } from "next/server";
import { buildOpenApiSpec } from "@/lib/openapi";

export const dynamic = "force-static";
export const revalidate = 3600;

export async function GET() {
  const siteUrl = process.env.NEXTAUTH_URL || "https://example.com";
  const spec = buildOpenApiSpec(siteUrl);
  return NextResponse.json(spec, {
    headers: {
      "Cache-Control": "public, max-age=300, s-maxage=3600",
      "X-Robots-Tag": "all",
    },
  });
}
