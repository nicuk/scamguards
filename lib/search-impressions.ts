import { daysAgo, lastGscError, querySearchAnalytics } from "@/lib/gsc";
import { createAdminClient } from "@/lib/supabase/server";

// The Search Console half of the audience figures. Kept apart from
// lib/site-stats.ts because lib/gsc.ts imports node:crypto; anything that
// might reach a client bundle must not import this file.

/**
 * Trailing-30-day Google search impressions, summed across days.
 *
 * Returns null — never zero — when unconfigured or failing, because "we could
 * not read it" and "nobody saw us" are different claims and only one of them
 * should ever be printed. The window is explicitly 30 days: Search Console's
 * own UI defaults to three months, so a figure eyeballed there would be roughly
 * triple what a "/ 30 days" label promises.
 */
export async function fetchImpressions30d(): Promise<number | null> {
  const rows = await querySearchAnalytics({
    startDate: daysAgo(30),
    endDate: daysAgo(0),
    dimensions: ["date"],
    rowLimit: 100,
  });

  if (!rows.length) {
    // Name the cause: "no rows" covers not configured, key rejected, service
    // account missing from the property, and genuinely no traffic.
    console.error(
      `[site-stats] impressions unavailable — ${lastGscError() ?? "no reason recorded"}`
    );
    return null;
  }

  const total = rows.reduce((sum, r) => sum + (Number(r.impressions) || 0), 0);
  return Math.round(total);
}

/**
 * Persist the figure. An update on the seeded singleton row, returning the row
 * so "matched nothing" is distinguishable from "wrote it".
 */
export async function saveImpressions30d(impressions: number): Promise<boolean> {
  try {
    const { data, error } = await createAdminClient()
      .from("site_search_stats")
      .update({
        impressions_30d: impressions,
        impressions_captured_at: new Date().toISOString(),
      })
      .eq("id", "site")
      .select("id");

    if (error) {
      console.error("[site-stats] impressions write rejected:", error.message);
      return false;
    }
    if (!data?.length) {
      console.error('[site-stats] no site_search_stats row with id "site" — run migration 009');
      return false;
    }
    return true;
  } catch (error) {
    console.error("[site-stats] impressions write failed:", error);
    return false;
  }
}
