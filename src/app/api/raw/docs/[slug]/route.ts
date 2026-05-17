import { getDocRawMarkdown } from "@/lib/docs";

interface Params {
  params: Promise<{ slug: string }>;
}

export async function GET(_req: Request, { params }: Params) {
  const { slug } = await params;
  const raw = getDocRawMarkdown(slug);
  if (!raw) {
    return new Response("Not Found", { status: 404 });
  }
  return new Response(raw, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
      "X-Robots-Tag": "all",
    },
  });
}
