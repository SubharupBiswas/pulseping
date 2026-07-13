"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";

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
  logs: Log[];
};

type Props = {
  monitors: Monitor[];
};

export default function IncidentsTab({ monitors }: Props) {
  const incidents = monitors.filter((m) => {
    const last = m.logs[0];
    return last && (last.statusCode >= 500 || last.statusCode === 0);
  });

  if (incidents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 flex items-center justify-center mb-4">
          <span className="text-emerald-500 text-xl">✓</span>
        </div>
        <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">No Active Incidents</p>
        <p className="text-xs text-zinc-400 dark:text-zinc-600 mt-1">All monitored endpoints are responding normally.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
          Active Incidents ({incidents.length})
        </h2>
        <span className="text-xs font-mono text-rose-500 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/40 px-2.5 py-1 rounded-full">
          ● Degraded
        </span>
      </div>

      <AnimatePresence>
        {incidents.map((monitor) => {
          const lastLog = monitor.logs[0];
          const since = lastLog
            ? new Date(lastLog.checkedAt).toLocaleString("en-US", {
                month: "short", day: "numeric",
                hour: "2-digit", minute: "2-digit", hour12: false,
              })
            : "Unknown";

          return (
            <motion.div
              key={monitor.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="bg-white/90 dark:bg-zinc-900/50 border border-rose-200/60 dark:border-rose-900/40 rounded-xl p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)] shrink-0" />
                    <p className="font-mono text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                      {monitor.url}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-x-3 gap-y-1">
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                      Last check: <span className="font-mono">{since}</span>
                    </span>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                      Status:{" "}
                      <span className="font-mono font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded">
                        {lastLog?.statusCode ?? 0}
                      </span>
                    </span>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                      Latency:{" "}
                      <span className="font-mono text-amber-600 dark:text-amber-400">
                        {lastLog ? `${lastLog.latency}ms` : "—"}
                      </span>
                    </span>
                  </div>
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/40 px-2 py-1 rounded-lg shrink-0">
                  Down
                </span>
              </div>

              {/* Mini history ribbon */}
              <div className="mt-3 flex gap-[2px] items-end">
                {[...monitor.logs].reverse().map((log) => {
                  const ok = log.statusCode >= 200 && log.statusCode < 500;
                  return (
                    <div
                      key={log.id}
                      className={`w-2 rounded-sm ${ok ? "bg-emerald-400/60 dark:bg-emerald-500/40" : "bg-rose-400/80 dark:bg-rose-500/60"}`}
                      style={{ height: `${Math.min(24, Math.max(6, (log.latency / 400) * 24))}px` }}
                      title={`HTTP ${log.statusCode} · ${log.latency}ms`}
                    />
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
