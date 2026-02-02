import { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://scamguards.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/", "/results/"], // Don't index API routes, admin, or result pages
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
