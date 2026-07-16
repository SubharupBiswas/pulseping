import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";

const config = defineCloudflareConfig({
  incrementalCache: r2IncrementalCache,
} as any);

config.default = {
  ...config.default,
  minify: true,
};

config.functions = {
  dashboard: {
    runtime: "edge",
    minify: true,
    routes: ["dashboard", "dashboard/billing"] as any,
    patterns: ["dashboard*"],
  },
};

export default config;
