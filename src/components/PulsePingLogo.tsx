import React from "react";

interface LogoProps {
  className?: string;
  size?: string; // Supports standard Tailwind configuration arrays seamlessly
}

export const PulsePingLogo: React.FC<LogoProps> = ({ className = "", size = "w-6 h-6" }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      fill="none"
      className={`${size} ${className}`}
    >
      <defs>
        <linearGradient id="pulseping-jsx-flux" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0d9488" />
          <stop offset="50%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#22d3ee" />
        </linearGradient>

        <filter id="jsx-ping-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Hexagonal Grid Outline */}
      <polygon
        points="50,8 88,30 88,74 50,96 12,74 12,30"
        stroke="url(#pulseping-jsx-flux)"
        strokeWidth={1.5}
        strokeDasharray="4 6"
        opacity={0.25}
      />

      {/* Telemetry Guide Circle */}
      <circle cx="50" cy="52" r="32" stroke="url(#pulseping-jsx-flux)" strokeWidth={1} opacity={0.15} />

      {/* The Master Uptime Signal Path */}
      <path
        d="M 18,54 L 34,54 L 40,42 L 46,78 L 54,18 L 62,48 L 68,40 L 82,40"
        stroke="url(#pulseping-jsx-flux)"
        strokeWidth={5.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Glowing Target Emitter Node */}
      <circle cx="54" cy="18" r="4.5" fill="#22d3ee" filter="url(#jsx-ping-glow)" />
    </svg>
  );
};

export default PulsePingLogo;