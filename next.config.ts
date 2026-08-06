import type { NextConfig } from "next";
import path from "path";

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

  // Silence the Turbopack+webpack co-existence warning.
  // The webpack config below only adds the @/ path alias — harmless.
  turbopack: {},

  // Webpack path alias resolution for @/... imports (also used by type-checker)
  webpack: (config, { dev, isServer }) => {
    if (isServer) {
      config.devtool = false;
    }
    if (!dev && isServer) {
      config.optimization = {
        ...config.optimization,
        usedExports: true,
        sideEffects: true,
      };
    }
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(process.cwd(), "src"),
    };
    return config;
  },
};

export default nextConfig;