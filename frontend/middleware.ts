import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const refreshToken = req.cookies.get("refreshToken")?.value;
  const pathname = req.nextUrl.pathname;

  const isAuthPage = pathname.startsWith("/auth");
  const isPublicPage = pathname.startsWith("/public-page");
  const isHomePage = pathname === "/";

  console.log("📍 Middleware triggered");
  console.log("🧪 Path:", pathname);

  console.log("🔁 Refresh Token:", refreshToken ? "YES" : "NO");

  // Let public and home and auth pages go through
  if (isPublicPage || isHomePage || isAuthPage) {
    if (refreshToken && isAuthPage) {
      // Already logged in? Redirect away from login/signup pages
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  }

  //  User tries to access protected page without being logged in
  if (!refreshToken) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // Logged in or accessing allowed page
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|favicon.ico|api|static|images|fonts).*)", // match all non-static routes
  ],
};
