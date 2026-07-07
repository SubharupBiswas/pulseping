import React from "react";
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "PulsePing | Developer-First Uptime Monitoring",
    template: "%s | PulsePing",
  },
  description: "PulsePing is a developer-first uptime monitoring platform. Track API endpoints, configure Discord webhooks, and analyze response latency with Neon & Prisma.",
  keywords: [
    "uptime monitoring", 
    "developer tools", 
    "SaaS monitoring", 
    "endpoint tracker", 
    "Discord alerts", 
    "SLA logging", 
    "API monitoring", 
    "server health check"
  ],
  authors: [{ name: "PulsePing Team" }],
  metadataBase: new URL("https://pulseping.subnetmask.tech"),
  alternates: {
    canonical: "https://pulseping.subnetmask.tech",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  verification: {
    google: "YOUR_GOOGLE_VERIFICATION_TOKEN_HERE",
  },
  openGraph: {
    title: "PulsePing | Developer-First Uptime Monitoring",
    description: "PulsePing is a developer-first uptime monitoring platform. Track API endpoints, configure Discord webhooks, and analyze response latency with Neon & Prisma.",
    url: "https://pulseping.subnetmask.tech",
    siteName: "PulsePing",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PulsePing Uptime Monitoring Platform Console Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PulsePing | Developer-First Uptime Monitoring",
    description: "PulsePing is a developer-first uptime monitoring platform. Track API endpoints, configure Discord webhooks, and analyze response latency with Neon & Prisma.",
    images: ["/og-image.png"],
    creator: "@pulseping",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="h-full antialiased" suppressHydrationWarning style={{ colorScheme: "dark light" }}>
        <head>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  try {
                    const savedTheme = localStorage.getItem('theme');
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
                      document.documentElement.classList.add('dark');
                    } else {
                      document.documentElement.classList.remove('dark');
                    }
                  } catch {}
                })();
              `,
            }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebApplication",
                "name": "PulsePing",
                "url": "https://pulseping.subnetmask.tech",
                "description": "Developer-first uptime monitoring platform with Discord alerts and Neon database logs.",
                "applicationCategory": "DeveloperApplication",
                "operatingSystem": "All",
                "offers": {
                  "@type": "Offer",
                  "price": "499.00",
                  "priceCurrency": "INR",
                  "category": "Pro Tier Subscription"
                }
              })
            }}
          />
        </head>
        <body className="min-h-full flex flex-col overflow-x-hidden transition-colors duration-250 bg-white text-zinc-900 dark:bg-[#030303] dark:text-zinc-100 font-sans">
          {children}
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || "G-DKG16R7DV4"} />
        </body>
      </html>
    </ClerkProvider>
  );
}
