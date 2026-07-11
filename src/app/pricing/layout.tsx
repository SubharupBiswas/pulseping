import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Predictable, developer-first pricing plans for PulsePing uptime monitoring. Choose from Free, Pro, and Business tiers to satisfy your endpoint monitoring SLA targets.",
  alternates: {
    canonical: "https://pulseping.subnetmask.tech/pricing",
  },
  openGraph: {
    title: "Pricing | PulsePing",
    description: "Predictable, developer-first pricing plans for PulsePing uptime monitoring. Choose from Free, Pro, and Business tiers.",
    url: "https://pulseping.subnetmask.tech/pricing",
  },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
