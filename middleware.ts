import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_ROUTES = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check for auth token (cookie preferred for SSR; localStorage is client-only)
  const cookieToken = request.cookies.get("ps_access_token")?.value;

  const isPublic = PUBLIC_ROUTES.some((r) => pathname.startsWith(r));

  // If on a public route with a valid token → redirect to home
  if (isPublic && cookieToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If on a protected route without a token → redirect to login
  // Note: localStorage-based auth is client-side only; this middleware
  // acts as a first-pass guard using cookie. The AuthProvider in layout.tsx
  // handles the client-side redirect for the localStorage-token case.
  if (!isPublic && !cookieToken) {
    const loginUrl = new URL("/login", request.url);
    if (pathname !== "/") {
      loginUrl.searchParams.set("redirect", pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static, _next/image (Next.js internals)
     * - favicon.ico
     * - api routes
     */
    "/((?!_next/static|_next/image|favicon.ico|api/).*)",
  ],
};
