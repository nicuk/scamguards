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
    const { reportId } = await request.json();

    if (!reportId) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const supabase = await createClient();

    // First delete related data_points (due to foreign key)
    await supabase
      .from("data_points")
      .delete()
      .eq("report_id", reportId);

    // Delete any disputes
    await supabase
      .from("disputes")
      .delete()
      .eq("report_id", reportId);

    // Delete the report
    const { error } = await supabase
      .from("reports")
      .delete()
      .eq("id", reportId);

    if (error) {
      console.error("Delete report error:", error);
      return NextResponse.json({ error: "Failed to delete report" }, { status: 500 });
    }

    // Log the action
    await supabase.from("audit_logs").insert({
      action: "admin_delete",
      entity_type: "report",
      entity_id: reportId,
      details: { deleted: true },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin delete error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
