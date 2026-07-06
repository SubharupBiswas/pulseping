import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/sign-in", "/sign-up", "/status", "/privacy", "/terms"],
      disallow: ["/dashboard", "/api/"],
    },
    sitemap: "https://pulseping.subnetmask.tech/sitemap.xml",
  };
}
