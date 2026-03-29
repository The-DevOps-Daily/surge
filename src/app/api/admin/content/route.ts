import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { getAllPosts } from "@/lib/blog";

export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const posts = getAllPosts();

  return NextResponse.json({ posts });
}
