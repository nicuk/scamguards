import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Rate limits configuration
const RATE_LIMITS: Record<string, { limit: number; windowSeconds: number; banAfter: number }> = {
  search: { limit: 60, windowSeconds: 3600, banAfter: 200 },      // 60/hr, ban after 200
  submit: { limit: 5, windowSeconds: 3600, banAfter: 20 },        // 5/hr, ban after 20
  dispute: { limit: 3, windowSeconds: 3600, banAfter: 15 },       // 3/hr, ban after 15
  extract: { limit: 20, windowSeconds: 3600, banAfter: 50 },      // 20/hr (AI calls)
  "analyze-report": { limit: 10, windowSeconds: 3600, banAfter: 30 }, // 10/hr (AI calls)
};

// Cooldown between submissions (seconds)
const SUBMISSION_COOLDOWN = 60; // 1 minute between reports

// In-memory store (works per-instance, resets on deploy)
// For production at scale, use Redis or database
const rateLimitStore = new Map<string, { count: number; windowStart: number; lastRequest: number }>();
const bannedIPs = new Map<string, number>(); // IP -> ban expiry timestamp

// Hash function for IP (privacy-preserving)
function hashIP(ip: string): string {
  let hash = 0;
  for (let i = 0; i < ip.length; i++) {
    const char = ip.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return `ip_${Math.abs(hash).toString(16)}`;
}

// Get client IP
function getClientIP(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") || // Cloudflare
    "unknown"
  );
}

// Check if IP is banned
function isBanned(ipHash: string): { banned: boolean; retryAfter?: number } {
  const banExpiry = bannedIPs.get(ipHash);
  if (!banExpiry) return { banned: false };
  
  const now = Date.now();
  if (now < banExpiry) {
    return { banned: true, retryAfter: Math.ceil((banExpiry - now) / 1000) };
  }
  
  // Ban expired, remove it
  bannedIPs.delete(ipHash);
  return { banned: false };
}

// Ban an IP
function banIP(ipHash: string, durationHours: number = 24): void {
  const banExpiry = Date.now() + (durationHours * 60 * 60 * 1000);
  bannedIPs.set(ipHash, banExpiry);
  console.log(`[SECURITY] IP ${ipHash} banned for ${durationHours} hours`);
}

// Check and update rate limit
function checkRateLimit(
  ipHash: string, 
  action: string, 
  config: { limit: number; windowSeconds: number; banAfter: number }
): { allowed: boolean; remaining: number; resetAt: number; shouldBan: boolean } {
  const key = `${ipHash}:${action}`;
  const now = Date.now();
  const windowMs = config.windowSeconds * 1000;
  
  let entry = rateLimitStore.get(key);
  
  // Reset window if expired
  if (!entry || (now - entry.windowStart) > windowMs) {
    entry = { count: 0, windowStart: now, lastRequest: now };
  }
  
  entry.count++;
  entry.lastRequest = now;
  rateLimitStore.set(key, entry);
  
  const remaining = Math.max(0, config.limit - entry.count);
  const resetAt = entry.windowStart + windowMs;
  
  // Check if should be banned (excessive abuse)
  const shouldBan = entry.count >= config.banAfter;
  
  return {
    allowed: entry.count <= config.limit,
    remaining,
    resetAt,
    shouldBan,
  };
}

// Check submission cooldown
function checkCooldown(ipHash: string): { allowed: boolean; waitSeconds?: number } {
  const key = `${ipHash}:submit`;
  const entry = rateLimitStore.get(key);
  
  if (!entry) return { allowed: true };
  
  const now = Date.now();
  const timeSinceLastRequest = (now - entry.lastRequest) / 1000;
  
  if (timeSinceLastRequest < SUBMISSION_COOLDOWN) {
    return { 
      allowed: false, 
      waitSeconds: Math.ceil(SUBMISSION_COOLDOWN - timeSinceLastRequest) 
    };
  }
  
  return { allowed: true };
}

