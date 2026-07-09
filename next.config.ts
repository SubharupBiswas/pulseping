import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Correct external packaging alignment for target edge isolation
  serverExternalPackages: ["@prisma/client", ".prisma/client"],

  outputFileTracingExcludes: {
    "*": ["./**/*.js.map", "./**/*.mjs.map", "./**/*.cjs.map"],
  },
  turbopack: {},
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