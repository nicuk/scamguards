import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { normalizeDataPoint } from "@/lib/utils/normalize";
import { SCAM_TYPES } from "@/lib/constants";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check content type to determine how to parse
    const contentType = request.headers.get("content-type") || "";
    
    let scamType: string;
    let platform: string | null;
    let description: string | null;
    let amountLost: number | null = null;
    let dataPoints: { type: string; value: string }[];
    let evidenceUrl: string | null = null;
    let isVerified = false;

    if (contentType.includes("multipart/form-data")) {
      // Parse FormData (with file upload)
      const formData = await request.formData();
      
      scamType = formData.get("scamType") as string;
      platform = (formData.get("platform") as string) || null;
      description = (formData.get("description") as string) || null;
      const amountStr = formData.get("amountLost") as string;
      amountLost = amountStr ? parseFloat(amountStr) : null;
      dataPoints = JSON.parse(formData.get("dataPoints") as string || "[]");
      
      const evidenceFile = formData.get("evidence") as File | null;
      
      // Upload evidence to Supabase Storage if provided
      if (evidenceFile && evidenceFile.size > 0) {
        const fileExt = evidenceFile.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("evidence")
          .upload(fileName, evidenceFile, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          console.error("Upload error:", uploadError);
          // Don't fail the whole request if upload fails
        } else if (uploadData) {
          // Get public URL
          const { data: urlData } = supabase.storage
            .from("evidence")
            .getPublicUrl(fileName);
          
          evidenceUrl = urlData.publicUrl;
          isVerified = true; // Mark as verified if evidence is provided
        }
      }
    } else {
      // Parse JSON (no file upload)
      const body = await request.json();
      scamType = body.scamType;
      platform = body.platform || null;
      description = body.description || null;
      amountLost = body.amountLost || null;
      dataPoints = body.dataPoints || [];
    }

    // Validation
    if (!scamType || !Object.keys(SCAM_TYPES).includes(scamType)) {
      return NextResponse.json(
        { error: "Invalid scam type" },
        { status: 400 }
      );
    }

    if (!dataPoints || dataPoints.length === 0) {
      return NextResponse.json(
        { error: "At least one data point is required" },
        { status: 400 }
      );
    }

    // Create the report
    const { data: report, error: reportError } = await supabase
      .from("reports")
      .insert({
        scam_type: scamType,
        platform: platform,
        description: description,
        evidence_url: evidenceUrl,
        amount_lost: amountLost,
        currency: amountLost ? "MYR" : null,
        is_verified: isVerified,
        is_disputed: false,
        status: "active",
      })
      .select()
      .single();

    if (reportError || !report) {
      console.error("Report insert error:", reportError);
      return NextResponse.json(
        { error: "Failed to create report" },
        { status: 500 }
      );
    }

    // Create data points
    const dataPointRecords = dataPoints.map((dp) => ({
      report_id: report.id,
      type: dp.type,
      value: dp.value,
      normalized_value: normalizeDataPoint(dp.type, dp.value),
    }));

    const { error: dpError } = await supabase
      .from("data_points")
      .insert(dataPointRecords);

    if (dpError) {
      console.error("Data points insert error:", dpError);
      // Don't fail the whole request, report is already created
    }

    // Log the submission (audit trail)
    await supabase.from("audit_logs").insert({
      action: "submit",
      metadata: {
        report_id: report.id,
        scam_type: scamType,
        data_point_count: dataPoints.length,
        has_evidence: isVerified,
      },
    });

    return NextResponse.json({
      success: true,
      reportId: report.id,
      isVerified,
    });
  } catch (error) {
    console.error("Submit API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
