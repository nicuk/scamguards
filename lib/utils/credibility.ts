/**
 * Lightweight credibility scoring for report submissions.
 * No AI calls — pure heuristics.
 * Returns a score from 0-100 and flags.
 */

interface CredibilityResult {
  score: number;
  flags: string[];
  level: "high" | "medium" | "low";
}

// Simple hash for template detection
function templateHash(text: string): string {
  const normalized = text
    .toLowerCase()
    .replace(/\d+/g, "N")             // numbers → N
    .replace(/\b\w{1,3}\b/g, "")       // strip short words
    .replace(/[^\w\s]/g, "")           // strip punctuation
    .replace(/\s+/g, " ")             // collapse whitespace
    .trim();
  
  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    hash = ((hash << 5) - hash) + normalized.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

// In-memory recent submission templates (per instance)
const recentTemplates = new Map<string, { count: number; firstSeen: number }>();

function cleanOldTemplates() {
  const oneHourAgo = Date.now() - 3600000;
  for (const [key, val] of recentTemplates) {
    if (val.firstSeen < oneHourAgo) recentTemplates.delete(key);
  }
}

export function scoreCredibility(
  description: string | null,
  dataPointCount: number,
  scamType: string,
  ipHash: string
): CredibilityResult {
  const flags: string[] = [];
  let score = 50; // start neutral

  const text = (description || "").trim();
  const wordCount = text ? text.split(/\s+/).length : 0;

  // --- Data quality signals ---
  
  // Has any description at all
  if (wordCount === 0) {
    score -= 10;
    flags.push("no_description");
  } else if (wordCount >= 10) {
    score += 15;
  } else if (wordCount >= 5) {
    score += 5;
  }

  // Multiple data points = more effort = more likely genuine
  if (dataPointCount >= 3) score += 10;
  else if (dataPointCount >= 2) score += 5;

  if (scamType && scamType !== "other") score += 5;

  // Combined low-effort signal: no description + generic type + minimal data
  if (wordCount === 0 && (!scamType || scamType === "other") && dataPointCount <= 1) {
    score -= 10;
    flags.push("zero_effort");
  }

  // --- Template / spam detection ---
  cleanOldTemplates();

  if (wordCount >= 3) {
    const tHash = `${templateHash(text)}:${ipHash}`;
    const existing = recentTemplates.get(tHash);

    if (existing) {
      existing.count++;
      if (existing.count >= 3) {
        score -= 30;
        flags.push("template_spam");
      } else {
        score -= 10;
        flags.push("similar_recent");
      }
    } else {
      recentTemplates.set(tHash, { count: 1, firstSeen: Date.now() });
    }

    // Also check without IP — cross-IP template detection
    const globalHash = templateHash(text);
    const globalExisting = recentTemplates.get(globalHash);

    if (globalExisting) {
      globalExisting.count++;
      if (globalExisting.count >= 5) {
        score -= 40;
        flags.push("mass_template");
      }
    } else {
      recentTemplates.set(globalHash, { count: 1, firstSeen: Date.now() });
    }
  }

  // --- Clamp and classify ---
  score = Math.max(0, Math.min(100, score));

  const level: CredibilityResult["level"] =
    score >= 60 ? "high" :
    score >= 35 ? "medium" : "low";

  return { score, flags, level };
}
