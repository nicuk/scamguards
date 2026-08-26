import { NextResponse } from "next/server";
import { BASE_BID, getMinimumBid, getSponsors } from "@/lib/sponsors";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * Live bid state. The home page itself is ISR-cached, so the enquiry form
 * reads the floor from here on open — otherwise a visitor could be shown a
 * stale minimum and have their bid rejected on submit.
 */
export async function GET() {
  const sponsors = await getSponsors();
  const minBid = getMinimumBid(sponsors);
  const topBid = sponsors.length
    ? Math.max(...sponsors.map((s) => s.bidAmount))
    : BASE_BID;

  const response = NextResponse.json({
    minBid,
    topBid,
    slotsTaken: sponsors.length,
    sponsors: sponsors.map((s) => ({
      slug: s.slug,
      name: s.name,
      bidAmount: s.bidAmount,
      clickCount: s.clickCount,
    })),
  });

  response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
  return response;
}
