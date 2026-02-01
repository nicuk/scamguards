import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

// Rate limits per action (requests per hour)
const RATE_LIMITS: Record<string, number> = {
  search: 100,    // 100 searches per hour
  submit: 10,     // 10 reports per hour
  dispute: 5,     // 5 disputes per hour
};

// Hash function for IP (privacy-preserving)
function hashIP(ip: string): string {
  // Simple hash - in production use crypto
  let hash = 0;
  for (let i = 0; i < ip.length; i++) {
    const char = ip.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return `ip_${Math.abs(hash).toString(16)}`;
}

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Only rate limit API routes
  if (!request.nextUrl.pathname.startsWith("/api/")) {
    return response;
  }

  // Skip rate limiting for stats (read-only, cached)
  if (request.nextUrl.pathname === "/api/stats") {
    return response;
  }

  // Determine action from path
  const pathParts = request.nextUrl.pathname.split("/");
  const action = pathParts[2]; // /api/search, /api/submit, /api/dispute

  const limit = RATE_LIMITS[action];
  if (!limit) {
    return response;
  }

  // Get client IP
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] 
    || request.headers.get("x-real-ip") 
    || "unknown";
  
  const identifier = hashIP(ip);

  // For now, use in-memory rate limiting
  // In production, this would use the database function
  const rateLimitKey = `${identifier}:${action}`;
  const now = Date.now();
  const windowMs = 60 * 60 * 1000; // 1 hour
  
  // Get or create rate limit entry from headers (stateless approach)
  const rateLimitHeader = request.headers.get("x-rate-limit-count");
  const rateLimitWindow = request.headers.get("x-rate-limit-window");
  
  let count = 1;
  let windowStart = now;
  
  if (rateLimitHeader && rateLimitWindow) {
    const prevWindow = parseInt(rateLimitWindow);
    if (now - prevWindow < windowMs) {
      count = parseInt(rateLimitHeader) + 1;
      windowStart = prevWindow;
    }
  }

  // Set rate limit headers
  response.headers.set("X-RateLimit-Limit", limit.toString());
  response.headers.set("X-RateLimit-Remaining", Math.max(0, limit - count).toString());
  response.headers.set("X-RateLimit-Reset", (windowStart + windowMs).toString());

  // Check if over limit
  if (count > limit) {
    return new NextResponse(
      JSON.stringify({
        error: "Too many requests",
        message: `Rate limit exceeded. Please try again later.`,
        retryAfter: Math.ceil((windowStart + windowMs - now) / 1000),
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": Math.ceil((windowStart + windowMs - now) / 1000).toString(),
          "X-RateLimit-Limit": limit.toString(),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": (windowStart + windowMs).toString(),
        },
      }
    );
  }

  return response;
}

export const config = {
  matcher: "/api/:path*",
};
