"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import PillTabNav from "./PillTabNav";
import dynamic from "next/dynamic";

const BentoMetrics = dynamic(() => import("./BentoMetrics"), { ssr: false });
const MonitorCard = dynamic(() => import("./MonitorCard"), { ssr: false });
const IncidentsTab = dynamic(() => import("./IncidentsTab"), { ssr: false });
const SettingsTab = dynamic(() => import("./SettingsTab"), { ssr: false });
const LatencyChart = dynamic(() => import("./LatencyChart"), { ssr: false });

import AddMonitorForm from "@/components/AddMonitorForm";
import { getLatestTelemetry } from "@/app/actions/monitors";

type Log = {
  id: string;
  statusCode: number;
  latency: number;
  checkedAt: string;
};

type Monitor = {
  id: string;
  url: string;
  isActive: boolean;
  frequency: number;
  alertEmail: string | null;
  telegramChatId: string | null;
  webhookUrl: string | null;
  alertOnFailure: boolean;
  logs: Log[];
  alertChannels: AlertChannel[];
};

type AlertChannel = {
  id: string;
  providerType: string;
  destinationUrl: string;
  userFriendlyName: string | null;
};

type Props = {
  monitors: Monitor[];
  userId: string;
  plan: string;
  isPremium: boolean;
  alertThreshold: number;
  emailNotificationsEnabled: boolean;
  telegramNotificationsEnabled: boolean;
  alertChannels: AlertChannel[];
};

type StatusFilter = "ALL" | "UP" | "DOWN" | "PAUSED";

const TABS = [
  { id: "streams",   label: "Streams"   },
  { id: "incidents", label: "Incidents" },
  { id: "settings",  label: "Settings"  },
];

const STATUS_FILTERS: { id: StatusFilter; label: string }[] = [
  { id: "ALL",    label: "All"    },
  { id: "UP",     label: "Up"     },
  { id: "DOWN",   label: "Down"   },
  { id: "PAUSED", label: "Paused" },
];

