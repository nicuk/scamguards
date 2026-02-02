import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const ADMIN_TOKEN = process.env.ADMIN_SECRET_TOKEN;

function verifyToken(token: string | null): boolean {
  if (!ADMIN_TOKEN || !token) return false;
  if (token.length !== ADMIN_TOKEN.length) return false;
  
  let result = 0;
  for (let i = 0; i < token.length; i++) {
    result |= token.charCodeAt(i) ^ ADMIN_TOKEN.charCodeAt(i);
  }
  return result === 0;
}

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  
  if (!verifyToken(token)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const supabase = await createClient();

    // Get counts directly (admin has full access)
    const { count: totalReports } = await supabase
      .from("reports")
      .select("*", { count: "exact", head: true });

    const { count: verifiedReports } = await supabase
      .from("reports")
      .select("*", { count: "exact", head: true })
      .eq("is_verified", true);

    const { count: totalSearches } = await supabase
      .from("audit_logs")
      .select("*", { count: "exact", head: true })
      .eq("action", "search");

    const { count: pendingModeration } = await supabase
      .from("moderation_queue")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending");

    return NextResponse.json({
      totalReports: totalReports || 0,
      verifiedReports: verifiedReports || 0,
      totalSearches: totalSearches || 0,
      pendingModeration: pendingModeration || 0,
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
