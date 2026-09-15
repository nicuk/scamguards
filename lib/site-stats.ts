import { unstable_cache } from "next/cache";
import { createReadClient } from "@/lib/supabase/read";

// The audience figures on the sponsor board, matching the TCGIntel board:
// "N visitors / D days · N search impressions / 30 days".
//
// Both are commercial claims made to people bidding for a slot, so each has a
// rule about when it is NOT shown rather than a floor that flatters it.
//
// SERVER-SAFE, CLIENT-UNSAFE: imported only by server components and routes.

/** Trailing window, in days. The label's "/ 30 days" is this 30. */
export const WINDOW_DAYS = 30;

/** An impressions figure older than this is hidden rather than shown ageing. */
const IMPRESSIONS_MAX_AGE_DAYS = 3;

export type AudienceStats = {
  /** Visitors over the trailing window, or null when there is nothing to show. */
  visitors: number | null;
  /** Days the visitor data actually covers, capped at WINDOW_DAYS. */
  days: number | null;
  /** Google search impressions over 30 days, or null when missing or stale. */
  impressions30d: number | null;
};

const EMPTY: AudienceStats = { visitors: null, days: null, impressions30d: null };

/** First day inside the window, as YYYY-MM-DD in UTC (Postgres CURRENT_DATE is UTC). */
export function windowStart(now = new Date(), days = WINDOW_DAYS): string {
  return new Date(now.getTime() - (days - 1) * 86_400_000).toISOString().slice(0, 10);
}

/**
 * How many days the data actually covers, capped at the window.
 *
 * Counted from the first day we hold, not the first day someone visited: a
 * quiet day is still a day the counter was running, and dropping it would
 * overstate the rate. Without this, "/ 30 days" would promise a longer window
 * than the data behind it.
 */
export function daysCovered(
  rows: Array<{ day: string | null }>,
  now = new Date(),
  windowDays = WINDOW_DAYS
): number | null {
  const days = rows
    .map((r) => r.day)
    .filter((d): d is string => Boolean(d))
    .sort();
  if (!days.length) return null;

  const first = Date.parse(`${days[0]}T00:00:00Z`);
  if (Number.isNaN(first)) return null;

  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const elapsed = Math.floor((today - first) / 86_400_000) + 1;
  return Math.max(1, Math.min(windowDays, elapsed));
}

/** Is a captured figure fresh enough to publish? */
export function isFresh(
  capturedAt: string | null,
  now = Date.now(),
  maxAgeDays = IMPRESSIONS_MAX_AGE_DAYS
): boolean {
  if (!capturedAt) return false;
  const t = Date.parse(capturedAt);
  if (!Number.isFinite(t)) return false;
  const ageDays = (now - t) / 86_400_000;
  return ageDays >= 0 && ageDays <= maxAgeDays;
}

/**
 * Trailing-window visitors plus the cached impressions figure.
 *
 * Zero visitors is treated as absent, not as a figure. A real 1 prints as 1,
 * but an empty window and "nobody came" are indistinguishable from here, and on
 * a live site the empty window is always the true reading (a failed read or a
 * new table). Printing "0 visitors" beside an invitation to bid would be false.
 */
export async function getAudienceStats(now = new Date()): Promise<AudienceStats> {
  try {
    const supabase = createReadClient();
    const [visitRes, searchRes] = await Promise.all([
      supabase
        .from("site_visit_days")
        .select("day, visitors")
        .gte("day", windowStart(now))
        .limit(WINDOW_DAYS + 1),
      supabase
        .from("site_search_stats")
        .select("impressions_30d, impressions_captured_at")
        .eq("id", "site")
        .maybeSingle<{
          impressions_30d: number | null;
          impressions_captured_at: string | null;
        }>(),
    ]);

    const rows = (visitRes.data ?? []) as Array<{ day: string; visitors: number }>;
    const total = rows.reduce((sum, r) => sum + (Number(r.visitors) || 0), 0);

    const search = searchRes.data;
    const impressions =
      typeof search?.impressions_30d === "number" &&
      isFresh(search.impressions_captured_at, now.getTime())
        ? search.impressions_30d
        : null;

    return {
      visitors: total > 0 ? total : null,
      days: total > 0 ? daysCovered(rows, now) : null,
      impressions30d: impressions,
    };
  } catch (error) {
    console.error(
      "audience stats read failed:",
      error instanceof Error ? error.message : error
    );
    return EMPTY;
  }
}

/**
 * Server-render seed, on the same five-minute window as sponsor slots so it
 * never shortens a page's revalidate period. The browser corrects the visitor
 * figure from /api/visit within a moment of loading.
 */
export const getCachedAudienceStats = unstable_cache(
  () => getAudienceStats(),
  ["audience-stats"],
  { revalidate: 300, tags: ["audience-stats"] }
);

/** Compact impressions ("5.6K"). They run several times the visitor count. */
export function formatCompact(n: number): string {
  if (n < 1000) return n.toLocaleString("en-US");
  if (n < 1_000_000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}K`;
  return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
}
