import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard/",
          "/dashboard",
          "/sign-in",
          "/sign-up",
          "/api/",
        ],
      },
    ],
    sitemap: "https://pulseping.subharup.com/sitemap.xml",
  };
}
