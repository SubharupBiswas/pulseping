import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  output: "standalone",
  serverExternalPackages: [
    "@prisma/client",
    ".prisma/client",
    "@prisma/adapter-neon",
    "@neondatabase/serverless",
    "ws",
  ],

  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "@clerk/nextjs",
      "recharts",
      "framer-motion",
    ],
  },

  // Trim down deployment package size by omitting heavy source maps
  outputFileTracingExcludes: {
    "*": ["./**/*.js.map", "./**/*.mjs.map", "./**/*.cjs.map"],
  },

  // Silence Next.js 16 Turbopack warning when custom webpack config is present
  turbopack: {},

  // Webpack configurations with explicit path alias resolution
  webpack: (config, { dev, isServer }) => {
    if (!dev && isServer) {
      config.optimization = {
        ...config.optimization,
        usedExports: true,
        sideEffects: true,
      };
    }

    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(process.cwd(), 'src'),
    };

    return config;
  },
};

export default nextConfig;