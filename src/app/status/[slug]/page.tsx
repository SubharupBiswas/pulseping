import { db } from "@/lib/db";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";
import { getTierLimits } from "@/lib/tiers";

// ISR: Revalidate every 60 seconds to protect Neon from traffic spikes
export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await fetchStatusPage(slug);
  if (!page) return { title: "Status Page Not Found" };
  return {
    title: `${page.title} — Status`,
    description: `Live operational status for ${page.title}. Powered by PulsePing.`,
  };
}

async function fetchStatusPage(slug: string) {
  try {
    return await (db as any).statusPage.findUnique({
      where: { slug, isPublic: true },
      include: {
        monitors: {
          include: {
            monitor: {
              include: {
                logs: {
                  orderBy: { checkedAt: "desc" },
                  take: 90, // ~90 data points for the availability ribbon
                },
              },
            },
          },
        },
      },
    });
  } catch {
    return null;
  }
}

// ── Helper calculations ───────────────────────────────────────────────────────
function calcUptime(logs: any[]): number | null {
  if (!logs.length) return null;
  const ok = logs.filter((l: any) => l.statusCode >= 200 && l.statusCode < 500).length;
  return Math.round((ok / logs.length) * 100 * 10) / 10;
}

function isCurrentlyUp(logs: any[]): boolean {
  const last = logs[0];
  if (!last) return true;
  return last.statusCode >= 200 && last.statusCode < 500;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit",
    hour12: false,
  });
}