// Clean up old entries (called on each request to avoid setInterval in edge runtime)
function cleanupOldEntries(): void {
  const now = Date.now();
  const oneHourAgo = now - (60 * 60 * 1000);
  
  // Clean old rate limit entries
  Array.from(rateLimitStore.entries()).forEach(([key, entry]) => {
    if (entry.windowStart < oneHourAgo) {
      rateLimitStore.delete(key);
    }
  });
  
  // Clean expired bans
  Array.from(bannedIPs.entries()).forEach(([ip, expiry]) => {
    if (expiry < now) {
      bannedIPs.delete(ip);
    }
  });
}

// Track last cleanup time
let lastCleanup = Date.now();

export async function middleware(request: NextRequest) {
  // Cleanup old entries every 5 minutes
  const now = Date.now();
  if (now - lastCleanup > 5 * 60 * 1000) {
    cleanupOldEntries();
    lastCleanup = now;
  }

  // Only rate limit API routes
  if (!request.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // Skip rate limiting for certain routes
  const skipRoutes = ["/api/stats", "/api/admin"];
  if (skipRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Get client IP and hash it
  const clientIP = getClientIP(request);
  const ipHash = hashIP(clientIP);

  // Check if IP is banned
  const banCheck = isBanned(ipHash);
  if (banCheck.banned) {
    return new NextResponse(
      JSON.stringify({
        error: "Access temporarily blocked",
        message: "Your access has been temporarily restricted due to suspicious activity. Please try again later.",
        retryAfter: banCheck.retryAfter,
      }),
      {
        status: 403,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": banCheck.retryAfter?.toString() || "86400",
        },
      }
    );
  }

  // Determine action from path
  const pathParts = request.nextUrl.pathname.split("/");
  const action = pathParts[2]; // /api/search, /api/submit, etc.

  const config = RATE_LIMITS[action];
  if (!config) {
    return NextResponse.next();
  }

  // For submissions, check cooldown first
  if (action === "submit" && request.method === "POST") {
    const cooldownCheck = checkCooldown(ipHash);
    if (!cooldownCheck.allowed) {
      return new NextResponse(
        JSON.stringify({
          error: "Cooldown active",
          message: `Please wait ${cooldownCheck.waitSeconds} seconds before submitting another report.`,
          retryAfter: cooldownCheck.waitSeconds,
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": cooldownCheck.waitSeconds?.toString() || "60",
          },
        }
      );
    }
  }

  // Check rate limit
  const rateCheck = checkRateLimit(ipHash, action, config);

  // Ban if excessive abuse detected
  if (rateCheck.shouldBan) {
    banIP(ipHash, 24); // 24 hour ban
    return new NextResponse(
      JSON.stringify({
        error: "Access blocked",
        message: "Your access has been blocked due to excessive requests. This may indicate automated abuse.",
        retryAfter: 86400, // 24 hours
      }),
      {
        status: 403,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": "86400",
        },
      }
    );
  }

  // Rate limit exceeded
  if (!rateCheck.allowed) {
    const retryAfter = Math.ceil((rateCheck.resetAt - Date.now()) / 1000);
    return new NextResponse(
      JSON.stringify({
        error: "Too many requests",
        message: `Rate limit exceeded. Please try again in ${Math.ceil(retryAfter / 60)} minutes.`,
        retryAfter,
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": retryAfter.toString(),
          "X-RateLimit-Limit": config.limit.toString(),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": rateCheck.resetAt.toString(),
        },
      }
    );
  }

  // Allowed - add rate limit headers
  const response = NextResponse.next();
  response.headers.set("X-RateLimit-Limit", config.limit.toString());
  response.headers.set("X-RateLimit-Remaining", rateCheck.remaining.toString());
  response.headers.set("X-RateLimit-Reset", rateCheck.resetAt.toString());

  return response;
}

export const config = {
  matcher: "/api/:path*",
};
