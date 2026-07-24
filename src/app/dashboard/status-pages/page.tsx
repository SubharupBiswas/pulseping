import React from "react";
import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import ThemeToggle from "@/components/ThemeToggle";
import PulsePingLogo from "@/components/PulsePingLogo";
import DashboardUserButton from "@/components/DashboardUserButton";

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

  // Fetch status pages for this user
  const statusPages = await db.statusPage.findMany({
    where: { userId },
    include: {
      monitors: {
        include: {
          monitor: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

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

        {/* Status page listing */}
        <div className="space-y-4">
          <div className="flex justify-end mb-4">
            <button className="text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg shadow-sm transition">
              + Create Status Page
            </button>
          </div>

          {statusPages.length === 0 ? (
            <div className="bg-white/90 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl p-12 text-center backdrop-blur-md">
              <span className="text-xl">🌐</span>
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mt-2">No public status boards created</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Create operational dashboards to keep users informed during outages.</p>
            </div>
          ) : (
            statusPages.map((page) => (
              <div key={page.id} className="bg-white/90 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl p-5 shadow-sm backdrop-blur-md transition-all hover:border-emerald-500/20 flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{page.title}</h4>
                  <Link href={`/status/${page.slug}`} target="_blank" className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-mono mt-1 block">
                    /status/{page.slug}
                  </Link>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full ${page.isPublic ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-zinc-150 text-zinc-650"}`}>
                    {page.isPublic ? "Public" : "Private"}
                  </span>
                  <button className="text-xs font-semibold border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 rounded-lg hover:bg-sky-50 dark:hover:bg-zinc-800 transition">
                    Configure
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
