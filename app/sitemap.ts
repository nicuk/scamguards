import { MetadataRoute } from "next";
import { getAllScamSlugs } from "@/lib/scam-data";
import { getAllBlogSlugs } from "@/lib/blog-data";
import { SITE_URL } from "@/lib/seo-config";
import { createClient } from "@/lib/supabase/server";
import {
  buildCheckPath,
  isValidCanonicalIdentifier,
  type CheckType,
} from "@/lib/utils/check-url";

export const revalidate = 3600;

const CHECK_PAGE_LIMIT = 5000;

async function getReportedIdentifierPages(now: Date): Promise<MetadataRoute.Sitemap> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("data_points")
      .select("type, normalized_value, reports(status)")
      .in("type", ["phone", "email", "bank_account"])
      .limit(CHECK_PAGE_LIMIT);

    if (error || !data) return [];

    const seen = new Set<string>();
    const pages: MetadataRoute.Sitemap = [];
    type Row = {
      type: string;
      normalized_value: string;
      reports: { status: string } | { status: string }[] | null;
    };
    for (const row of data as Row[]) {
      const reportsList = Array.isArray(row.reports)
        ? row.reports
        : row.reports
        ? [row.reports]
        : [];
      const hasActive = reportsList.some((r) => r.status === "active");
      if (!hasActive) continue;
      const checkType: CheckType | null =
        row.type === "phone"
          ? "phone"
          : row.type === "email"
          ? "email"
          : row.type === "bank_account"
          ? "account"
          : null;
      if (!checkType) continue;
      if (!isValidCanonicalIdentifier(checkType, row.normalized_value)) continue;
      const key = `${checkType}:${row.normalized_value}`;
      if (seen.has(key)) continue;
      seen.add(key);
      pages.push({
        url: `${SITE_URL}${buildCheckPath(checkType, row.normalized_value)}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.6,
      });
    }
    return pages;
  } catch (err) {
    console.error("Sitemap check pages error:", err);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/search`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/submit`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/how-it-works`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/scams`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/donate`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/disclaimer`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/dispute`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  const scamPages: MetadataRoute.Sitemap = getAllScamSlugs().map((slug) => ({
    url: `${SITE_URL}/scams/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const blogPages: MetadataRoute.Sitemap = getAllBlogSlugs().map((slug) => ({
    url: `${SITE_URL}/blog/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const checkPages = await getReportedIdentifierPages(now);

  return [...staticPages, ...scamPages, ...blogPages, ...checkPages];
}
