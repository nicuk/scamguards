import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 60; // Cache for 60 seconds

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Try to get from materialized view first (fast)
    const { data: stats, error: statsError } = await supabase
      .from("platform_stats")
      .select("*")
      .single();

    if (stats && !statsError) {
      return NextResponse.json({
        totalReports: stats.total_reports || 0,
        verifiedReports: stats.verified_reports || 0,
        totalSearches: stats.total_searches || 0,
        totalAmountLost: stats.total_amount_lost || 0,
      });
    }

    // Fallback: Calculate directly (slower but works without materialized view)
    const { count: reportCount } = await supabase
      .from("reports")
      .select("*", { count: "exact", head: true })
      .eq("status", "active");

    const { count: verifiedCount } = await supabase
      .from("reports")
      .select("*", { count: "exact", head: true })
      .eq("status", "active")
      .eq("is_verified", true);

    const { count: searchCount } = await supabase
      .from("audit_logs")
      .select("*", { count: "exact", head: true })
      .eq("action", "search");

    return NextResponse.json({
      totalReports: reportCount || 0,
      verifiedReports: verifiedCount || 0,
      totalSearches: searchCount || 0,
      totalAmountLost: 0,
    });
  } catch (error) {
    console.error("Stats API error:", error);
    // Return zeros on error instead of failing
    return NextResponse.json({
      totalReports: 0,
      verifiedReports: 0,
      totalSearches: 0,
      totalAmountLost: 0,
    });
  }
}
