import { ImageResponse } from "next/og";
import { getBlogBySlug, getAllBlogSlugs } from "@/lib/blog-data";

export const runtime = "edge";
export const alt = "ScamGuards - Blog Article";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

export default async function OGImage({ params }: { params: { slug: string } }) {
  const post = getBlogBySlug(params.slug);
  const title = post?.title || "ScamGuards Blog";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0f172a",
          backgroundImage:
            "radial-gradient(circle at 25px 25px, #1e293b 2%, transparent 0%)",
          backgroundSize: "100px 100px",
          padding: 60,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 40,
            color: "#3b82f6",
            fontSize: 24,
            fontWeight: 600,
          }}
        >
          <span>🛡️</span>
          <span>ScamGuards Blog</span>
        </div>
        <div
          style={{
            fontSize: 44,
            fontWeight: 800,
            color: "white",
            textAlign: "center",
            maxWidth: 1000,
            lineHeight: 1.3,
            display: "flex",
          }}
        >
          {title}
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 40,
            display: "flex",
            color: "#64748b",
            fontSize: 22,
          }}
        >
          scamguards.app/blog
        </div>
      </div>
    ),
    { ...size }
  );
}
