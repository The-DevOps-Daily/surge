import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow landing, pricing, login, register, API, and static assets without auth
  const publicPaths = ["/landing", "/pricing", "/login", "/register", "/forgot-password", "/reset-password", "/api/auth", "/api/stripe/webhook", "/blog", "/tools", "/terms", "/privacy", "/compare"];
  const isPublic = publicPaths.some((p) => pathname.startsWith(p));
  const isStatic = pathname.startsWith("/_next") || pathname === "/favicon.ico";

  if (isPublic || isStatic) {
    return NextResponse.next();
  }

  const session = await auth();

  // Root path: redirect unauthenticated users to /landing
  if (pathname === "/") {
    if (!session) {
      return NextResponse.redirect(new URL("/landing", req.url));
    }
    return NextResponse.next();
  }

  // All other paths require auth
  if (!session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Admin routes handle their own role check in the admin layout
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
