import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  output: "standalone",
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

    // Force explicit path alias resolution to bypass Next 16 + TS 7 automatic mapping drops
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(process.cwd(), 'src'),
    };

    return config;
  },
};

export default nextConfig;