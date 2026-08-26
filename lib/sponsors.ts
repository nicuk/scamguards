import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Cookie-free read client. Sponsor slots are public data, so this deliberately
 * avoids `cookies()` — reading cookies would opt the whole home page out of
 * static rendering.
 */
function createReadClient() {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_STORAGE_SUPABASE_URL ||
    process.env.STORAGE_SUPABASE_URL!;

  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_STORAGE_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_STORAGE_SUPABASE_PUBLISHABLE_KEY ||
    process.env.STORAGE_SUPABASE_PUBLISHABLE_KEY!;

  return createSupabaseClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export type Sponsor = {
  slug: string;
  name: string;
  domain: string;
  url: string;
  tagline: string;
  description: string;
  logoPath: string;
  bidAmount: number;
  clickCount: number;
  /** Hex accent sampled from the sponsor's own logo. */
  accentColor: string;
};

/**
 * Campaign tagging for outbound sponsor links, so each sponsor's analytics
 * attributes the visit to ScamGuards rather than lumping it into direct or
 * unknown referral traffic.
 */
export const UTM_PARAMS = {
  utm_source: "scamguards.app",
  utm_medium: "referral",
  utm_campaign: "outbid-wave",
} as const;

/**
 * Appends the campaign params to a destination URL, preserving any path and
 * existing query string the sponsor already specified. Returns the input
 * untouched if it is not a parseable absolute URL.
 */
export function withUtm(rawUrl: string): string {
  try {
    const url = new URL(rawUrl);
    for (const [key, value] of Object.entries(UTM_PARAMS)) {
      url.searchParams.set(key, value);
    }
    return url.toString();
  } catch {
    return rawUrl;
  }
}

/** Base price of a slot when one is sitting empty. */
export const BASE_BID = 20;

/** Number of slots shown on the landing page. */
export const SLOT_COUNT = 3;

/**
 * Cheapest bid that actually wins a slot right now.
 *
 * With a free slot that is just the base price. Once every slot is taken the
 * only way in is to outbid whoever is currently cheapest, so the entry price
 * becomes the lowest live bid plus one.
 */
export function getMinimumBid(sponsors: Sponsor[]): number {
  if (sponsors.length < SLOT_COUNT) return BASE_BID;

  const lowestBid = Math.min(...sponsors.map((s) => s.bidAmount));
  return Math.max(BASE_BID, Math.floor(lowestBid) + 1);
}

/**
 * Used when the sponsors table has not been migrated yet or the database is
 * unreachable, so the landing page never renders an empty sponsor strip.
 * Mirrors the seed rows in supabase/migrations/005_sponsors.sql.
 */
export const FALLBACK_SPONSORS: Sponsor[] = [
  {
    slug: "aeorival",
    name: "AEORival",
    domain: "aeorival.com",
    url: "https://aeorival.com",
    tagline: "AI Visibility",
    description:
      "See how ChatGPT and Perplexity answer questions about your brand.",
    logoPath: "/sponsors/aeorival.png",
    bidAmount: 22,
    clickCount: 0,
    accentColor: "#6d20f0",
  },
  {
    slug: "tcgintel",
    name: "TCGIntel",
    domain: "tcgintel.app",
    url: "https://tcgintel.app",
    tagline: "Card Prices",
    description:
      "Check what a trading card is really worth before you pay a seller.",
    logoPath: "/sponsors/tcgintel.png",
    bidAmount: 21,
    clickCount: 0,
    accentColor: "#c9a227",
  },
  {
    slug: "systemaudit",
    name: "SystemAudit",
    domain: "systemaudit.dev",
    url: "https://systemaudit.dev",
    tagline: "Site Audits",
    description:
      "Automated site and codebase audits — speed, security, SEO, accessibility.",
    logoPath: "/sponsors/systemaudit.png",
    bidAmount: 20,
    clickCount: 0,
    accentColor: "#c026a5",
  },
];

type SponsorRow = {
  slug: string;
  name: string;
  domain: string;
  url: string;
  tagline: string;
  description: string;
  logo_path: string;
  bid_amount: number | string;
  click_count: number;
  accent_color: string | null;
};

/**
 * Active sponsors ranked by bid, highest first. Falls back to the seeded list
 * if the table is missing or the query fails.
 */
export async function getSponsors(): Promise<Sponsor[]> {
  try {
    const supabase = createReadClient();
    const { data, error } = await supabase
      .from("sponsors")
      .select(
        "slug, name, domain, url, tagline, description, logo_path, bid_amount, click_count, accent_color"
      )
      .eq("is_active", true)
      .order("bid_amount", { ascending: false })
      .order("created_at", { ascending: true })
      .limit(SLOT_COUNT);

    if (error || !data || data.length === 0) {
      return withCampaignTags(FALLBACK_SPONSORS);
    }

    return withCampaignTags(
      (data as SponsorRow[]).map((row) => ({
      slug: row.slug,
      name: row.name,
      domain: row.domain,
      url: row.url,
      tagline: row.tagline,
      description: row.description,
      logoPath: row.logo_path,
      bidAmount: Number(row.bid_amount) || 0,
      clickCount: row.click_count ?? 0,
        accentColor: row.accent_color || "#2662d9",
      }))
    );
  } catch {
    return withCampaignTags(FALLBACK_SPONSORS);
  }
}

/** Every outbound link leaves the site campaign-tagged, from either source. */
function withCampaignTags(sponsors: Sponsor[]): Sponsor[] {
  return sponsors.map((sponsor) => ({
    ...sponsor,
    url: withUtm(sponsor.url),
  }));
}
