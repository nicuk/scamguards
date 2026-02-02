import { NextRequest, NextResponse } from "next/server";
import { analyzeReport } from "@/lib/ai/report-analyzer";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text } = body;

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Text is required" },
        { status: 400 }
      );
    }

    if (text.length < 20) {
      return NextResponse.json(
        { error: "Please provide more details about the scam incident." },
        { status: 400 }
      );
    }

    if (text.length > 15000) {
      return NextResponse.json(
        { error: "Text too long. Maximum 15,000 characters." },
        { status: 400 }
      );
    }

    const result = await analyzeReport(text);

    return NextResponse.json({
      success: true,
      ...result,
      message:
        result.dataPoints.length > 0
          ? `Extracted ${result.dataPoints.length} data point(s). Please review and correct if needed.`
          : "Could not extract data points. Please enter them manually.",
    });
  } catch (error) {
    console.error("Report analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze report. Please try again or enter manually." },
      { status: 500 }
    );
  }
}
