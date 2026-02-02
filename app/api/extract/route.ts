import { NextRequest, NextResponse } from "next/server";
import { extractDataPoints } from "@/lib/ai/extract";

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

    if (text.length < 10) {
      return NextResponse.json(
        { error: "Text too short. Please provide more details." },
        { status: 400 }
      );
    }

    if (text.length > 10000) {
      return NextResponse.json(
        { error: "Text too long. Maximum 10,000 characters." },
        { status: 400 }
      );
    }

    const result = await extractDataPoints(text);

    return NextResponse.json({
      success: true,
      dataPoints: result.dataPoints,
      suggestedScamType: result.suggestedScamType,
      message:
        result.dataPoints.length > 0
          ? `Found ${result.dataPoints.length} data point(s). Please review and correct if needed.`
          : "No data points found. Try adding more details or enter manually.",
    });
  } catch (error) {
    console.error("Extraction error:", error);
    return NextResponse.json(
      { error: "Failed to extract data. Please try again or enter manually." },
      { status: 500 }
    );
  }
}
