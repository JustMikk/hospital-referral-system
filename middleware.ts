import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSession, updateSession } from "@/lib/auth-edge";

export async function middleware(request: NextRequest) {
  const session = await getSession(request);
  const { pathname } = request.nextUrl;

  const isPublicRoute =
    pathname === "/" ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/contact-hospitals");

  if (!session && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (session && isPublicRoute) {
    return NextResponse.redirect(new URL("/referrals", request.url));
  }

  return (await updateSession(request)) || NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
