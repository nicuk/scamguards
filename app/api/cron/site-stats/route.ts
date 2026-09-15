import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import {
  fetchImpressions30d,
  saveImpressions30d,
} from "@/lib/search-impressions";

// Daily refresh of the search-impressions figure on the sponsor board
// (scheduled in vercel.json). Visitors need no cron: they are counted
// first-party as they happen.
//
// On failure it writes NOTHING. Yesterday's figure carries a captured_at and
// is hidden once it is more than three days old, so a broken cron degrades to
// showing no number rather than a wrong or zeroed one.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const impressions = await fetchImpressions30d();
  if (impressions === null) {
    return NextResponse.json({
      ok: true,
      updated: false,
      reason: "unconfigured-or-failed",
    });
  }

  const written = await saveImpressions30d(impressions);
  if (!written) {
    return NextResponse.json({ ok: true, updated: false, impressions, written: false });
  }

  revalidateTag("audience-stats");
  return NextResponse.json({ ok: true, updated: true, impressions });
}
