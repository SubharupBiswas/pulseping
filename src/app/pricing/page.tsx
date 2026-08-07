import React from "react";
import { headers } from "next/headers";
import { currentUser } from "@clerk/nextjs/server";
import PricingClient from "@/components/pricing/PricingClient";
import { isAdminUser } from "@/lib/admin";

export const dynamic = "force-dynamic";

export default async function PricingPage() {
  const headersList = await headers();
  const country =
    headersList.get("cf-ipcountry") ||
    headersList.get("x-vercel-ip-country") ||
    "US";

  // Geolocation currency detection: default to INR only if user is in India ("IN")
  const defaultCurrency = country === "IN" ? "INR" : "USD";

  let isAdmin = false;
  try {
    const user = await currentUser();
    const primaryEmail = user?.emailAddresses?.[0]?.emailAddress;
    isAdmin = isAdminUser(primaryEmail);
  } catch (err) {
    console.error("Failed to check admin status:", err);
  }

  return <PricingClient defaultCurrency={defaultCurrency} isAdmin={isAdmin} />;
}
