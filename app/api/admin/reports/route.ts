import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const adminClient = createAdminClient();

    const [reportsResult, statsResult] = await Promise.all([
      adminClient
        .from("reports")
        .select(`
          id,
          scam_type,
          platform,
          description,
          status,
          is_verified,
          created_at,
          evidence_url,
          amount_lost,
          currency,
          data_points (
            id,
            type,
            value
          )
        `)
        .order("created_at", { ascending: false })
        .limit(500),
      
      Promise.all([
        adminClient.from("reports").select("*", { count: "exact", head: true }),
        adminClient.from("reports").select("*", { count: "exact", head: true }).eq("is_verified", true),
        adminClient.from("audit_logs").select("*", { count: "exact", head: true }).eq("action", "search"),
      ]),
    ]);

    const [totalResult, verifiedResult, searchResult] = statsResult;

    return NextResponse.json({
      reports: reportsResult.data || [],
      stats: {
        totalReports: totalResult.count || 0,
        verifiedReports: verifiedResult.count || 0,
        totalSearches: searchResult.count || 0,
        pendingModeration: (totalResult.count || 0) - (verifiedResult.count || 0),
      },
    });
  } catch (error) {
    console.error("Admin reports API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
