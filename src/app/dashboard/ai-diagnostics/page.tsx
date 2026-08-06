import React from "react";
import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import ThemeToggle from "@/components/ThemeToggle";
import PulsePingLogo from "@/components/PulsePingLogo";
import DashboardUserButton from "@/components/DashboardUserButton";
import { generateIncidentDiagnosticWithCooldown } from "@/lib/ai";
import { getOrCreateUser } from "@/lib/user";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "AI Diagnostics | PulsePing",
  description: "Advanced AI-powered root cause analysis and latency diagnostics.",
};

export default async function AiDiagnosticsPage() {
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

  // Fetch recent error logs (4xx + 5xx + unreachable)
  const monitors = await db.monitor.findMany({
    where: { userId },
    include: {
      logs: {
        where: {
          OR: [
            { aiDiagnostic: { not: null } },
            { statusCode: { gte: 400 } },
            { statusCode: 0 },
          ],
        },
        orderBy: { checkedAt: "desc" },
        take: 15,
      },
    },
  });

  // Helper: generate a contextual fallback diagnostic for common error codes
  function getFallbackDiagnostic(statusCode: number): string {
    if (statusCode === 0) {
      return "Endpoint unreachable — DNS resolution failed or host refused connection. Check server firewall rules and upstream DNS health.";
    }
    if (statusCode === 400) {
      return "HTTP 400 Bad Request — outbound probe sent an unexpected or malformed payload. Verify custom request headers and query parameters.";
    }
    if (statusCode === 401 || statusCode === 403) {
      return `HTTP ${statusCode} — access denied. The endpoint requires valid auth tokens. Rotate API keys or update Authorization headers in Advanced Settings.`;
    }
    if (statusCode === 404) {
      return "HTTP 404 Not Found — resource does not exist at this path. The endpoint may have moved or been removed. Update the monitor URL.";
    }
    if (statusCode === 429) {
      return "HTTP 429 Too Many Requests — monitoring probe is being rate-limited. Consider reducing polling frequency or whitelisting the probe IP.";
    }
    if (statusCode >= 500) {
      return `HTTP ${statusCode} Server Error — internal failure detected on the target server. Review server logs and check for database or service degradation.`;
    }
    return `HTTP ${statusCode} anomaly detected. Review server-side logs and verify endpoint configuration.`;
  }

  const rawLogs = monitors
    .flatMap((m) =>
      m.logs.map((l) => ({
        logId: l.id,
        monitorUrl: m.url,
        monitorName: m.url.replace("https://", "").replace("http://", "").split("/")[0],
        statusCode: l.statusCode,
        errorBody: l.errorBody,
        checkedAt: l.checkedAt,
        aiDiagnostic: l.aiDiagnostic,
      }))
    )
    .sort((a, b) => b.checkedAt.getTime() - a.checkedAt.getTime());

  const diagnostics = await Promise.all(
    rawLogs.map(async (l) => {
      let text = l.aiDiagnostic;
      if (!text) {
        text = await generateIncidentDiagnosticWithCooldown(
          l.monitorUrl,
          l.statusCode,
          l.errorBody
        );
        if (text) {
          try {
            await db.pingLog.update({
              where: { id: l.logId },
              data: { aiDiagnostic: text },
            });
          } catch (err) {
            console.error("Failed to update pingLog aiDiagnostic:", err);
          }
        }
      }

      return {
        monitorUrl: l.monitorUrl,
        monitorName: l.monitorName,
        statusCode: l.statusCode,
        checkedAt: l.checkedAt,
        aiDiagnostic: text || getFallbackDiagnostic(l.statusCode),
      };
    })
  );

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
            AI Root Cause Analysis
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
            Real-time server log evaluation, anomalies detection, and routing advice.
          </p>
        </div>

        {/* Premium Navigation */}
        <div className="flex items-center gap-4 mb-8 border-b border-zinc-200 dark:border-zinc-800 pb-3 flex-wrap">
          <Link href="/dashboard" className="text-xs font-semibold uppercase tracking-wider text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition">
            Overview
          </Link>
          <Link href="/dashboard/ai-diagnostics" className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            AI Diagnostics
          </Link>
          <Link href="/dashboard/status-pages" className="text-xs font-semibold uppercase tracking-wider text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition">
            Status Pages
          </Link>
          <Link href="/dashboard/advanced-settings" className="text-xs font-semibold uppercase tracking-wider text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition">
            Advanced Settings
          </Link>
        </div>

        {/* Diagnostics logs */}
        <div className="space-y-4">
          {diagnostics.length === 0 ? (
            <div className="bg-white/90 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl p-8 text-center backdrop-blur-md">
              <span className="text-xl">✨</span>
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mt-2">All systems running smoothly</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">No anomalies or HTTP failures detected recently.</p>
            </div>
          ) : (
            diagnostics.map((d, idx) => (
              <div key={idx} className="bg-white/90 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl p-5 shadow-sm backdrop-blur-md transition-all hover:border-violet-500/20">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-100 dark:border-zinc-800/60 pb-3 mb-3">
                  <div>
                    <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 font-mono tracking-tight">{d.monitorName}</span>
                    <span className="ml-2 text-[10px] bg-red-500/10 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full font-bold uppercase">HTTP {d.statusCode}</span>
                  </div>
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono">{d.checkedAt.toLocaleString()}</span>
                </div>
                <div className="bg-purple-100/90 dark:bg-purple-950/70 border border-purple-300 dark:border-purple-800/80 rounded-xl p-4 text-xs font-mono shadow-xs">
                  <p className="text-purple-950 dark:text-purple-300 font-bold mb-1.5 flex items-center gap-1.5">
                    ✦ AI DIAGNOSTICS SUMMARY
                  </p>
                  <p className="text-purple-950 dark:text-purple-100 leading-relaxed font-medium">
                    {d.aiDiagnostic}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
