import { BLOG_POSTS } from "@/lib/blog-data";
import { SCAM_TYPES } from "@/lib/scam-data";
import { SITE_URL } from "@/lib/seo-config";

export async function GET() {
  const blogItems = BLOG_POSTS.map(
    (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${SITE_URL}/blog/${post.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/blog/${post.slug}</guid>
      <description><![CDATA[${post.metaDescription}]]></description>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
      <category>Blog</category>
    </item>`
  );

  const scamItems = SCAM_TYPES.map(
    (scam) => `
    <item>
      <title><![CDATA[${scam.title} in Malaysia - How to Spot & Report]]></title>
      <link>${SITE_URL}/scams/${scam.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/scams/${scam.slug}</guid>
      <description><![CDATA[${scam.metaDescription}]]></description>
      <category>Scam Guide</category>
    </item>`
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>ScamGuards Malaysia</title>
    <link>${SITE_URL}</link>
    <description>AI-powered scam detection and prevention guides for Malaysia. Check scammers, report fraud, protect the community.</description>
    <language>en-MY</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    ${blogItems.join("")}
    ${scamItems.join("")}
  </channel>
</rss>`;

  return new Response(xml.trim(), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
