import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Static assets pass through
  const isStatic =
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/icon-") ||
    pathname.startsWith("/apple-touch") ||
    pathname.startsWith("/manifest") ||
    pathname.endsWith(".svg") ||
    pathname.endsWith(".png") ||
    pathname.endsWith(".ico");

  if (isStatic) {
    return NextResponse.next();
  }

  // Public paths - always accessible
  const publicPaths = [
    "/landing",
    "/pricing",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/api/",
    "/blog",
    "/share",
    "/tools",
    "/terms",
    "/privacy",
    "/compare",
    "/sitemap",
    "/robots",
    "/og/",
    "/not-found",
  ];

  const isPublic = publicPaths.some((p) => pathname.startsWith(p));
  if (isPublic) {
    return NextResponse.next();
  }

  // Root path is the landing page (always public)
  if (pathname === "/") {
    return NextResponse.next();
  }

  // Everything else requires auth
  const session = await auth();

  if (!session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
