import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { BASE_BID, getMinimumBid, getSponsors } from "@/lib/sponsors";
import { buildSponsorEnquiryMessage, notifySlack } from "@/lib/notify-slack";
import { checkRateLimit, getClientIp, hashIdentifier } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

/** Per IP, per hour. */
const IP_LIMIT = 3;
/** Per email address, per day — an IP rotation alone should not buy more. */
const EMAIL_LIMIT = 3;
const HOUR = 3600;
const DAY = 86400;

function tooManyRequests(retryAfterSeconds: number) {
  return NextResponse.json(
    {
      error:
        "Too many enquiries from here. Please try again later, or email us directly.",
    },
    {
      status: 429,
      headers: { "Retry-After": String(retryAfterSeconds) },
    }
  );
}

interface EnquiryInput {
  name?: string;
  email?: string;
  website?: string;
  bidAmount?: number | string;
  message?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as EnquiryInput;
    const name = (body.name || "").trim().slice(0, 120);
    const email = (body.email || "").trim().slice(0, 200);
    const website = (body.website || "").trim().slice(0, 300);
    const message = (body.message || "").trim().slice(0, 2000);
    const bidAmount = Number(body.bidAmount);

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    // Rate limit only after the payload is known to be well-formed, so a
    // typo in an email does not burn someone's quota.
    const ipHash = hashIdentifier(getClientIp(request));
    const ipCheck = await checkRateLimit(
      ipHash,
      "ip_hash",
      "sponsor_enquiry",
      IP_LIMIT,
      HOUR
    );

    if (!ipCheck.allowed) {
      return tooManyRequests(ipCheck.retryAfter ?? HOUR);
    }

    const emailCheck = await checkRateLimit(
      hashIdentifier(email),
      "email_hash",
      "sponsor_enquiry_email",
      EMAIL_LIMIT,
      DAY
    );

    if (!emailCheck.allowed) {
      return tooManyRequests(emailCheck.retryAfter ?? DAY);
    }

    // The floor is derived from live bids rather than trusted from the client,
    // so it stays correct as slots change hands.
    const sponsors = await getSponsors();
    const minBid = getMinimumBid(sponsors);
    const topBid = sponsors.length
      ? Math.max(...sponsors.map((s) => s.bidAmount))
      : BASE_BID;

    if (!Number.isFinite(bidAmount) || bidAmount < minBid) {
      return NextResponse.json(
        { error: `Bid must be at least $${minBid}` },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const { error } = await supabase.from("sponsor_enquiries").insert({
      name,
      email,
      website: website || null,
      bid_amount: bidAmount,
      message: message || null,
      status: "pending",
    });

    if (error) {
      console.error("Sponsor enquiry insert error:", error);
      return NextResponse.json(
        { error: "Could not save your enquiry. Please try again." },
        { status: 500 }
      );
    }

    // Best-effort Slack ping. The enquiry is already saved, so a webhook
    // failure must not turn into an error for the person who submitted it.
    const slackMessage = buildSponsorEnquiryMessage({
      name,
      email,
      website: website || null,
      bidAmount,
      message: message || null,
      topBid,
    });

    await notifySlack(slackMessage.text, slackMessage.blocks);

    return NextResponse.json({
      success: true,
      message: "Enquiry received. We'll be in touch shortly.",
    });
  } catch (error) {
    console.error("Sponsor enquiry API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
