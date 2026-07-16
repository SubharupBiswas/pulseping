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
    routes: ["app/dashboard/page"],
    patterns: ["dashboard*"],
  },
  dashboardBilling: {
    runtime: "edge",
    minify: true,
    routes: ["app/dashboard/billing/page"],
    patterns: ["dashboard/billing*"],
  },
  auth: {
    runtime: "edge",
    minify: true,
    routes: ["app/sign-in/[[...sign-in]]/page", "app/sign-up/[[...sign-up]]/page"],
    patterns: ["sign-in*", "sign-up*"],
  },
  apiRoutes: {
    runtime: "edge",
    minify: true,
    routes: [
      "app/api/create-order/route",
      "app/api/razorpay/order/route",
      "app/api/verify-payment/route",
      "app/api/webhooks/razorpay/route"
    ],
    patterns: ["api*"],
  },
};

export default config;
