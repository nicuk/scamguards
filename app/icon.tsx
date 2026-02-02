import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 6,
        }}
      >
        <svg width="24" height="24" viewBox="0 0 100 100">
          <path
            d="M50 10 L85 22 L85 45 C85 68 67 85 50 90 C33 85 15 68 15 45 L15 22 Z"
            fill="white"
            fillOpacity="0.9"
          />
          <path
            d="M35 50 L45 60 L65 40"
            fill="none"
            stroke="#1d4ed8"
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
