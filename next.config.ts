import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,
  productionBrowserSourceMaps: false,

  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "@clerk/nextjs",
      "recharts",
      "framer-motion",
    ],
  },

  turbopack: {},
};

export default nextConfig;