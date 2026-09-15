import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { getAudienceStats } from "@/lib/site-stats";

export const dynamic = "force-dynamic";

// The one write behind "N visitors / D days". Deduped server-side on an
// httpOnly cookie: at most one increment per browser per 24h, so the figure is
// distinct browsers per day summed over the window, never pageviews.

const COOKIE = "sg_seen";
const DAY = 60 * 60 * 24;

// Rendering crawlers execute JS and would otherwise count themselves
const BOT_UA =
  /bot|crawl|spider|slurp|facebookexternalhit|preview|headless|lighthouse|pagespeed|vercel-screenshot/i;

async function currentWindow() {
  const stats = await getAudienceStats();
  return { visitors: stats.visitors, days: stats.days };
}

function noStore(body: unknown) {
  return NextResponse.json(body, {
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST() {
  const jar = cookies();
  const userAgent = headers().get("user-agent") || "";

  if (jar.get(COOKIE) || BOT_UA.test(userAgent)) {
    return noStore({ ...(await currentWindow()), counted: false });
  }

  try {
    const { error } = await createAdminClient().rpc("record_visit");
    if (error) throw new Error(error.message);

    jar.set(COOKIE, "1", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: DAY,
    });

    // Re-read rather than trusting the rpc's total alone: the label needs the
    // covered-days figure as well, from the same read the page renders from.
    return noStore({ ...(await currentWindow()), counted: true });
  } catch (error) {
    console.error(
      "record_visit failed:",
      error instanceof Error ? error.message : error
    );
    // Decorative surface: fail quiet and let the page keep its server value
    return noStore({ visitors: null, days: null, counted: false });
  }
}
