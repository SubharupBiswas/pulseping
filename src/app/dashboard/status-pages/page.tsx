import React from "react";
import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import ThemeToggle from "@/components/ThemeToggle";
import PulsePingLogo from "@/components/PulsePingLogo";
import DashboardUserButton from "@/components/DashboardUserButton";
import StatusPagesClient from "@/components/dashboard/StatusPagesClient";

import { getOrCreateUser } from "@/lib/user";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Public Status Pages | PulsePing",
  description: "Manage your customized public operational status boards.",
};

export default async function StatusPagesPage() {
  const { userId } = await auth();

  if (!userId || userId === "mock-user-uuid") {
    redirect("/sign-in");
  }

  // Force database sync of plan tier with fallback creation
  const userRecord = await getOrCreateUser(userId);

  const plan = userRecord?.plan || "FREE";
  if (plan === "FREE") {
    redirect("/dashboard");
  }

  // Fetch status pages with linked monitors & user's monitors
  const [statusPages, monitors] = await Promise.all([
    db.statusPage.findMany({
      where: { userId },
      include: {
        monitors: {
          select: { monitorId: true },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    db.monitor.findMany({
      where: { userId },
      select: { id: true, url: true },
    }),
  ]);

  return (
    <div className="min-h-screen bg-sky-50/60 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 selection:bg-emerald-500/10 selection:text-emerald-500 font-sans antialiased relative overflow-hidden transition-colors duration-250">
      {/* Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[440px] bg-gradient-to-tr from-emerald-500/10 via-indigo-500/5 to-transparent blur-3xl pointer-events-none z-0" />

      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-sky-50/80 dark:bg-zinc-950/40 border-b border-zinc-200 dark:border-zinc-850 backdrop-blur-xl transition-colors duration-250">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <PulsePingLogo size="w-6 h-6" />
            <span className="font-semibold text-sm tracking-tight text-zinc-900 dark:text-zinc-100">PulsePing</span>
          </Link>
          <div className="flex items-center gap-x-4 md:gap-x-6">
            <ThemeToggle />
            <span className="text-xs font-bold tracking-widest uppercase px-2.5 py-1 rounded-full border shadow-sm bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
              {String(plan)} Tier
            </span>
            <DashboardUserButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
        <div className="mb-8">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-100">
            Operational Status Boards
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
            Build and publish public status monitors for your clients and support teams.
          </p>
        </div>

        {/* Premium Navigation */}
        <div className="flex items-center gap-4 mb-8 border-b border-zinc-200 dark:border-zinc-800 pb-3 flex-wrap">
          <Link href="/dashboard" className="text-xs font-semibold uppercase tracking-wider text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition">
            Overview
          </Link>
          <Link href="/dashboard/ai-diagnostics" className="text-xs font-semibold uppercase tracking-wider text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition">
            AI Diagnostics
          </Link>
          <Link href="/dashboard/status-pages" className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Status Pages
          </Link>
          <Link href="/dashboard/advanced-settings" className="text-xs font-semibold uppercase tracking-wider text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition">
            Advanced Settings
          </Link>
        </div>

        {/* Interactive Status Pages section (client component handles modals) */}
        <StatusPagesClient
          initialPages={statusPages.map((p) => ({
            id: p.id,
            slug: p.slug,
            title: p.title,
            isPublic: p.isPublic,
            createdAt: p.createdAt.toISOString(),
            monitorIds: p.monitors.map((m) => m.monitorId),
          }))}
          userMonitors={monitors.map((m) => ({ id: m.id, url: m.url }))}
          plan={plan}
        />
      </main>
    </div>
  );
}
