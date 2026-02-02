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

    // Get all reports with their data points
    const { data: reports, error } = await supabase
      .from("reports")
      .select(`
        id,
        scam_type,
        platform,
        description,
        status,
        is_verified,
        created_at,
        evidence_urls,
        amount_lost,
        currency,
        data_points (
          id,
          type,
          value
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Reports fetch error:", error);
      return NextResponse.json({ error: "Failed to fetch reports" }, { status: 500 });
    }

    return NextResponse.json(reports || []);
  } catch (error) {
    console.error("Admin reports error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
