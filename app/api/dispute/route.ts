import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { normalizeDataPoint } from "@/lib/utils/normalize";

interface DisputeInput {
  disputedInfo: string;
  reason: string;
  contactEmail: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as DisputeInput;
    const { disputedInfo, reason, contactEmail } = body;

    // Validation
    if (!disputedInfo || !disputedInfo.trim()) {
      return NextResponse.json(
        { error: "Disputed information is required" },
        { status: 400 }
      );
    }

    if (!reason || !reason.trim()) {
      return NextResponse.json(
        { error: "Reason is required" },
        { status: 400 }
      );
    }

    if (!contactEmail || !contactEmail.includes("@")) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Try to find matching reports based on the disputed info
    // We'll search in data_points for matches
    const normalizedValue = disputedInfo.toLowerCase().replace(/[\s-]/g, "");

    const { data: matchingPoints } = await supabase
      .from("data_points")
      .select("report_id, normalized_value")
      .ilike("normalized_value", `%${normalizedValue}%`)
      .limit(5);

    // Create dispute records for any matching reports
    const points = matchingPoints as { report_id: string; normalized_value: string }[] | null;
    
    if (points && points.length > 0) {
      const reportIds = points.map((p) => p.report_id);
      const uniqueReportIds = Array.from(new Set(reportIds));

      for (const reportId of uniqueReportIds) {
        // Create dispute
        await supabase.from("disputes").insert({
          report_id: reportId,
          reason,
          contact_email: contactEmail,
          status: "pending",
        });

        // Mark report as disputed
        await supabase
          .from("reports")
          .update({ is_disputed: true })
          .eq("id", reportId);
      }
    } else {
      // No matching reports found, create a general dispute record
      // First, create a placeholder report to link the dispute to
      const { data: placeholderReport } = await supabase
        .from("reports")
        .insert({
          scam_type: "other",
          description: `Dispute filed for: ${disputedInfo}`,
          status: "under_review",
          is_disputed: true,
        })
        .select()
        .single();

      if (placeholderReport) {
        await supabase.from("disputes").insert({
          report_id: placeholderReport.id,
          reason,
          contact_email: contactEmail,
          status: "pending",
        });
      }
    }

    // Log the dispute (audit trail)
    await supabase.from("audit_logs").insert({
      action: "dispute",
      metadata: {
        disputed_info: disputedInfo,
        found_matches: matchingPoints?.length || 0,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Dispute submitted successfully",
    });
  } catch (error) {
    console.error("Dispute API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
