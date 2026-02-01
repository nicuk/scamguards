export interface AnalysisResult {
  status: "suspicious" | "no_known_info" | "clear";
  confidence: number;
  summary: string;
  matched_fields: string[];
  factors: {
    factor: string;
    impact: "positive" | "negative" | "neutral";
  }[];
}

export interface SearchInput {
  type: string;
  value: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MatchedReport = Record<string, any>;

/**
 * Call Qwen API via DashScope for analysis
 */
async function callQwen(prompt: string): Promise<string> {
  const apiKey = process.env.DASHSCOPE_API_KEY;
  
  if (!apiKey) {
    throw new Error("DASHSCOPE_API_KEY is not configured");
  }

  const response = await fetch(
    "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "qwen-turbo",
        messages: [
          {
            role: "system",
            content: `You are a fraud risk analyst for ScamGuard Malaysia. Analyze search results and provide risk assessments.

IMPORTANT GUIDELINES:
- Use neutral, non-accusatory language
- State facts, not accusations
- "Suspicious" means matching reports exist, not confirmed fraud
- Always explain the factors that influenced your assessment
- Be helpful but cautious`,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 500,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    console.error("Qwen API error:", error);
    throw new Error(`Qwen API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || "";
}

/**
 * Analyze search results using Qwen AI
 */
export async function analyzeSearchResults(
  inputs: SearchInput[],
  matchedReports: MatchedReport[]
): Promise<AnalysisResult> {
  // If no matches, return early
  if (matchedReports.length === 0) {
    return {
      status: "no_known_info",
      confidence: 95,
      summary:
        "No matching reports were found in our database for the information you provided.",
      matched_fields: [],
      factors: [
        {
          factor: "No matching data points found in database",
          impact: "neutral",
        },
      ],
    };
  }

  // Build prompt with context
  const inputSummary = inputs
    .map((i) => `- ${i.type}: ${i.value}`)
    .join("\n");

  const matchSummary = matchedReports
    .map((r, idx) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const points = r.matched_points.map((p: any) => p.type).join(", ");
      const verified = r.is_verified ? "(verified)" : "(unverified)";
      const disputed = r.is_disputed ? "(disputed)" : "";
      return `${idx + 1}. Scam type: ${r.scam_type} ${verified} ${disputed}\n   Matched: ${points}\n   Date: ${new Date(r.created_at).toLocaleDateString()}`;
    })
    .join("\n");

  const verifiedCount = matchedReports.filter((r) => r.is_verified).length;
  const disputedCount = matchedReports.filter((r) => r.is_disputed).length;

  const prompt = `Analyze these search results and provide a fraud risk assessment.

USER SEARCHED FOR:
${inputSummary}

DATABASE MATCHES FOUND: ${matchedReports.length} report(s)
${matchSummary}

ADDITIONAL CONTEXT:
- Verified reports: ${verifiedCount}
- Disputed reports: ${disputedCount}

Respond in JSON format only:
{
  "status": "suspicious" | "no_known_info" | "clear",
  "confidence": 0-100,
  "summary": "1-2 sentence factual explanation",
  "matched_fields": ["list of matched data types"],
  "factors": [
    {"factor": "description of factor", "impact": "positive" | "negative" | "neutral"}
  ]
}`;

  try {
    const response = await callQwen(prompt);
    
    // Parse JSON from response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Could not parse JSON from response");
    }
    
    const result = JSON.parse(jsonMatch[0]) as AnalysisResult;
    
    // Ensure valid status
    if (!["suspicious", "no_known_info", "clear"].includes(result.status)) {
      result.status = matchedReports.length > 0 ? "suspicious" : "no_known_info";
    }
    
    // Ensure confidence is in range
    result.confidence = Math.max(0, Math.min(100, result.confidence));
    
    return result;
  } catch (error) {
    console.error("Analysis error:", error);
    
    // Fallback to rule-based analysis
    return fallbackAnalysis(inputs, matchedReports);
  }
}

/**
 * Fallback rule-based analysis if AI fails
 */
function fallbackAnalysis(
  inputs: SearchInput[],
  matchedReports: MatchedReport[]
): AnalysisResult {
  const matchedTypes = new Set<string>();
  matchedReports.forEach((r) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    r.matched_points.forEach((p: any) => matchedTypes.add(p.type));
  });

  const verifiedCount = matchedReports.filter((r) => r.is_verified).length;
  const disputedCount = matchedReports.filter((r) => r.is_disputed).length;
  
  // Calculate confidence based on rules
  let confidence = 50;
  const factors: AnalysisResult["factors"] = [];

  // More reports = higher confidence
  if (matchedReports.length >= 3) {
    confidence += 20;
    factors.push({
      factor: `Found in ${matchedReports.length} separate reports`,
      impact: "negative",
    });
  } else if (matchedReports.length >= 1) {
    confidence += 10;
    factors.push({
      factor: `Found in ${matchedReports.length} report(s)`,
      impact: "negative",
    });
  }

  // Verified reports matter more
  if (verifiedCount > 0) {
    confidence += 15;
    factors.push({
      factor: `${verifiedCount} verified report(s) with evidence`,
      impact: "negative",
    });
  }

  // Disputed reports reduce confidence
  if (disputedCount > 0) {
    confidence -= 10;
    factors.push({
      factor: `${disputedCount} report(s) have been disputed`,
      impact: "positive",
    });
  }

  // Multiple data types matching is more significant
  if (matchedTypes.size >= 2) {
    confidence += 10;
    factors.push({
      factor: `Multiple data types matched (${Array.from(matchedTypes).join(", ")})`,
      impact: "negative",
    });
  }

  confidence = Math.max(0, Math.min(100, confidence));

  return {
    status: matchedReports.length > 0 ? "suspicious" : "no_known_info",
    confidence,
    summary:
      matchedReports.length > 0
        ? `The information you searched has appeared in ${matchedReports.length} previous report(s). Please exercise caution.`
        : "No matching reports found.",
    matched_fields: Array.from(matchedTypes),
    factors,
  };
}