export default function DashboardShell({
  monitors,
  userId,
  plan,
  isPremium,
  alertThreshold,
  emailNotificationsEnabled,
  telegramNotificationsEnabled,
  alertChannels,
}: Props) {
  const [activeTab, setActiveTab] = useState("streams");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [logSearch, setLogSearch] = useState("");
  const [logExpanded, setLogExpanded] = useState(false);

  const [monitorsState, setMonitorsState] = useState<Monitor[]>(monitors);

  useEffect(() => {
    setMonitorsState(monitors);
  }, [monitors]);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await getLatestTelemetry(userId);
        if (res && res.success && res.monitors) {
          setMonitorsState(res.monitors as Monitor[]);
        }
      } catch (err) {
        console.error("Error polling telemetry metrics:", err);
      }
    }, 15000); // Poll every 15 seconds

    return () => clearInterval(interval);
  }, [userId]);

  // ── Aggregate metrics ──────────────────────────────────────────
  const totalMonitors = monitorsState.length;
  const activeIncidents = monitorsState.filter((m) => {
    const last = m.logs[0];
    return last && (last.statusCode >= 500 || last.statusCode === 0);
  }).length;

  const allLatencies = monitorsState.flatMap((m) => m.logs.map((l) => l.latency)).filter(Boolean);
  const avgLatency = allLatencies.length > 0
    ? Math.round(allLatencies.reduce((a, b) => a + b, 0) / allLatencies.length)
    : null;

  const allLogs = monitorsState.flatMap((m) => m.logs);
  const uptimePercent =
    allLogs.length > 0
      ? Math.round(
          (allLogs.filter((l) => l.statusCode >= 200 && l.statusCode < 500).length / allLogs.length) * 100
        )
      : null;

  // ── Status quick-filter ────────────────────────────────────────
  const filteredMonitors = monitorsState.filter((m) => {
    if (statusFilter === "PAUSED") return !m.isActive;
    if (statusFilter === "UP") {
      if (!m.isActive) return false;
      const last = m.logs[0];
      return !last || (last.statusCode >= 200 && last.statusCode < 500);
    }
    if (statusFilter === "DOWN") {
      if (!m.isActive) return false;
      const last = m.logs[0];
      return last && (last.statusCode < 200 || last.statusCode >= 500);
    }
    return true; // ALL
  });

  // ── System Diagnostics Log ─────────────────────────────────────
  type LogEntry = Log & { monitorUrl: string; monitorId: string };
  const systemLogs: LogEntry[] = monitorsState
    .flatMap((m) => m.logs.map((l) => ({ ...l, monitorUrl: m.url, monitorId: m.id })))
    .sort((a, b) => new Date(b.checkedAt).getTime() - new Date(a.checkedAt).getTime());

  const filteredSystemLogs = logSearch.trim()
    ? systemLogs.filter((l) => l.monitorUrl.toLowerCase().includes(logSearch.toLowerCase()))
    : systemLogs;

  const visibleLogs = logExpanded ? filteredSystemLogs : filteredSystemLogs.slice(0, 25);

  return (
    <div>
      {/* Bento metrics grid */}
      <BentoMetrics
        totalMonitors={totalMonitors}
        activeIncidents={activeIncidents}
        avgLatency={avgLatency}
        uptimePercent={uptimePercent}
        plan={plan}
      />

      {/* Add monitor form — only in streams tab */}
      {activeTab === "streams" && (
        <AddMonitorForm userId={userId} />
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between mb-6">
        <PillTabNav tabs={TABS} active={activeTab} onChange={setActiveTab} />
        {activeTab === "streams" && totalMonitors > 0 && (
          <span className="text-xs text-zinc-400 dark:text-zinc-600 font-mono hidden sm:block">
            {filteredMonitors.length}/{totalMonitors} stream{totalMonitors !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
        >
          {activeTab === "streams" && (
            <section aria-label="Active Monitoring Channels">
              {monitorsState.length === 0 ? (
                <div className="bg-white dark:bg-zinc-900/5 border border-dashed border-zinc-200 dark:border-zinc-900/80 rounded-xl p-12 text-center shadow-sm">
                  <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/50 flex items-center justify-center mx-auto mb-4">
                    <span className="text-zinc-400 dark:text-zinc-600 text-sm">⬡</span>
                  </div>
                  <p className="text-zinc-400 dark:text-zinc-500 text-sm font-mono">No streams provisioned.</p>
                  <p className="text-zinc-400 dark:text-zinc-600 text-xs mt-1">
                    Register an endpoint URL above to begin log collection.
                  </p>
                </div>
              ) : (
                <>
                  {/* ── Quick-Filter Action Bar ── */}
                  <div className="flex items-center gap-2 mb-4 flex-wrap">
                    <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-600 mr-1 shrink-0">
                      Filter:
                    </span>
                    {STATUS_FILTERS.map((f) => {
                      const isActive = statusFilter === f.id;
                      const countForFilter = monitorsState.filter((m) => {
                        if (f.id === "PAUSED") return !m.isActive;
                        if (f.id === "UP") {
                          if (!m.isActive) return false;
                          const last = m.logs[0];
                          return !last || (last.statusCode >= 200 && last.statusCode < 500);
                        }
                        if (f.id === "DOWN") {
                          if (!m.isActive) return false;
                          const last = m.logs[0];
                          return last && (last.statusCode < 200 || last.statusCode >= 500);
                        }
                        return true;
                      }).length;

                      return (
                        <button
                          key={f.id}
                          onClick={() => setStatusFilter(f.id)}
                          className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all duration-150 ${
                            isActive
                              ? f.id === "DOWN"
                                ? "bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800/50 text-rose-600 dark:text-rose-400"
                                : f.id === "UP"
                                ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/50 text-emerald-600 dark:text-emerald-400"
                                : "bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200"
                              : "bg-white dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700 hover:text-zinc-700 dark:hover:text-zinc-200"
                          }`}
                        >
                          {f.label}
                          <span className={`text-[10px] font-mono px-1 py-0.5 rounded ${
                            isActive
                              ? "bg-white/40 dark:bg-black/20"
                              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600"
                          }`}>
                            {countForFilter}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Monitor cards */}
                  <AnimatePresence>
                    {filteredMonitors.length === 0 ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="py-10 text-center text-zinc-400 dark:text-zinc-600 text-sm font-mono border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl"
                      >
                        No streams match the &quot;{statusFilter}&quot; filter.
                      </motion.div>
                    ) : (
                      <div className="space-y-3">
                        {filteredMonitors.map((monitor) => (
                          <MonitorCard key={monitor.id} monitor={monitor} />
                        ))}
                      </div>
                    )}
                  </AnimatePresence>

                  {/* ── System Diagnostics Log ── */}
                  {systemLogs.length > 0 && (
                    <div className="mt-10">
                      {/* Section header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                          <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                            System Diagnostics Log
                          </h2>
                          <span className="text-xs font-mono text-zinc-400 dark:text-zinc-600 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">
                            {filteredSystemLogs.length} entries
                          </span>
                        </div>
                        <button
                          onClick={() => setLogExpanded((x) => !x)}
                          className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
                        >
                          {logExpanded ? "Show less ↑" : "Show all ↓"}
                        </button>
                      </div>

                      {/* Search input */}
                      <div className="mb-3">
                        <input
                          type="text"
                          value={logSearch}
                          onChange={(e) => setLogSearch(e.target.value)}
                          placeholder="Filter by endpoint URL…"
                          className="w-full sm:w-72 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100 font-mono text-xs placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-700 focus:ring-1 focus:ring-zinc-400/30 dark:focus:ring-zinc-700/30 transition"
                        />
                      </div>

                      {/* Log table */}
                      <div className="bg-white dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
                        {/* Table header */}
                        <div className="grid grid-cols-[1fr_auto_auto_auto] gap-0 border-b border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/80 dark:bg-zinc-900/60 px-4 py-2.5">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-600">Endpoint</span>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-600 text-center px-4">Status</span>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-600 text-right px-4">Latency</span>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-600 text-right pl-4">Time</span>
                        </div>

                        {/* Log rows */}
                        <div className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                          {visibleLogs.length === 0 ? (
                            <div className="px-4 py-8 text-center text-zinc-400 dark:text-zinc-600 text-xs font-mono">
                              No log entries match your search.
                            </div>
                          ) : (
                            visibleLogs.map((log) => {
                              const isOk = log.statusCode >= 200 && log.statusCode < 500;
                              const ts = new Date(log.checkedAt).toLocaleString("en-US", {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                                hour12: false,
                              });
                              return (
                                <div
                                  key={`${log.monitorId}-${log.id}`}
                                  className="grid grid-cols-[1fr_auto_auto_auto] gap-0 px-4 py-2.5 hover:bg-zinc-50/80 dark:hover:bg-zinc-800/20 transition-colors"
                                >
                                  <p className="font-mono text-xs text-zinc-700 dark:text-zinc-300 truncate pr-4 self-center">
                                    {log.monitorUrl}
                                  </p>
                                  <span
                                    className={`self-center text-center text-[10px] font-bold font-mono px-2 py-0.5 rounded ${
                                      isOk
                                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                        : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                                    }`}
                                  >
                                    {log.statusCode === 0 ? "ERR" : log.statusCode}
                                  </span>
                                  <span className="self-center text-right text-xs font-mono text-amber-600 dark:text-amber-400 px-4">
                                    {log.latency}ms
                                  </span>
                                  <span className="self-center text-right text-[10px] font-mono text-zinc-400 dark:text-zinc-600 pl-4 whitespace-nowrap">
                                    {ts}
                                  </span>
                                </div>
                              );
                            })
                          )}
                        </div>

                        {/* Footer: show-more toggle */}
                        {filteredSystemLogs.length > 25 && (
                          <div className="px-4 py-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between bg-zinc-50/60 dark:bg-zinc-900/40">
                            <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-600">
                              Showing {visibleLogs.length} of {filteredSystemLogs.length}
                            </span>
                            <button
                              onClick={() => setLogExpanded((x) => !x)}
                              className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                            >
                              {logExpanded ? "Collapse ↑" : `Show all ${filteredSystemLogs.length} ↓`}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
            </section>
          )}

          {activeTab === "incidents" && (
            <section aria-label="Incident Stream">
              <IncidentsTab monitors={monitorsState} />
            </section>
          )}

          {activeTab === "settings" && (
            <section aria-label="Notification Settings">
              <SettingsTab
                monitors={monitorsState}
                userId={userId}
                initialThreshold={alertThreshold}
                emailNotificationsEnabled={emailNotificationsEnabled}
                telegramNotificationsEnabled={telegramNotificationsEnabled}
                alertChannels={alertChannels}
              />
            </section>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
