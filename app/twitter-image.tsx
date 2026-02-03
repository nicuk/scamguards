import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "ScamGuards Malaysia - Community Scam Detection";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function TwitterImage() {
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
            "radial-gradient(circle at 25px 25px, #1e293b 2%, transparent 0%), radial-gradient(circle at 75px 75px, #1e293b 2%, transparent 0%)",
          backgroundSize: "100px 100px",
        }}
      >
        {/* Shield Icon */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 40,
          }}
        >
          <svg
            width="120"
            height="120"
            viewBox="0 0 100 100"
            style={{ marginRight: 20 }}
          >
            <path
              d="M50 5 L90 20 L90 45 C90 70 70 90 50 95 C30 90 10 70 10 45 L10 20 Z"
              fill="#3b82f6"
              stroke="#60a5fa"
              strokeWidth="2"
            />
            <path
              d="M30 50 L45 65 L70 35"
              fill="none"
              stroke="white"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Title */}
        <div
          style={{
            display: "flex",
            fontSize: 64,
            fontWeight: 800,
            color: "white",
            marginBottom: 20,
            textAlign: "center",
          }}
        >
          ScamGuards Malaysia
        </div>

        {/* Subtitle */}
        <div
          style={{
            display: "flex",
            fontSize: 32,
            color: "#94a3b8",
            textAlign: "center",
            maxWidth: 800,
          }}
        >
          Check Scammers • Report Fraud • Protect Community
        </div>

        {/* Footer */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            display: "flex",
            alignItems: "center",
            color: "#64748b",
            fontSize: 24,
          }}
        >
          Free • Community-Driven • AI-Powered
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
