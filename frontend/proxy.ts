import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Proxy request interceptor to validate session cookie presence and expiration.
 * Handles automatic redirection for protected routes.
 */
export function proxy(request: NextRequest) {
  const token = request.cookies.get("session_token")?.value;
  const url = request.nextUrl.clone();
  const path = url.pathname;

  let isTokenValid = false;
  if (token) {
    try {
      const parts = token.split(".");
      if (parts.length === 3) {
        // Decode base64 JWT payload safely
        const payload = JSON.parse(atob(parts[1]));
        const exp = payload.exp;
        
        // Check if token is not expired
        if (!exp || Date.now() < exp * 1000) {
          isTokenValid = true;
        }
      }
    } catch (e) {
      console.error("[PROXY] Failed to parse JWT token structure:", e);
    }
  }

  // Redirection Rules:
  // 1. If trying to visit login page (/) while authenticated, redirect to /dashboard
  if (path === "/") {
    if (isTokenValid) {
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
  } 
  // 2. If trying to visit protected /dashboard while not authenticated, redirect to (/)
  else if (path.startsWith("/dashboard")) {
    if (!isTokenValid) {
      // Clear cookie just in case it was invalid/expired
      const response = NextResponse.redirect(url);
      url.pathname = "/";
      const redirectResponse = NextResponse.redirect(url);
      redirectResponse.cookies.delete("session_token");
      return redirectResponse;
    }
  }

  return NextResponse.next();
}

// Default export compatibility
export default proxy;

// Configure which paths the proxy should run on
export const config = {
  matcher: ["/", "/dashboard/:path*"],
};
