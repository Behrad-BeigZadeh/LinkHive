import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const refreshToken = req.cookies.get("refreshToken")?.value;

  const pathname = req.nextUrl.pathname;

  const isAuthPage = pathname.startsWith("/auth");
  const isPublicPage = pathname.startsWith("/public-page");
  const isHomePage = pathname === "/";

  if (isPublicPage || isHomePage) {
    return NextResponse.next();
  }

  if (refreshToken && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (!refreshToken && !isAuthPage) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Apply to all routes except static files and API routes
    "/((?!_next|favicon.ico|api|static|images|fonts).*)",
  ],
};
