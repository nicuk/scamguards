import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const [reportResult, verifiedResult, searchResult, dpResult, amountResult] =
      await Promise.all([
        supabase
          .from("reports")
          .select("*", { count: "exact", head: true })
          .eq("status", "active"),
        supabase
          .from("reports")
          .select("*", { count: "exact", head: true })
          .eq("is_verified", true)
          .eq("status", "active"),
        supabase
          .from("audit_logs")
          .select("*", { count: "exact", head: true })
          .eq("action", "search"),
        supabase
          .from("data_points")
          .select("*", { count: "exact", head: true }),
        supabase
          .from("reports")
          .select("amount_lost")
          .eq("status", "active")
          .not("amount_lost", "is", null),
      ]);

    const totalAmountLost = (amountResult.data || []).reduce(
      (sum, r) => sum + (Number(r.amount_lost) || 0),
      0
    );

    const response = NextResponse.json({
      totalReports: reportResult.count || 0,
      verifiedReports: verifiedResult.count || 0,
      totalSearches: searchResult.count || 0,
      totalAmountLost,
      totalDataPoints: dpResult.count || 0,
    });

    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate"
    );
    return response;
  } catch (error) {
    console.error("Stats API error:", error);
    return NextResponse.json({
      totalReports: 0,
      verifiedReports: 0,
      totalSearches: 0,
      totalAmountLost: 0,
      totalDataPoints: 0,
    });
  }
}
