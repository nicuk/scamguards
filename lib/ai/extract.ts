// AI-powered data extraction from unstructured text
// Uses Qwen to identify phone numbers, emails, bank accounts, etc.

import { DATA_POINT_TYPES, DataPointType } from "@/lib/constants";

export interface ExtractedDataPoint {
  type: DataPointType;
  value: string;
  confidence: number; // 0-100
}

export interface ExtractionResult {
  dataPoints: ExtractedDataPoint[];
  suggestedScamType?: string;
  rawAnalysis?: string;
}

const EXTRACTION_PROMPT = `You are a data extraction assistant for a scam prevention platform in Malaysia.

Analyze the following text and extract ALL identifiable data points that could be used to track scammers.

IMPORTANT GUIDELINES:
1. Extract Malaysian phone numbers (format: 01X-XXX XXXX or +60...)
2. Extract email addresses
3. Extract bank account numbers (usually 10-16 digits)
4. Extract WhatsApp/Telegram usernames or numbers
5. Extract website URLs
6. Extract company names or business names mentioned
7. Extract person names or aliases
8. Extract e-wallet accounts (Touch n Go, GrabPay, etc.)
9. Extract crypto wallet addresses (long alphanumeric strings)
10. Extract social media profiles (Facebook, Instagram, etc.)

For each extracted item, determine the type from this list:
- phone: Phone numbers
- email: Email addresses
- bank_account: Bank account numbers
- whatsapp: WhatsApp numbers
- telegram: Telegram usernames
- ewallet: E-wallet accounts
- social_media: Social media profiles
- website: Website URLs
- crypto_wallet: Crypto wallet addresses
- name: Names or aliases
- company: Company/business names

Also suggest the most likely scam type from:
- collectibles_scam: TCG cards, figurines, One Piece, Pokemon
- precious_metals_scam: Gold, silver, precious metals
- ecommerce_scam: Online shopping fraud
- macau_scam: Phone impersonation (police, bank, court)
- love_scam: Romance/dating scams
- investment_scam: Forex, crypto investments
- parcel_scam: Fake delivery/customs fees
- job_scam: Fake job offers
- loan_scam: Illegal loan schemes
- mule_recruitment: Money mule recruitment
- phishing: Fake websites/emails

Respond ONLY in this JSON format (no markdown, no explanation):
{
  "dataPoints": [
    {"type": "phone", "value": "012-345 6789", "confidence": 95},
    {"type": "email", "value": "scammer@email.com", "confidence": 90}
  ],
  "suggestedScamType": "ecommerce_scam"
}

If no data points found, return: {"dataPoints": [], "suggestedScamType": null}

TEXT TO ANALYZE:
`;

export async function extractDataPoints(text: string): Promise<ExtractionResult> {
  const apiKey = process.env.DASHSCOPE_API_KEY;
  
  if (!apiKey) {
    console.warn("DASHSCOPE_API_KEY not set, using regex fallback");
    return fallbackExtraction(text);
  }

  try {
    const response = await fetch(
      "https://dashscope-intl.aliyuncs.com/compatible-mode/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "qwen-plus",
          messages: [
            {
              role: "user",
              content: EXTRACTION_PROMPT + text.slice(0, 4000), // Limit input size
            },
          ],
          temperature: 0.1, // Low temperature for consistent extraction
          max_tokens: 1000,
        }),
      }
    );

    if (!response.ok) {
      console.error("DashScope API error:", response.status);
      return fallbackExtraction(text);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return fallbackExtraction(text);
    }

    // Parse JSON response
    try {
      // Clean up potential markdown formatting
      const cleanContent = content
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      
      const parsed = JSON.parse(cleanContent);
      
      // Validate and sanitize extracted data
      const validDataPoints: ExtractedDataPoint[] = [];
      
      if (Array.isArray(parsed.dataPoints)) {
        for (const dp of parsed.dataPoints) {
          if (
            dp.type &&
            dp.value &&
            Object.keys(DATA_POINT_TYPES).includes(dp.type)
          ) {
            validDataPoints.push({
              type: dp.type as DataPointType,
              value: String(dp.value).trim(),
              confidence: Math.min(100, Math.max(0, dp.confidence || 80)),
            });
          }
        }
      }

      return {
        dataPoints: validDataPoints,
        suggestedScamType: parsed.suggestedScamType || undefined,
        rawAnalysis: content,
      };
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      return fallbackExtraction(text);
    }
  } catch (error) {
    console.error("Extraction API error:", error);
    return fallbackExtraction(text);
  }
}

// Regex-based fallback extraction when AI is unavailable
function fallbackExtraction(text: string): ExtractionResult {
  const dataPoints: ExtractedDataPoint[] = [];

  // Malaysian phone numbers
  const phoneRegex = /(?:\+?60|0)[1-9]\d{1,2}[-\s]?\d{3,4}[-\s]?\d{4}/g;
  const phones = text.match(phoneRegex) || [];
  phones.forEach((phone) => {
    dataPoints.push({ type: "phone", value: phone.trim(), confidence: 85 });
  });

  // Email addresses
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const emails = text.match(emailRegex) || [];
  emails.forEach((email) => {
    dataPoints.push({ type: "email", value: email.toLowerCase(), confidence: 90 });
  });

  // Bank account numbers (10-16 digits)
  const bankRegex = /\b\d{10,16}\b/g;
  const bankAccounts = text.match(bankRegex) || [];
  bankAccounts.forEach((account) => {
    // Filter out phone numbers already captured
    if (!phones.some((p) => p.replace(/[-\s]/g, "").includes(account))) {
      dataPoints.push({ type: "bank_account", value: account, confidence: 70 });
    }
  });

  // URLs
  const urlRegex = /https?:\/\/[^\s<>"{}|\\^`\[\]]+/gi;
  const urls = text.match(urlRegex) || [];
  urls.forEach((url) => {
    dataPoints.push({ type: "website", value: url, confidence: 90 });
  });

  // Telegram usernames
  const telegramRegex = /@[a-zA-Z0-9_]{5,32}/g;
  const telegrams = text.match(telegramRegex) || [];
  telegrams.forEach((tg) => {
    dataPoints.push({ type: "telegram", value: tg, confidence: 75 });
  });

  // Crypto wallets (simplified - ETH/BTC format)
  const cryptoRegex = /\b(0x[a-fA-F0-9]{40}|[13][a-km-zA-HJ-NP-Z1-9]{25,34})\b/g;
  const cryptoWallets = text.match(cryptoRegex) || [];
  cryptoWallets.forEach((wallet) => {
    dataPoints.push({ type: "crypto_wallet", value: wallet, confidence: 85 });
  });

  // Deduplicate
  const unique = dataPoints.filter(
    (dp, index, self) =>
      index === self.findIndex((d) => d.type === dp.type && d.value === dp.value)
  );

  return {
    dataPoints: unique,
    suggestedScamType: undefined,
  };
}
