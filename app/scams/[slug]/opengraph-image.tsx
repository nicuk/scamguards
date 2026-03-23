import { ImageResponse } from "next/og";
import { getScamBySlug, getAllScamSlugs } from "@/lib/scam-data";

export const runtime = "edge";
export const alt = "ScamGuards - Scam Type Guide";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return getAllScamSlugs().map((slug) => ({ slug }));
}

export default async function OGImage({ params }: { params: { slug: string } }) {
  const scam = getScamBySlug(params.slug);
  const title = scam?.title || "Scam Guide";
  const emoji = scam?.heroEmoji || "🛡️";

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
        }}
      >
        <div style={{ fontSize: 96, marginBottom: 20, display: "flex" }}>{emoji}</div>
        <div
          style={{
            fontSize: 48,
            fontWeight: 800,
            color: "white",
            textAlign: "center",
            maxWidth: 900,
            display: "flex",
          }}
        >
          {title} in Malaysia
        </div>
        <div
          style={{
            fontSize: 28,
            color: "#94a3b8",
            marginTop: 20,
            textAlign: "center",
            display: "flex",
          }}
        >
          How to Spot, Report & Protect Yourself
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 40,
            display: "flex",
            alignItems: "center",
            gap: 12,
            color: "#64748b",
            fontSize: 24,
          }}
        >
          <span>🛡️</span>
          <span>ScamGuards Malaysia</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
