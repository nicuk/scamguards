// AI Report Analyzer - Extracts structured data from scam narratives
// Persona: Empathetic Analyst who understands the full story

import { DATA_POINT_TYPES, DataPointType, SCAM_TYPES, ScamType } from "@/lib/constants";

export interface ExtractedReportData {
  dataPoints: {
    type: DataPointType;
    value: string;
    confidence: number;
  }[];
  scamType: ScamType | null;
  scamTypeConfidence: number;
  platform: string | null;
  amountLost: number | null;
  currency: string;
  summary: string; // AI-generated summary of what happened
  keyDetails: string[]; // Important facts extracted
}

const REPORT_ANALYZER_PROMPT = `You are a compassionate scam report analyst for ScamGuard Malaysia. Your job is to help victims document their experience accurately.

Analyze the following text and extract ALL relevant information for a scam report.

EXTRACT THE FOLLOWING:

1. DATA POINTS (identifiers to track the scammer):
   - phone: Phone numbers (Malaysian: 01X-XXX XXXX or +60...)
   - email: Email addresses
   - bank_account: Bank account numbers (10-16 digits)
   - whatsapp: WhatsApp numbers
   - telegram: Telegram usernames (@username)
   - ewallet: E-wallet accounts (Touch n Go, GrabPay, Boost)
   - social_media: Social media profiles (Facebook, Instagram, TikTok)
   - website: Website URLs
   - crypto_wallet: Crypto addresses
   - name: Names or aliases of scammers
   - company: Business/company names mentioned

2. SCAM TYPE (choose the most likely):
   - collectibles_scam: TCG cards (One Piece, Pokemon), figurines, collectibles
   - precious_metals_scam: Gold, silver, precious metals fraud
   - ecommerce_scam: Online shopping fraud (Shopee, Lazada, Carousell)
   - macau_scam: Phone impersonation (police, bank, court officials)
   - love_scam: Romance/dating scams
   - investment_scam: Forex, crypto, investment schemes
   - parcel_scam: Fake delivery/customs fees
   - job_scam: Fake job offers
   - loan_scam: Illegal loan schemes (Ah Long)
   - mule_recruitment: Money mule recruitment
   - phishing: Fake websites/emails
   - other: Doesn't fit above categories

3. PLATFORM where scam occurred:
   - WhatsApp, Telegram, Facebook, Instagram, TikTok, Shopee, Lazada, Carousell, Mudah.my, Phone Call, SMS, Email, Website, Other

4. AMOUNT LOST (if mentioned):
   - Extract the amount in numbers
   - Identify currency (default MYR)

5. SUMMARY:
   - Write a 1-2 sentence factual summary of what happened

6. KEY DETAILS:
   - List 2-4 important facts (dates, promises made, red flags noticed)

Respond ONLY in this JSON format:
{
  "dataPoints": [
    {"type": "phone", "value": "012-345 6789", "confidence": 95}
  ],
  "scamType": "collectibles_scam",
  "scamTypeConfidence": 85,
  "platform": "Carousell",
  "amountLost": 500,
  "currency": "MYR",
  "summary": "Victim paid RM500 for One Piece cards that were never delivered.",
  "keyDetails": [
    "Transaction on 15 Jan 2024",
    "Seller stopped responding after payment",
    "No tracking number provided"
  ]
}

If information is not found, use null. Always extract what you can.

TEXT TO ANALYZE:
`;

