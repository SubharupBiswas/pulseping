import React from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { db } from "@/lib/db";
import AddMonitorForm from "@/components/AddMonitorForm";
import BillingUpgradeCard from "@/components/BillingUpgradeCard";
import { deleteMonitor } from "@/app/actions/monitors";
import ThemeToggle from "@/components/ThemeToggle";
import PulsePingLogo from "@/components/PulsePingLogo";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId || userId === "mock-user-uuid") {
    redirect("/sign-in");
  }

  let userRecord = await db.user.findUnique({ where: { id: userId } });
  if (!userRecord) {
    userRecord = await db.user.create({
      data: { id: userId, email: userId, plan: "FREE" },
    });
  }

  const monitors = await db.monitor.findMany({
    where: { userId },
    include: {
      logs: {
        orderBy: { checkedAt: "desc" },
        take: 12,
      },
    },
    orderBy: { id: "desc" },
  });

  const totalMonitors = monitors.length;
  const activeIncidents = monitors.filter((m: any) => {
    const last = m.logs[0];
    return last && (last.statusCode >= 500 || last.statusCode === 0);
  }).length;

  const plan = userRecord.plan;
  const isPremium = plan === "PRO" || plan === "BUSINESS";

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 selection:bg-emerald-500/10 selection:text-emerald-500 font-sans antialiased relative overflow-hidden transition-colors duration-250">

      {/* Ambient Glow — vibrant modern SaaS blur */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[440px] bg-gradient-to-tr from-emerald-500/10 via-indigo-500/5 to-transparent blur-3xl pointer-events-none z-0" />

      {/* Sticky Header */}
      <header className="sticky top-0 z-50 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/75 dark:bg-zinc-950/60 backdrop-blur-xl transition-colors duration-250">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">

          {/* Brand Logo Link */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0 pointer-events-auto" aria-label="PulsePing Home">
            <PulsePingLogo size="w-6 h-6" />
            <span className="font-semibold text-sm tracking-tight text-zinc-900 dark:text-zinc-100">PulsePing</span>
          </Link>

          {/* Right Controls */}
          <div className="flex items-center gap-x-4 md:gap-x-6">
            <ThemeToggle />
            <span className={`text-xs font-bold tracking-widest uppercase px-2.5 py-1 rounded-full border shadow-sm transition-colors ${
              isPremium
                ? "bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                : "bg-zinc-100 dark:bg-zinc-900/40 text-zinc-500 dark:text-zinc-400 border-zinc-200 dark:border-zinc-850"
            }`}>
              {plan} Tier
            </span>
            <UserButton appearance={{} as any}>
              <UserButton.MenuItems>
                <UserButton.Link
                  label="Billing & Usage"
                  labelIcon={
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  }
                  href="/dashboard/billing"
                />
              </UserButton.MenuItems>
            </UserButton>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">

        {/* Page Title */}
        <div className="mb-10" aria-label="Dashboard Overview Header">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-100">Overview</h1>
          <p className="text-zinc-500 dark:text-zinc-450 text-sm mt-1">Real-time endpoint monitoring pipelines and telemetry logs.</p>
        </div>

        {/* Premium Banner vs Up-sell pricing options stack */}
        {isPremium ? (
          <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl p-5 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm backdrop-blur-md transition-colors">
            <div className="flex items-start sm:items-center gap-3">
              <span className="text-emerald-500 text-2xl shrink-0 mt-0.5 sm:mt-0">⚡</span>
              <div>
                <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-150">Active Subscription: {plan} Tier</h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Your monitoring limits are expanded (up to {plan === "PRO" ? "20" : "unlimited"} streams, {plan === "PRO" ? "1-min" : "30-sec"} polling resolution).
                </p>
              </div>
            </div>
            <Link
              href="/dashboard/billing"
              className="text-xs font-semibold bg-zinc-900 hover:bg-zinc-850 text-white dark:bg-zinc-50 dark:hover:bg-white dark:text-zinc-950 px-3.5 py-2 rounded-lg transition duration-150 shadow-sm shrink-0 self-start sm:self-auto"
            >
              Manage Subscription
            </Link>
          </div>
        ) : (
          <BillingUpgradeCard userId={userId} currentPlan={plan} />
        )}

        {/* Stats Matrix */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8" aria-label="Status Metrics Summary">

          {/* Stat: Active Streams */}
          <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl p-5 shadow-sm backdrop-blur-md transition-colors">
            <h2 className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block mb-3">Active Streams</h2>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">{totalMonitors}</span>
              <span className="text-sm font-medium text-zinc-400 dark:text-zinc-500">
                {plan === "FREE" ? "/ 2 free" : plan === "PRO" ? "/ 20 limit" : "/ unlimited"}
              </span>
            </div>
          </div>

          {/* Stat: System Status */}
          <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl p-5 shadow-sm backdrop-blur-md transition-colors">
            <h2 className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block mb-3">System Status</h2>
            <div className="flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                activeIncidents > 0
                  ? "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.35)]"
                  : "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.35)] animate-pulse"
              }`} />
              <span className={`text-sm font-semibold tracking-tight ${
                activeIncidents > 0 
                  ? "text-rose-600 dark:text-rose-450 bg-rose-500/10 px-2 py-0.5 rounded" 
                  : "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded"
              }`}>
                {activeIncidents > 0 ? "Degradation Detected" : "All Nodes Operational"}
              </span>
            </div>
          </div>

          {/* Stat: Active Incidents */}
          <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl p-5 shadow-sm backdrop-blur-md transition-colors">
            <h2 className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block mb-3">Active Incidents</h2>
            <span className={`text-2xl font-bold tracking-tight px-2 py-0.5 rounded ${
              activeIncidents > 0 
                ? "text-rose-600 dark:text-rose-400 bg-rose-500/10" 
                : "text-zinc-500 dark:text-zinc-400"
            }`}>
              {activeIncidents}
            </span>
          </div>
        </section>

        {/* Add Monitor Form */}
        <AddMonitorForm userId={userId} />

        {/* Monitor Stream List */}
        <section className="space-y-3" aria-label="Active Monitoring Channels List">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
              Monitoring Channels ({totalMonitors})
            </h2>
            {totalMonitors > 0 && (
              <span className="text-xs text-zinc-400 dark:text-zinc-650 font-mono">Last 12 checks shown per stream</span>
            )}
          </div>

          {monitors.length === 0 ? (
            <div className="bg-white dark:bg-zinc-900/5 border border-dashed border-zinc-200 dark:border-zinc-900/80 rounded-xl p-12 text-center shadow-sm">
              <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/50 flex items-center justify-center mx-auto mb-4">
                <span className="text-zinc-400 dark:text-zinc-650 text-sm">⬡</span>
              </div>
              <p className="text-zinc-400 dark:text-zinc-500 text-sm font-mono">No streams provisioned.</p>
              <p className="text-zinc-400 dark:text-zinc-650 text-xs mt-1">Register an endpoint URL above to begin log collection.</p>
            </div>
          ) : (
            monitors.map((monitor: any) => {
              const lastLog = monitor.logs[0];
              const isUp = lastLog
                ? lastLog.statusCode >= 200 && lastLog.statusCode < 500
                : true;
              const horizontalLogs = [...monitor.logs].reverse();
              const uptimePercent =
                monitor.logs.length > 0
                  ? Math.round(
                      (monitor.logs.filter(
                        (l: any) => l.statusCode >= 200 && l.statusCode < 500
                      ).length /
                        monitor.logs.length) *
                        100
                    )
                  : null;

              return (
                <div
                  key={monitor.id}
                  className="bg-white dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl p-4 hover:border-zinc-300 dark:hover:border-zinc-700/60 transition duration-200 shadow-sm backdrop-blur-md group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                    {/* Left: URL + Meta */}
                    <div className="flex items-start gap-3 min-w-0">
                      <div className={`mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full ${
                        isUp
                          ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.45)]"
                          : "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.45)]"
                      }`} />
                      <div className="min-w-0 flex-1">
                        <p className="font-mono text-sm font-semibold text-zinc-900 dark:text-zinc-200 truncate">{monitor.url}</p>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5">
                          <span className="text-xs text-zinc-500 dark:text-zinc-400">
                            Latency:{" "}
                            <span className="text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded font-mono">
                              {lastLog ? `${lastLog.latency}ms` : "—"}
                            </span>
                          </span>
                          <span className="text-zinc-300 dark:text-zinc-800 text-xs">•</span>
                          <span className="text-xs text-zinc-500 dark:text-zinc-400">
                            Status:{" "}
                            <span className={`font-mono font-bold px-2 py-0.5 rounded ${isUp ? "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10" : "text-rose-600 dark:text-rose-455 bg-rose-500/10"}`}>
                              {lastLog ? lastLog.statusCode : "Pending"}
                            </span>
                          </span>
                          {uptimePercent !== null && (
                            <>
                              <span className="text-zinc-300 dark:text-zinc-800 text-xs">•</span>
                              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                                Uptime: <span className="text-zinc-700 dark:text-zinc-300 font-mono">{uptimePercent}%</span>
                              </span>
                            </>
                          )}
                          {lastLog && (
                            <>
                              <span className="text-zinc-300 dark:text-zinc-800 text-xs">•</span>
                              <span className="text-xs text-zinc-500 dark:text-zinc-450 font-mono">
                                {new Date(lastLog.checkedAt).toLocaleTimeString("en-US", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: false,
                                })}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Timeline + Actions */}
                    <div className="flex items-center justify-between sm:justify-end gap-5 shrink-0 border-t border-zinc-200 dark:border-zinc-800/40 pt-3 sm:border-none sm:pt-0">
                      {/* Uptime Timeline Ribbon */}
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-zinc-450 dark:text-zinc-550 uppercase tracking-widest font-bold">Check history</span>
                        <div className="flex gap-[2px] items-center h-4">
                          {Array.from({ length: Math.max(0, 12 - horizontalLogs.length) }).map((_, i) => (
                            <div key={`empty-${i}`} className="h-3 w-[3px] rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-250 dark:border-zinc-800/30" />
                          ))}
                          {horizontalLogs.map((log) => (
                            <div
                              key={log.id}
                              className={`h-3 w-[3px] rounded-full transition-colors duration-200 ${
                                log.statusCode >= 200 && log.statusCode < 500
                                  ? "bg-emerald-500/20 dark:bg-emerald-500/30 hover:bg-emerald-500 border border-emerald-500/10 dark:border-emerald-500/20"
                                  : "bg-rose-500/20 dark:bg-rose-500/30 hover:bg-rose-500 border border-rose-500/10 dark:border-rose-500/20"
                              }`}
                              title={`HTTP ${log.statusCode} · ${log.latency}ms`}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Delete Button */}
                      <form
                        action={async () => {
                          "use server";
                          await deleteMonitor(monitor.id);
                        }}
                      >
                        <button
                          type="submit"
                          className="text-xs text-zinc-600 dark:text-zinc-400 hover:text-rose-500 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 hover:bg-rose-50 dark:hover:bg-rose-950/20 hover:border-rose-300 dark:hover:border-rose-900/40 px-2.5 py-1 rounded-md transition duration-150 cursor-pointer font-medium opacity-0 group-hover:opacity-100 shadow-sm"
                        >
                          Remove
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-900/40 mt-16 bg-white/75 dark:bg-zinc-950/60 backdrop-blur-xl transition-colors duration-250">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <span className="text-sm text-zinc-500 dark:text-zinc-650">PulsePing © 2026</span>
          <div className="flex items-center gap-4">
            <Link href="/status" className="text-sm text-zinc-555 hover:text-zinc-950 dark:text-zinc-500 dark:hover:text-zinc-300 transition duration-150">System Status</Link>
            <Link href="/terms" className="text-sm text-zinc-555 hover:text-zinc-950 dark:text-zinc-500 dark:hover:text-zinc-300 transition duration-150">Terms</Link>
            <Link href="/privacy" className="text-sm text-zinc-555 hover:text-zinc-950 dark:text-zinc-500 dark:hover:text-zinc-300 transition duration-150">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
