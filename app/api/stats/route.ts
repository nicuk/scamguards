import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 0; // Don't cache - always fetch fresh

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

    console.log("platform_stats error, falling back:", statsError?.message);

    // Fallback: Calculate directly from tables
    // Get all reports (not filtering by status in case it's null)
    const { count: reportCount, error: reportError } = await supabase
      .from("reports")
      .select("*", { count: "exact", head: true });

    if (reportError) {
      console.log("Reports count error:", reportError.message);
    }

    const { count: verifiedCount, error: verifiedError } = await supabase
      .from("reports")
      .select("*", { count: "exact", head: true })
      .eq("is_verified", true);

    if (verifiedError) {
      console.log("Verified count error:", verifiedError.message);
    }

    const { count: searchCount, error: searchError } = await supabase
      .from("audit_logs")
      .select("*", { count: "exact", head: true })
      .eq("action", "search");

    if (searchError) {
      console.log("Search count error:", searchError.message);
    }

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
