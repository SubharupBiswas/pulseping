import React from "react";
import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import ThemeToggle from "@/components/ThemeToggle";
import PulsePingLogo from "@/components/PulsePingLogo";
import DashboardUserButton from "@/components/DashboardUserButton";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Advanced Settings | PulsePing",
  description: "Configure advanced webhook alert channels, HTTP options, and API headers.",
};

export default async function AdvancedSettingsPage() {
  const { userId } = await auth();

  if (!userId || userId === "mock-user-uuid") {
    redirect("/sign-in");
  }

  // Force database sync of plan tier
  const userRecord = await db.user.findUnique({
    where: { id: userId },
    select: { plan: true },
  });

  const plan = userRecord?.plan || "FREE";
  if (plan === "FREE") {
    redirect("/dashboard");
  }

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
              {plan} Tier
            </span>
            <DashboardUserButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
        <div className="mb-8">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-100">
            Advanced Settings
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
            Configure custom request headers, alert triggers, and multi-channel telemetry rules.
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
          <Link href="/dashboard/status-pages" className="text-xs font-semibold uppercase tracking-wider text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition">
            Status Pages
          </Link>
          <Link href="/dashboard/advanced-settings" className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Advanced Settings
          </Link>
        </div>

        {/* Configurations Card */}
        <div className="bg-white/90 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl p-6 shadow-sm backdrop-blur-md space-y-6">
          <div>
            <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-2">Multi-Channel Webhooks</h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed mb-4">
              Integrate Slack, Discord, or Microsoft Teams channels to get alert notifications within seconds of an endpoint check failure.
            </p>
            <div className="flex gap-2">
              <button className="text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-950 px-4 py-2 rounded-lg transition shadow-sm">
                Add Alert Channel
              </button>
            </div>
          </div>

          <div className="border-t border-zinc-150 dark:border-zinc-800/60 pt-6">
            <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-2">Request Header Presets</h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed mb-4">
              Bind Authorization tokens, custom cookies, or developer context parameters to outbound test requests.
            </p>
            <button className="text-xs font-semibold border border-zinc-200 dark:border-zinc-800 px-4 py-2 rounded-lg hover:bg-sky-50 dark:hover:bg-zinc-800 transition">
              Manage Custom Header Presets
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