// ── Page component ────────────────────────────────────────────────────────────
export default async function PublicStatusPage({ params }: Props) {
  const { slug } = await params;
  const page = await fetchStatusPage(slug);

  if (!page) notFound();

  const monitors: any[] = page.monitors.map((link: any) => link.monitor).filter(Boolean);

  const allLogs = monitors.flatMap((m: any) => m.logs);
  const globalUptime = calcUptime(allLogs);
  const activeIncidents = monitors.filter((m: any) => !isCurrentlyUp(m.logs)).length;
  const allUp = activeIncidents === 0;

  // Determine badge visibility: FREE plans always show badge; PRO/BUSINESS can opt out
  const ownerPlan: string = (page as any).user?.plan || "FREE";
  const tierConfig = getTierLimits(ownerPlan);
  const showBadge = !tierConfig.allowRemoveBadge || !(page as any).hideBadge;

  return (
    <div className="min-h-screen bg-sky-50/60 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans antialiased transition-colors duration-250">
      {/* Ambient glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[360px] bg-gradient-to-tr from-emerald-500/10 via-teal-500/5 to-transparent blur-3xl pointer-events-none z-0" />

      {/* Header */}
      <header className="relative z-10 border-b border-zinc-200 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl transition-colors duration-250">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-zinc-100 transition">
            ← PulsePing
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <span className="text-xs font-mono text-zinc-500 dark:text-zinc-500">
              Updated every 60s via ISR
            </span>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-12">

        {/* Page title + global status */}
        <div className="mb-10">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-100 mb-2">
            {page.title}
          </h1>
          <div className="flex items-center gap-3 flex-wrap">
            <span className={`inline-flex items-center gap-2 text-sm font-semibold px-3 py-1.5 rounded-full border ${
              allUp
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400"
                : "bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-400"
            }`}>
              <span className={`w-2 h-2 rounded-full ${allUp ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]"}`} />
              {allUp ? "All Systems Operational" : `${activeIncidents} Incident${activeIncidents !== 1 ? "s" : ""} Detected`}
            </span>
            {globalUptime !== null && (
              <span className="text-xs font-mono text-zinc-500 dark:text-zinc-500">
                {globalUptime}% global uptime
              </span>
            )}
          </div>
        </div>

        {/* Summary ribbon */}
        <div className="grid grid-cols-3 gap-3 mb-10">
          {[
            { label: "Global Uptime", value: globalUptime !== null ? `${globalUptime}%` : "—", color: globalUptime === null ? "text-zinc-400 dark:text-zinc-500" : globalUptime >= 99 ? "text-emerald-600 dark:text-emerald-400" : globalUptime >= 95 ? "text-amber-600 dark:text-amber-400" : "text-rose-600 dark:text-rose-400" },
            { label: "Active Incidents", value: String(activeIncidents), color: activeIncidents === 0 ? "text-zinc-800 dark:text-zinc-300" : "text-rose-600 dark:text-rose-400" },
            { label: "Monitors", value: String(monitors.length), color: "text-zinc-800 dark:text-zinc-300" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white/90 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800 rounded-xl p-4 shadow-sm backdrop-blur-md transition-colors">
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-1">{stat.label}</p>
              <p className={`text-2xl font-bold tracking-tight ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Monitor list */}
        {monitors.length === 0 ? (
          <div className="text-center py-16 text-zinc-400 dark:text-zinc-600 text-sm font-mono bg-white/50 dark:bg-zinc-900/20 rounded-xl border border-zinc-200/60 dark:border-zinc-800/40">
            No monitors have been added to this status page yet.
          </div>
        ) : (
          <div className="space-y-3 mb-12">
            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-4">
              Services ({monitors.length})
            </h2>
            {monitors.map((monitor: any) => {
              const up = isCurrentlyUp(monitor.logs);
              const uptime = calcUptime(monitor.logs);
              const lastLog = monitor.logs[0] ?? null;
              const chronoLogs = [...monitor.logs].reverse();

              return (
                <div
                  key={monitor.id}
                  className="bg-white/90 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl p-4 shadow-sm backdrop-blur-md transition-colors"
                >
                  <div className="flex items-center justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className={`shrink-0 w-2 h-2 rounded-full ${
                        up
                          ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.45)]"
                          : "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.45)]"
                      }`} />
                      <p className="font-mono text-sm font-semibold text-zinc-900 dark:text-zinc-200 truncate">
                        {monitor.url}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      {lastLog && (
                        <span className="text-xs font-mono text-zinc-400 dark:text-zinc-500">
                          {lastLog.latency}ms
                        </span>
                      )}
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${
                        up
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                      }`}>
                        {up ? "Operational" : "Degraded"}
                      </span>
                    </div>
                  </div>

                  {/* 90-point availability ribbon */}
                  <div className="flex gap-[2px] items-end h-6">
                    {Array.from({ length: Math.max(0, 90 - chronoLogs.length) }).map((_, i) => (
                      <div key={`empty-${i}`} className="flex-1 h-2 rounded-sm bg-zinc-200 dark:bg-zinc-800" />
                    ))}
                    {chronoLogs.map((log: any) => {
                      const ok = log.statusCode >= 200 && log.statusCode < 500;
                      const h = Math.min(24, Math.max(6, (log.latency / 600) * 24));
                      return (
                        <div
                          key={log.id}
                          className={`flex-1 rounded-sm ${ok ? "bg-emerald-500/60 dark:bg-emerald-500/50" : "bg-rose-500/70 dark:bg-rose-500/60"}`}
                          style={{ height: `${h}px` }}
                          title={`HTTP ${log.statusCode} · ${log.latency}ms · ${formatDate(log.checkedAt)}`}
                        />
                      );
                    })}
                  </div>

                  {uptime !== null && (
                    <p className="text-[10px] font-mono text-zinc-400 dark:text-zinc-600 mt-2">
                      {uptime}% uptime · last {monitor.logs.length} checks
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Recent incident timeline */}
        {(() => {
          const incidents = monitors
            .flatMap((m: any) =>
              m.logs
                .filter((l: any) => l.statusCode < 200 || l.statusCode >= 500 || l.statusCode === 0)
                .slice(0, 5)
                .map((l: any) => ({ ...l, monitorUrl: m.url }))
            )
            .sort((a: any, b: any) => new Date(b.checkedAt).getTime() - new Date(a.checkedAt).getTime())
            .slice(0, 20);

          if (incidents.length === 0) return null;

          return (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-4">
                Recent Incidents
              </h2>
              <div className="space-y-2">
                {incidents.map((inc: any, i: number) => (
                  <div
                    key={`${inc.id}-${i}`}
                    className="flex items-start gap-3 bg-white/80 dark:bg-zinc-900/30 border border-zinc-200/80 dark:border-zinc-800/60 rounded-lg px-4 py-3 shadow-sm transition-colors"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5" />
                    <div className="min-w-0 flex-1">
                      <p className="font-mono text-xs text-zinc-700 dark:text-zinc-400 truncate">{inc.monitorUrl}</p>
                      <p className="text-[10px] text-zinc-400 dark:text-zinc-600 mt-0.5">
                        HTTP {inc.statusCode} · {inc.latency}ms · {formatDate(inc.checkedAt)}
                      </p>
                    </div>
                    <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded shrink-0">
                      {inc.statusCode === 0 ? "TIMEOUT" : inc.statusCode}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {/* Footer */}
        <div className="mt-16 pt-6 border-t border-zinc-200 dark:border-zinc-800/60 flex items-center justify-between">
          {showBadge ? (
            <a
              href={`https://pulseping.subharup.com?utm_source=status_board&utm_medium=badge&utm_campaign=viral_footer`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-500/50 transition-all duration-200 shadow-sm"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Powered by <span className="font-semibold text-slate-900 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400">PulsePing</span>
            </a>
          ) : (
            <span className="text-xs text-zinc-500 dark:text-zinc-600 font-mono">
              Powered by <Link href="/" className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-zinc-300 transition">PulsePing</Link>
            </span>
          )}
          <span className="text-[10px] text-zinc-400 dark:text-zinc-700 font-mono">
            ISR · revalidates every 60s
          </span>
        </div>
      </main>
    </div>
  );
}
