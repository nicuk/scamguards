import { createHash } from "crypto";
import type { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export type RateLimitResult = {
  allowed: boolean;
  count: number;
  limit: number;
  retryAfter?: number;
};

/** Best-effort client IP from the usual proxy headers. */
export function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    "unknown"
  );
}

/**
 * One-way hash so the rate_limits table never stores a raw IP or email.
 * Salted with the service role key, which is already server-only, to stop
 * anyone with table access from brute-forcing the small IP/email space.
 */
export function hashIdentifier(value: string): string {
  const salt =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.STORAGE_SUPABASE_SERVICE_ROLE_KEY ||
    "scamguards";

  return createHash("sha256")
    .update(`${salt}:${value.toLowerCase()}`)
    .digest("hex")
    .slice(0, 48);
}

/**
 * Durable rate limit shared across serverless instances.
 *
 * Fails open: if the database is unreachable the request is allowed through,
 * because the in-memory middleware limiter is still in front of it and a
 * database blip should not take down a contact form. Failures are logged.
 */
export async function checkRateLimit(
  identifier: string,
  identifierType: "ip_hash" | "email_hash",
  action: string,
  limit: number,
  windowSeconds: number
): Promise<RateLimitResult> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("check_rate_limit", {
      p_identifier: identifier,
      p_identifier_type: identifierType,
      p_action: action,
      p_limit: limit,
      p_window_seconds: windowSeconds,
    });

    if (error || !data) {
      console.error("Rate limit RPC error:", error);
      return { allowed: true, count: 0, limit };
    }

    const result = data as {
      allowed: boolean;
      count: number;
      limit: number;
      retry_after?: number;
    };

    return {
      allowed: result.allowed,
      count: result.count,
      limit: result.limit,
      retryAfter: result.retry_after,
    };
  } catch (error) {
    console.error("Rate limit check failed:", error);
    return { allowed: true, count: 0, limit };
  }
}
