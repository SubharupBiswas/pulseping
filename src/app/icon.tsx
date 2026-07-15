import { ImageResponse } from "next/og";

// Image metadata
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
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "transparent",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
          width="100%"
          height="100%"
          style={{ display: "block" }}
        >
          <defs>
            <linearGradient id="pulseping-premium-flux" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0d9488" />
              <stop offset="50%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#22d3ee" />
            </linearGradient>
          </defs>
          <polygon
            points="50,8 88,30 88,74 50,96 12,74 12,30"
            stroke="url(#pulseping-premium-flux)"
            strokeWidth="2"
            strokeDasharray="4,6"
            opacity="0.25"
            fill="none"
          />
          <circle
            cx="50"
            cy="52"
            r="32"
            stroke="url(#pulseping-premium-flux)"
            strokeWidth="1"
            opacity="0.15"
            fill="none"
          />
          <path
            d="M 18,54 L 34,54 L 40,42 L 46,78 L 54,18 L 62,48 L 68,40 L 82,40"
            stroke="url(#pulseping-premium-flux)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <circle cx="54" cy="18" r="5" fill="#22d3ee" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
