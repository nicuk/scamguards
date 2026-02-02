import { NextRequest, NextResponse } from "next/server";

// The admin token is stored securely in environment variables
// URL format: /admin/YOUR_SECRET_TOKEN
const ADMIN_TOKEN = process.env.ADMIN_SECRET_TOKEN;

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  // Security: Must have token configured
  if (!ADMIN_TOKEN) {
    console.error("ADMIN_SECRET_TOKEN not configured");
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Security: Constant-time comparison to prevent timing attacks
  if (!token || token.length !== ADMIN_TOKEN.length || !timingSafeEqual(token, ADMIN_TOKEN)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ authorized: true });
}

// Constant-time string comparison to prevent timing attacks
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}
