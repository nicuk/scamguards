import { BLOG_POSTS, type BlogPost } from "@/lib/blog-data";
import { SCAM_TYPES, type ScamType } from "@/lib/scam-data";

// Google had crawled most blog posts and scam guides without indexing them
// (Search Console, Sep 2026). These links give each page more internal paths
// from pages Google already indexes.

const SCAM_TO_BLOGS: Record<string, string[]> = {
  "macau-scam": [
    "semak-nombor-telefon-scammer-malaysia",
    "how-to-report-scammer-malaysia",
    "how-to-get-money-back-scammed-malaysia",
    "scam-victim-help-malaysia",
  ],
  "tcg-collectibles-scam": [
    "how-to-spot-tcg-scam-malaysia",
    "whatsapp-scammer-malaysia-how-to-check",
  ],
  "love-scam": [
    "love-scam-malaysia",
    "how-to-get-money-back-scammed-malaysia",
    "scam-victim-help-malaysia",
    "bantuan-mangsa-scam-malaysia",
  ],
  "investment-scam": [
    "malaysia-scam-statistics-2025",
    "how-to-get-money-back-scammed-malaysia",
    "cara-lapor-penipu-malaysia",
    "scam-victim-help-malaysia",
    "bantuan-mangsa-scam-malaysia",
  ],
  "ecommerce-scam": [
    "shopee-carousell-scams-malaysia",
    "scam-shopee-carousell-malaysia-bm",
    "kena-tipu-online-apa-nak-buat",
    "expose-scammer-malaysia",
    "cara-dedah-scammer-malaysia",
  ],
  "gold-silver-scam": [
    "whatsapp-scammer-malaysia-how-to-check",
    "how-to-report-scammer-malaysia",
  ],
};

// BlogPost carries no language field, so Bahasa Melayu posts are listed here.
// Add every new BM post, or the homepage files it under "English guides".
export const BM_BLOG_SLUGS = new Set([
  "cara-lapor-penipu-malaysia",
  "kena-tipu-online-apa-nak-buat",
  "scam-shopee-carousell-malaysia-bm",
  "semak-nombor-telefon-scammer-malaysia",
  "love-scam-malaysia",
  "cara-dedah-scammer-malaysia",
  "bantuan-mangsa-scam-malaysia",
]);

// Every slug above must exist. The lookups below skip unknown slugs, so a
// renamed post would otherwise drop these links with no error at all. Blog and
// scam guides are statically generated, so this fails `next build` rather than
// a page, and the data is static so it can never throw only in production.
const unknownSlugs = [
  ...Object.keys(SCAM_TO_BLOGS)
    .filter((slug) => !SCAM_TYPES.some((s) => s.slug === slug))
    .map((slug) => `scam "${slug}"`),
  ...Array.from(new Set(Object.values(SCAM_TO_BLOGS).flat()))
    .filter((slug) => !BLOG_POSTS.some((p) => p.slug === slug))
    .map((slug) => `blog "${slug}"`),
  ...Array.from(BM_BLOG_SLUGS)
    .filter((slug) => !BLOG_POSTS.some((p) => p.slug === slug))
    .map((slug) => `Bahasa Melayu blog "${slug}"`),
];

if (unknownSlugs.length > 0) {
  throw new Error(
    `lib/internal-links.ts references slugs that do not exist: ${unknownSlugs.join(", ")}`
  );
}

export function getBlogsForScam(scamSlug: string): BlogPost[] {
  const slugs = SCAM_TO_BLOGS[scamSlug] ?? [];
  return slugs
    .map((slug) => BLOG_POSTS.find((p) => p.slug === slug))
    .filter((p): p is BlogPost => Boolean(p));
}

export function getScamsForBlog(blogSlug: string): ScamType[] {
  return SCAM_TYPES.filter((s) => SCAM_TO_BLOGS[s.slug]?.includes(blogSlug));
}