export async function analyzeReport(text: string): Promise<ExtractedReportData> {
  const apiKey = process.env.DASHSCOPE_API_KEY;

  // Default empty result
  const emptyResult: ExtractedReportData = {
    dataPoints: [],
    scamType: null,
    scamTypeConfidence: 0,
    platform: null,
    amountLost: null,
    currency: "MYR",
    summary: "",
    keyDetails: [],
  };

  if (!apiKey) {
    console.warn("DASHSCOPE_API_KEY not set, using regex fallback");
    return fallbackAnalysis(text);
  }

  try {
    const response = await fetch(
      "https://dashscope-intl.aliyuncs.com/compatible-mode/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "qwen-plus",
          messages: [
            {
              role: "system",
              content: "You are a helpful scam report analyst. Extract information accurately and respond only in JSON.",
            },
            {
              role: "user",
              content: REPORT_ANALYZER_PROMPT + text.slice(0, 5000),
            },
          ],
          temperature: 0.1,
          max_tokens: 1500,
        }),
      }
    );

    if (!response.ok) {
      console.error("DashScope API error:", response.status);
      return fallbackAnalysis(text);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return fallbackAnalysis(text);
    }

    // Parse JSON response
    try {
      const cleanContent = content
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();

      const parsed = JSON.parse(cleanContent);

      // Validate and sanitize
      const result: ExtractedReportData = {
        dataPoints: [],
        scamType: null,
        scamTypeConfidence: 0,
        platform: null,
        amountLost: null,
        currency: "MYR",
        summary: "",
        keyDetails: [],
      };

      // Validate data points
      if (Array.isArray(parsed.dataPoints)) {
        for (const dp of parsed.dataPoints) {
          if (dp.type && dp.value && Object.keys(DATA_POINT_TYPES).includes(dp.type)) {
            result.dataPoints.push({
              type: dp.type as DataPointType,
              value: String(dp.value).trim(),
              confidence: Math.min(100, Math.max(0, dp.confidence || 80)),
            });
          }
        }
      }

      // Validate scam type
      if (parsed.scamType && Object.keys(SCAM_TYPES).includes(parsed.scamType)) {
        result.scamType = parsed.scamType as ScamType;
        result.scamTypeConfidence = Math.min(100, Math.max(0, parsed.scamTypeConfidence || 70));
      }

      // Platform
      if (parsed.platform && typeof parsed.platform === "string") {
        result.platform = parsed.platform;
      }

      // Amount lost
      if (parsed.amountLost && typeof parsed.amountLost === "number" && parsed.amountLost > 0) {
        result.amountLost = parsed.amountLost;
      }

      // Currency
      if (parsed.currency && typeof parsed.currency === "string") {
        result.currency = parsed.currency.toUpperCase();
      }

      // Summary
      if (parsed.summary && typeof parsed.summary === "string") {
        result.summary = parsed.summary.slice(0, 500);
      }

      // Key details
      if (Array.isArray(parsed.keyDetails)) {
        result.keyDetails = parsed.keyDetails
          .filter((d: unknown) => typeof d === "string")
          .slice(0, 5)
          .map((d: string) => d.slice(0, 200));
      }

      return result;
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      return fallbackAnalysis(text);
    }
  } catch (error) {
    console.error("Report analysis error:", error);
    return fallbackAnalysis(text);
  }
}

// Regex fallback when AI is unavailable
function fallbackAnalysis(text: string): ExtractedReportData {
  const result: ExtractedReportData = {
    dataPoints: [],
    scamType: null,
    scamTypeConfidence: 0,
    platform: null,
    amountLost: null,
    currency: "MYR",
    summary: "",
    keyDetails: [],
  };

  // Extract phone numbers
  const phoneRegex = /(?:\+?60|0)[1-9]\d{1,2}[-\s]?\d{3,4}[-\s]?\d{4}/g;
  const phones = text.match(phoneRegex) || [];
  phones.forEach((phone) => {
    result.dataPoints.push({ type: "phone", value: phone.trim(), confidence: 85 });
  });

  // Extract emails
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const emails = text.match(emailRegex) || [];
  emails.forEach((email) => {
    result.dataPoints.push({ type: "email", value: email.toLowerCase(), confidence: 90 });
  });

  // Extract bank accounts
  const bankRegex = /\b\d{10,16}\b/g;
  const accounts = text.match(bankRegex) || [];
  accounts.forEach((acc) => {
    if (!phones.some((p) => p.replace(/[-\s]/g, "").includes(acc))) {
      result.dataPoints.push({ type: "bank_account", value: acc, confidence: 70 });
    }
  });

  // Extract URLs
  const urlRegex = /https?:\/\/[^\s<>"{}|\\^`\[\]]+/gi;
  const urls = text.match(urlRegex) || [];
  urls.forEach((url) => {
    result.dataPoints.push({ type: "website", value: url, confidence: 90 });
  });

  // Extract amounts (RM followed by numbers)
  const amountRegex = /RM\s?(\d{1,3}(?:,?\d{3})*(?:\.\d{2})?)/gi;
  const amounts = text.match(amountRegex);
  if (amounts && amounts.length > 0) {
    const largest = amounts
      .map((a) => parseFloat(a.replace(/[RM,\s]/g, "")))
      .sort((a, b) => b - a)[0];
    if (largest > 0) {
      result.amountLost = largest;
    }
  }

  // Detect scam type from keywords
  const lowerText = text.toLowerCase();
  if (lowerText.includes("one piece") || lowerText.includes("pokemon") || lowerText.includes("tcg") || lowerText.includes("card")) {
    result.scamType = "collectibles_scam";
    result.scamTypeConfidence = 75;
  } else if (lowerText.includes("gold") || lowerText.includes("silver") || lowerText.includes("emas")) {
    result.scamType = "precious_metals_scam";
    result.scamTypeConfidence = 75;
  } else if (lowerText.includes("shopee") || lowerText.includes("lazada") || lowerText.includes("carousell")) {
    result.scamType = "ecommerce_scam";
    result.scamTypeConfidence = 70;
  }

  // Detect platform
  const platforms = ["WhatsApp", "Telegram", "Facebook", "Instagram", "Carousell", "Shopee", "Lazada"];
  for (const platform of platforms) {
    if (lowerText.includes(platform.toLowerCase())) {
      result.platform = platform;
      break;
    }
  }

  // Deduplicate data points
  result.dataPoints = result.dataPoints.filter(
    (dp, index, self) =>
      index === self.findIndex((d) => d.type === dp.type && d.value === dp.value)
  );

  return result;
}
