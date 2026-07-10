import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Externalize Prisma client bundles to prevent Turbopack/Webpack compilation conflicts
  serverExternalPackages: ["@prisma/client", ".prisma/client"],

  // Trim down deployment package size by omitting heavy source maps
  outputFileTracingExcludes: {
    "*": ["./**/*.js.map", "./**/*.mjs.map", "./**/*.cjs.map"],
  },

  // Silence Next.js 16 Turbopack warning when custom webpack config is present
  turbopack: {},

  // Optimized Webpack pipeline configurations tailored for Cloudflare's global edge runtime
  webpack: (config, { dev, isServer }) => {
    if (!dev && isServer) {
      config.optimization = {
        ...config.optimization,
        usedExports: true,
        sideEffects: true,
      };
    }
    return config;
  },
};

export default nextConfig;