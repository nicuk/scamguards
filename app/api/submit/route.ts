import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { normalizeDataPoint } from "@/lib/utils/normalize";
import { SCAM_TYPES } from "@/lib/constants";

// Hash IP for privacy
function hashIP(ip: string): string {
  let hash = 0;
  for (let i = 0; i < ip.length; i++) {
    const char = ip.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return `ip_${Math.abs(hash).toString(16)}`;
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get IP for spam prevention
    const clientIP = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
                     request.headers.get("x-real-ip") || "unknown";
    const ipHash = hashIP(clientIP);
    
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

    // Check for duplicates and create data points with tracking
    const duplicateInfo: { value: string; reportCount: number; isNew: boolean }[] = [];
    let hasExistingReports = false;
    let maxExistingReportCount = 0;

    for (const dp of dataPoints) {
      const normalizedValue = normalizeDataPoint(dp.type, dp.value);
      
      // Check if this data point already exists
      const { data: existingCheck } = await supabase
        .from("data_points")
        .select("id, report_count")
        .eq("type", dp.type)
        .eq("normalized_value", normalizedValue)
        .limit(1)
        .single();

      const currentReportCount = existingCheck?.report_count || 0;
      const newReportCount = currentReportCount + 1;

      if (existingCheck) {
        hasExistingReports = true;
        maxExistingReportCount = Math.max(maxExistingReportCount, currentReportCount);
      }

      // Insert the data point with updated count
      const { error: dpError } = await supabase
        .from("data_points")
        .insert({
          report_id: report.id,
          type: dp.type,
          value: dp.value,
          normalized_value: normalizedValue,
          report_count: newReportCount,
        });

      if (dpError) {
        console.error("Data point insert error:", dpError);
      }

      // Update report_count on ALL existing matching data points
      if (existingCheck) {
        await supabase
          .from("data_points")
          .update({ 
            report_count: newReportCount,
            // last_reported_at: new Date().toISOString() // Only if column exists
          })
          .eq("type", dp.type)
          .eq("normalized_value", normalizedValue);
      }

      duplicateInfo.push({
        value: dp.value,
        reportCount: newReportCount,
        isNew: !existingCheck,
      });
    }

    // Calculate confidence score based on report count
    const confidenceScore = Math.min(100, 50 + (maxExistingReportCount * 10));
    const heatLevel = maxExistingReportCount >= 10 ? "CRITICAL" :
                      maxExistingReportCount >= 5 ? "HIGH" :
                      maxExistingReportCount >= 3 ? "MEDIUM" : "LOW";

    // Log the submission (audit trail)
    await supabase.from("audit_logs").insert({
      action: "submit",
      entity_type: "report",
      entity_id: report.id,
      details: {
        scam_type: scamType,
        data_point_count: dataPoints.length,
        has_evidence: isVerified,
        has_existing_reports: hasExistingReports,
        max_report_count: maxExistingReportCount + 1,
      },
    });

    return NextResponse.json({
      success: true,
      reportId: report.id,
      isVerified,
      // New: Duplicate detection info
      duplicateInfo: {
        hasExistingReports,
        totalPreviousReports: maxExistingReportCount,
        confidenceScore,
        heatLevel,
        message: hasExistingReports 
          ? `This scammer has been reported ${maxExistingReportCount} time(s) before. Your report adds to the evidence.`
          : "Thank you for being the first to report this scammer.",
        dataPoints: duplicateInfo,
      },
    });
  } catch (error) {
    console.error("Submit API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
