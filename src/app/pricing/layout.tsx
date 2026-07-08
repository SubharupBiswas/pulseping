import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing | PulsePing",
  description: "Predictable, developer-first pricing plans for PulsePing uptime monitoring. Choose from Free, Pro, and Business tiers to satisfy your endpoint monitoring SLA targets.",
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
