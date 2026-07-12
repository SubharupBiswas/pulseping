import React from "react";
import { headers } from "next/headers";
import PricingClient from "@/components/pricing/PricingClient";

export const dynamic = "force-dynamic";

export default async function PricingPage() {
  const headersList = await headers();
  const country =
    headersList.get("cf-ipcountry") ||
    headersList.get("x-vercel-ip-country") ||
    "US";

  // Geolocation currency detection: default to INR only if user is in India ("IN")
  const defaultCurrency = country === "IN" ? "INR" : "USD";

  return <PricingClient defaultCurrency={defaultCurrency} />;
}
