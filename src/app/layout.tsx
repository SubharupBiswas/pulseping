import React from "react";
import type { Metadata, Viewport } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";

const inter = {
  variable: "font-sans",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f0f9ff" },
    { media: "(prefers-color-scheme: dark)", color: "#030303" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    default: "PulsePing | Developer-First Uptime Monitoring",
    template: "%s | PulsePing",
  },
  description:
    "PulsePing is a developer-first uptime monitoring platform. Track API endpoints, configure Discord webhooks, and analyze response latency with Neon & Prisma.",
  keywords: [
    "uptime monitoring",
    "developer tools",
    "SaaS monitoring",
    "endpoint tracker",
    "Discord alerts",
    "SLA logging",
    "API monitoring",
    "server health check",
  ],
  authors: [{ name: "PulsePing Team" }],
  metadataBase: new URL("https://pulseping.subharup.com"),
  alternates: {
    canonical: "https://pulseping.subharup.com",
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
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
    other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
      ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION }
      : undefined,
  },
  openGraph: {
    title: "PulsePing | Developer-First Uptime Monitoring",
    description:
      "PulsePing is a developer-first uptime monitoring platform. Track API endpoints, configure Discord webhooks, and analyze response latency with Neon & Prisma.",
    url: "https://pulseping.subharup.com",
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
    description:
      "PulsePing is a developer-first uptime monitoring platform. Track API endpoints, configure Discord webhooks, and analyze response latency with Neon & Prisma.",
    images: ["/og-image.png"],
    creator: "@pulseping",
  },

  // 🟢 UPDATED: SVG Favicon linked directly to public static asset
  icons: [
    { rel: "icon", type: "image/svg+xml", url: "/logo.svg" },
    { rel: "shortcut icon", url: "/logo.svg" },
    { rel: "apple-touch-icon", url: "/logo.svg" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className="h-full antialiased"
        suppressHydrationWarning
        style={{ colorScheme: "dark light" }}
      >
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap"
            rel="stylesheet"
          />
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
                name: "PulsePing",
                url: "https://pulseping.subharup.com",
                description:
                  "Developer-first uptime monitoring platform with Discord alerts and Neon database logs.",
                applicationCategory: "DeveloperApplication",
                operatingSystem: "All",
                offers: {
                  "@type": "Offer",
                  price: "499.00",
                  priceCurrency: "INR",
                  category: "Pro Tier Subscription",
                },
              }),
            }}
          />
        </head>
        <body
          className={`${inter.variable} min-h-full flex flex-col overflow-x-hidden transition-colors duration-250 bg-sky-50 text-zinc-900 dark:bg-[#030303] dark:text-zinc-100 font-sans antialiased`}
        >
          {children}
          <GoogleAnalytics
            gaId={process.env.NEXT_PUBLIC_GA_ID || "G-DKG16R7DV4"}
          />
        </body>
      </html>
    </ClerkProvider>
  );
}