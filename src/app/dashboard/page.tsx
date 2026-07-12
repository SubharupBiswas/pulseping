import React from "react";
import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import { db } from "@/lib/db";
import ThemeToggle from "@/components/ThemeToggle";
import PulsePingLogo from "@/components/PulsePingLogo";
import DashboardUserButton from "@/components/DashboardUserButton";
import BillingUpgradeCard from "@/components/BillingUpgradeCard";
import DashboardShell from "@/components/dashboard/DashboardShell";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard | PulsePing",
  description: "Real-time endpoint monitoring, telemetry logs, and incident tracking.",
};

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId || userId === "mock-user-uuid") {
    redirect("/sign-in");
  }

  // Ensure user record exists
  let userRecord = await db.user.findUnique({
    where: { id: userId },
    include: { alertChannels: true } as any,
  });
  if (!userRecord) {
    userRecord = await db.user.create({
      data: { id: userId, email: userId, plan: "FREE" },
      include: { alertChannels: true } as any,
    });
  }

  const headersList = await headers();
  const country = headersList.get("cf-ipcountry") || headersList.get("x-vercel-ip-country") || "US";
  const defaultCurrency = country === "IN" ? "INR" : "USD";

  // Fetch monitors with full log history for charts and filters
  const monitors = await db.monitor.findMany({
    where: { userId },
    include: {
      logs: {
        orderBy: { checkedAt: "desc" },
        // 90 days of checks at max frequency (every 30s) ≈ 259,200 entries; cap at 500 for safety
        take: 500,
      },
    },
    orderBy: { id: "desc" },
  });

  const plan = userRecord.plan;
  const isPremium = plan === "PRO" || plan === "BUSINESS";

  // Serialize dates to ISO strings for the client
  const serializedMonitors = monitors.map((m: any) => ({
    id: m.id,
    url: m.url,
    isActive: m.isActive,
    frequency: m.frequency,
    alertEmail: m.alertEmail ?? null,
    telegramChatId: m.telegramChatId ?? null,
    alertOnFailure: m.alertOnFailure,
    logs: m.logs.map((l: any) => ({
      id: l.id,
      statusCode: l.statusCode,
      latency: l.latency,
      checkedAt: l.checkedAt instanceof Date ? l.checkedAt.toISOString() : l.checkedAt,
    })),
  }));

  const serializedAlertChannels = ((userRecord as any).alertChannels || []).map((ch: any) => ({
    id: ch.id,
    providerType: ch.providerType,
    destinationUrl: ch.destinationUrl,
    userFriendlyName: ch.userFriendlyName ?? null,
  }));

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 selection:bg-emerald-500/10 selection:text-emerald-500 font-sans antialiased relative overflow-hidden transition-colors duration-250">

      {/* Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[440px] bg-gradient-to-tr from-emerald-500/10 via-indigo-500/5 to-transparent blur-3xl pointer-events-none z-0" />

      {/* Sticky Header */}
      <header className="sticky top-0 z-50 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/75 dark:bg-zinc-950/60 backdrop-blur-xl transition-colors duration-250">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">

          <Link href="/" className="flex items-center gap-2.5 group shrink-0" aria-label="PulsePing Home">
            <PulsePingLogo size="w-6 h-6" />
            <span className="font-semibold text-sm tracking-tight text-zinc-900 dark:text-zinc-100">PulsePing</span>
          </Link>

          <div className="flex items-center gap-x-4 md:gap-x-6">
            <ThemeToggle />
            <span
              className={`text-xs font-bold tracking-widest uppercase px-2.5 py-1 rounded-full border shadow-sm transition-colors ${
                isPremium
                  ? "bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                  : "bg-zinc-100 dark:bg-zinc-900/40 text-zinc-500 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800"
              }`}
            >
              {plan} Tier
            </span>
            <DashboardUserButton />
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">

        {/* Page title */}
        <div className="mb-8">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-100">
            Overview
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
            Real-time endpoint monitoring pipelines and telemetry logs.
          </p>
        </div>

        {/* Plan banner */}
        {isPremium ? (
          <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl p-5 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm backdrop-blur-md transition-colors">
            <div className="flex items-start sm:items-center gap-3">
              <span className="text-emerald-500 text-2xl shrink-0 mt-0.5 sm:mt-0">⚡</span>
              <div>
                <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  Active Subscription: {plan} Tier
                </h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  {plan === "PRO"
                    ? "Up to 20 streams, 1-min polling resolution."
                    : "Unlimited streams, 30-sec polling resolution."}
                </p>
              </div>
            </div>
            <Link
              href="/dashboard/billing"
              className="text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-50 dark:hover:bg-white dark:text-zinc-950 px-3.5 py-2 rounded-lg transition shadow-sm shrink-0"
            >
              Manage Subscription
            </Link>
          </div>
        ) : (
          <BillingUpgradeCard userId={userId} currentPlan={plan} currency={defaultCurrency} />
        )}

        {/* Interactive Dashboard Shell */}
        <DashboardShell
          monitors={serializedMonitors}
          userId={userId}
          plan={plan}
          isPremium={isPremium}
          alertThreshold={(userRecord as any).alertThreshold ?? 3}
          emailNotificationsEnabled={(userRecord as any).emailNotificationsEnabled !== false}
          telegramNotificationsEnabled={Boolean((userRecord as any).telegramNotificationsEnabled)}
          alertChannels={serializedAlertChannels}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-900/40 mt-16 bg-white/75 dark:bg-zinc-950/60 backdrop-blur-xl transition-colors duration-250">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <span className="text-sm text-zinc-500 dark:text-zinc-600">PulsePing © 2026</span>
          <div className="flex items-center gap-4">
            <Link href="/status" className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300 transition">System Status</Link>
            <Link href="/terms"  className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300 transition">Terms</Link>
            <Link href="/privacy" className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300 transition">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}