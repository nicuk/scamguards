import { NextRequest, NextResponse } from "next/server";

// Admin emails whitelist from environment variable
// Format: comma-separated emails, e.g., "admin@example.com,boss@example.com"
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "").split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if email is in admin whitelist
    if (!ADMIN_EMAILS.includes(normalizedEmail)) {
      console.log(`Admin access denied for: ${normalizedEmail}`);
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    console.log(`Admin access granted for: ${normalizedEmail}`);
    return NextResponse.json({ authorized: true });
  } catch (error) {
    console.error("Check access error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
