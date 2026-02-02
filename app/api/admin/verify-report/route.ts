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

export async function POST(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  
  if (!verifyToken(token)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const { reportId, verified } = await request.json();

    if (!reportId || typeof verified !== "boolean") {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const supabase = await createClient();

    const { error } = await supabase
      .from("reports")
      .update({ 
        is_verified: verified,
        status: verified ? "active" : "pending"
      })
      .eq("id", reportId);

    if (error) {
      console.error("Verify report error:", error);
      return NextResponse.json({ error: "Failed to update report" }, { status: 500 });
    }

    // Log the action
    await supabase.from("audit_logs").insert({
      action: verified ? "admin_verify" : "admin_unverify",
      entity_type: "report",
      entity_id: reportId,
      details: { verified },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin verify error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
