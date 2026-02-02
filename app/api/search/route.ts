import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { analyzeSearchResults } from "@/lib/ai/analyze";
import { normalizeDataPoint } from "@/lib/utils/normalize";

interface SearchInput {
  type: string;
  value: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecord = Record<string, any>;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { inputs } = body as { inputs: SearchInput[] };

    if (!inputs || inputs.length === 0) {
      return NextResponse.json(
        { error: "No search inputs provided" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Normalize all inputs
    const normalizedInputs = inputs.map((input) => ({
      ...input,
      normalizedValue: normalizeDataPoint(input.type, input.value),
    }));

    // Search for matching data points (exact + fuzzy for names)
    const matchPromises = normalizedInputs.map(async (input) => {
      // For names, use fuzzy matching; for others, use exact match
      if (input.type === "name" || input.type === "company") {
        // Try fuzzy search using ilike for partial matches
        const { data, error } = await supabase
          .from("data_points")
          .select("*, reports(*)")
          .eq("type", input.type)
          .or(`normalized_value.ilike.%${input.normalizedValue}%,value.ilike.%${input.value}%`);

        if (error) {
          console.error("Fuzzy search error:", error);
          return [];
        }
        return (data || []) as AnyRecord[];
      } else {
        // Exact match for phone, email, etc.
        const { data, error } = await supabase
          .from("data_points")
          .select("*, reports(*)")
          .eq("normalized_value", input.normalizedValue)
          .eq("type", input.type);

        if (error) {
          console.error("Search error:", error);
          return [];
        }
        return (data || []) as AnyRecord[];
      }
    });

    const matchResults = await Promise.all(matchPromises);
    const allMatches = matchResults.flat();

    // Group by report and include matched points
    const reportMap = new Map<string, AnyRecord>();

    for (const match of allMatches) {
      const report = match.reports as AnyRecord;
      if (!report || report.status !== "active") continue;

      if (reportMap.has(report.id)) {
        reportMap.get(report.id)!.matched_points.push(match);
      } else {
        reportMap.set(report.id, {
          ...report,
          matched_points: [match],
        });
      }
    }

    const matchedReports = Array.from(reportMap.values());

    // Calculate date range, counts, and aggregate report counts
    let dateRange: { earliest: string; latest: string } | undefined;
    let verifiedCount = 0;
    let disputedCount = 0;
    let totalReportCount = 0;
    let confidenceScore = 50;
    let heatLevel = "LOW";
    
    if (matchedReports.length > 0) {
      const dates = matchedReports.map((r) => new Date(r.created_at).getTime());
      dateRange = {
        earliest: new Date(Math.min(...dates)).toISOString(),
        latest: new Date(Math.max(...dates)).toISOString(),
      };
      
      verifiedCount = matchedReports.filter((r) => r.is_verified).length;
      disputedCount = matchedReports.filter((r) => r.is_disputed).length;
      
      // Get the highest report_count from matched data points
      const reportCounts = allMatches
        .filter((m) => m.report_count)
        .map((m) => m.report_count as number);
      
      totalReportCount = reportCounts.length > 0 ? Math.max(...reportCounts) : matchedReports.length;
      
      // Calculate confidence score (50 base + 10 per report, max 100)
      confidenceScore = Math.min(100, 50 + (totalReportCount * 10));
      
      // Determine heat level
      heatLevel = totalReportCount >= 10 ? "CRITICAL" :
                  totalReportCount >= 5 ? "HIGH" :
                  totalReportCount >= 3 ? "MEDIUM" : "LOW";
    }

    // Analyze with AI
    const analysis = await analyzeSearchResults(
      inputs,
      matchedReports
    );

    // Log the search (audit trail)
    await supabase.from("audit_logs").insert({
      action: "search",
      metadata: {
        input_count: inputs.length,
        input_types: inputs.map((i) => i.type),
        match_count: matchedReports.length,
        result_status: analysis.status,
      },
    });

    return NextResponse.json({
      analysis,
      reportCount: matchedReports.length,
      dateRange,
      verifiedCount,
      disputedCount,
      // New: Scammer profile stats
      scammerProfile: {
        totalReportCount,
        confidenceScore,
        heatLevel,
        message: totalReportCount > 1 
          ? `Reported ${totalReportCount} times by the community`
          : totalReportCount === 1 
            ? "First report in our database"
            : null,
      },
    });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
