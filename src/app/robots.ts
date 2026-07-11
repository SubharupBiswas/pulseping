import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/pricing", "/status", "/privacy", "/terms"],
        disallow: [
          "/dashboard",
          "/dashboard/",
          "/sign-in",
          "/sign-up",
          "/api/",
        ],
      },
    ],
    sitemap: "https://pulseping.subnetmask.tech/sitemap.xml",
  };
}
