import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSession, updateSession } from "@/lib/auth-edge";

export async function middleware(request: NextRequest) {
  const session = await getSession(request);
  const { pathname } = request.nextUrl;

  // Define public routes that should ALWAYS be accessible
  const alwaysPublicRoutes = [
    "/", // Landing page
    "/contact-hospitals", // Contact page
  ];

  // Define auth-only routes (where logged-in users should be redirected FROM)
  const authRoutes = ["/login", "/forgot-password"];

  const isAlwaysPublicRoute = alwaysPublicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/"),
  );

  const isAuthRoute = authRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/"),
  );

  const isPublicRoute = isAlwaysPublicRoute || isAuthRoute;

  // 1. Redirect unauthenticated users trying to access protected routes
  if (!session && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 2. Redirect authenticated users trying to access auth-only routes
  //    (but NOT from always public routes like / and /contact-hospitals)
  if (session && isAuthRoute) {
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
