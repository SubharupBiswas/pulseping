"use client";

import React, { useState, useOptimistic, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { toggleMonitor } from "@/app/actions/monitors";
import EditMonitorSheet from "./EditMonitorSheet";
import HoldToDelete from "./HoldToDelete";

// Recharts accesses window / ResizeObserver — must be dynamically loaded with ssr:false
const LatencyChart = dynamic(() => import("./LatencyChart"), {
  ssr: false,
  loading: () => (
    <div className="h-32 rounded-lg bg-sky-100/40 dark:bg-zinc-800/40 animate-pulse" />
  ),
});

type Log = {
  id: string;
  statusCode: number;
  latency: number;
  checkedAt: string;
  aiDiagnostic?: string | null;
  errorBody?: string | null;
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
  httpMethod?: string | null;
  sslExpiresAt?: string | null;
  method: string;
  headers: string | null;
  body: string | null;
  keywordCheck: string | null;
  sslTrack: boolean;
  isHeartbeat: boolean;
  logs: Log[];
};

type Props = {
  monitor: Monitor;
  isPremium: boolean;
};

export default function MonitorCard({ monitor, isPremium }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [, startTransition] = useTransition();

  const [optimisticActive, setOptimisticActive] = useOptimistic(monitor.isActive);

  const lastLog = monitor.logs[0] ?? null;
  const isUp = lastLog ? lastLog.statusCode >= 200 && lastLog.statusCode < 500 : true;
  const chronoLogs = [...monitor.logs].reverse();

  const uptimePercent =
    monitor.logs.length > 0
      ? Math.round(
          (monitor.logs.filter((l) => l.statusCode >= 200 && l.statusCode < 500).length /
            monitor.logs.length) *
            100
        )
      : null;

  const handleToggle = () => {
    startTransition(async () => {
      setOptimisticActive(!optimisticActive);
      await toggleMonitor(monitor.id);
    });
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8, scale: 0.97 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        className={`bg-white/90 dark:bg-zinc-900/50 border rounded-xl shadow-sm backdrop-blur-md transition-colors duration-200 group ${
          optimisticActive
            ? "border-zinc-200/80 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700/60"
            : "border-zinc-200/40 dark:border-zinc-800/40 opacity-70"
        }`}
      >
        {/* Collapsed header — always visible */}
        <button
          onClick={() => setExpanded((x) => !x)}
          className="w-full text-left p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          aria-expanded={expanded}
          aria-label={`Toggle details for ${monitor.url}`}
        >
          <div className="flex items-start gap-3 min-w-0">
            {/* Status dot */}
            <span
              className={`mt-1.5 shrink-0 w-2 h-2 rounded-full transition-colors ${
                !optimisticActive
                  ? "bg-zinc-300 dark:bg-zinc-700"
                  : isUp
                  ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.45)]"
                  : "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.45)]"
              }`}
            />

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-mono text-sm font-semibold text-zinc-900 dark:text-zinc-200 truncate">
                  {monitor.url}
                </p>
                {!optimisticActive && (
                  <span className="text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded bg-sky-100/30 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500">
                    Paused
                  </span>
                )}
                {/* SSL expiry badge */}
                {monitor.sslExpiresAt ? (() => {
                  const expiresAt = new Date(monitor.sslExpiresAt);
                  const daysLeft = Math.floor((expiresAt.getTime() - Date.now()) / 86400000);
                  const isWarning = daysLeft <= 30;
                  const isExpired = daysLeft < 0;
                  return (
                    <span
                      className={`text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded border ${
                        isExpired
                          ? "border-rose-500/40 bg-rose-500/10 text-rose-400"
                          : isWarning
                          ? "border-amber-500/40 bg-amber-500/10 text-amber-400"
                          : "border-emerald-500/30 bg-emerald-500/8 text-emerald-500"
                      }`}
                      title={`SSL certificate expires ${expiresAt.toLocaleDateString()}`}
                    >
                      {isExpired ? "SSL EXPIRED" : `SSL ${daysLeft}d`}
                    </span>
                  );
                })() : null}
              </div>

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5">
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  Latency:{" "}
                  <span className="text-amber-600 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded font-mono">
                    {lastLog ? `${lastLog.latency}ms` : "—"}
                  </span>
                </span>
                <span className="text-zinc-300 dark:text-zinc-700 text-xs">•</span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  HTTP:{" "}
                  <span
                    className={`font-mono font-bold px-1.5 py-0.5 rounded ${
                      isUp
                        ? "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10"
                        : "text-rose-600 dark:text-rose-400 bg-rose-500/10"
                    }`}
                  >
                    {lastLog ? lastLog.statusCode : "Pending"}
                  </span>
                </span>
                {uptimePercent !== null && (
                  <>
                    <span className="text-zinc-300 dark:text-zinc-700 text-xs">•</span>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                      Uptime:{" "}
                      <span className="font-mono text-zinc-700 dark:text-zinc-300">{uptimePercent}%</span>
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right: sparkline + uptime ribbon + expand caret */}
          <div className="flex items-center gap-4 shrink-0">

            {/* SVG Latency Sparkline — last 10 log entries */}
            {(() => {
              const sparkLogs = chronoLogs.slice(-10);
              if (sparkLogs.length < 2) return null;
              const latencies = sparkLogs.map((l) => l.latency);
              const minL = Math.min(...latencies);
              const maxL = Math.max(...latencies);
              const range = maxL - minL || 1;
              const W = 72;
              const H = 28;
              const pad = 2;
              const step = (W - pad * 2) / (sparkLogs.length - 1);
              const points = sparkLogs.map((l, i) => {
                const x = pad + i * step;
                const y = pad + (1 - (l.latency - minL) / range) * (H - pad * 2);
                return `${x.toFixed(1)},${y.toFixed(1)}`;
              }).join(" ");
              const sparkColor = isUp ? "#10b981" : "#f43f5e"; // emerald-500 / rose-500
              return (
                <svg
                  width={W}
                  height={H}
                  viewBox={`0 0 ${W} ${H}`}
                  aria-hidden="true"
                  className="shrink-0 opacity-80 group-hover:opacity-100 transition-opacity"
                >
                  <polyline
                    points={points}
                    fill="none"
                    stroke={sparkColor}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ transition: "stroke 0.2s" }}
                  />
                  {/* Endpoint dot */}
                  {sparkLogs.length > 0 && (() => {
                    const last = sparkLogs[sparkLogs.length - 1];
                    const x = pad + (sparkLogs.length - 1) * step;
                    const y = pad + (1 - (last.latency - minL) / range) * (H - pad * 2);
                    return (
                      <circle cx={x.toFixed(1)} cy={y.toFixed(1)} r="2.5" fill={sparkColor} />
                    );
                  })()}
                </svg>
              );
            })()}

            {/* Bar uptime ribbon */}
            <div className="flex gap-[2px] items-end h-5">
              {Array.from({ length: Math.max(0, 12 - chronoLogs.length) }).map((_, i) => (
                <div key={`e-${i}`} className="w-[3px] h-3 rounded-full bg-zinc-100 dark:bg-zinc-800" />
              ))}
              {chronoLogs.map((log) => {
                const logOk = log.statusCode >= 200 && log.statusCode < 500;
                return (
                  <div
                    key={log.id}
                    className={`w-[3px] rounded-full transition-colors duration-200 ${
                      logOk
                        ? "bg-emerald-400/60 dark:bg-emerald-500/40 hover:bg-emerald-500"
                        : "bg-rose-400/60 dark:bg-rose-500/40 hover:bg-rose-500"
                    }`}
                    style={{ height: `${Math.min(20, Math.max(8, (log.latency / 500) * 20))}px` }}
                    title={`HTTP ${log.statusCode} · ${log.latency}ms`}
                  />
                );
              })}
            </div>
            <span
              className={`text-zinc-400 dark:text-zinc-600 transition-transform duration-200 text-xs ${
                expanded ? "rotate-180" : "rotate-0"
              }`}
            >
              ▼
            </span>
          </div>
        </button>

        {/* Expanded body */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              key="body"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4 border-t border-zinc-100 dark:border-zinc-800/60 pt-4 w-full min-w-0 overflow-hidden">
                {/* Latency chart */}
                <LatencyChart logs={monitor.logs} />

                {/* AI Root-Cause Diagnostic */}
                {lastLog?.aiDiagnostic && (
                  <div className="mt-3 flex items-start gap-2.5 bg-violet-500/5 border border-violet-500/15 rounded-lg px-3 py-2.5">
                    <span className="text-violet-400 text-xs mt-0.5 shrink-0">✦</span>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-violet-400/70 mb-0.5">AI Diagnosis</p>
                      <p className="text-xs text-zinc-400 dark:text-zinc-500 leading-relaxed">{lastLog.aiDiagnostic}</p>
                    </div>
                  </div>
                )}

                {/* Action row */}
                <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800/60">
                  {/* Pause / Resume toggle */}
                  <button
                    onClick={handleToggle}
                    className={`btn-shimmer flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-md border transition-all duration-200 ${
                      optimisticActive
                        ? "border-amber-200 dark:border-amber-900/60 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 hover:bg-amber-100 dark:hover:bg-amber-950/50"
                        : "border-emerald-200 dark:border-emerald-900/60 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-100 dark:hover:bg-emerald-950/50"
                    }`}
                  >
                    <span>{optimisticActive ? "⏸ Pause" : "▶ Resume"}</span>
                  </button>

                  {/* Edit */}
                  <button
                    onClick={(e) => { e.stopPropagation(); setEditOpen(true); }}
                    className="btn-shimmer flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 bg-sky-50/60 dark:bg-zinc-900/40 hover:bg-sky-100/40 dark:hover:bg-zinc-800 transition-colors"
                  >
                    ✎ Edit
                  </button>

                  {/* Hold to delete */}
                  <HoldToDelete monitorId={monitor.id} />

                  {/* Frequency badge */}
                  <span className="ml-auto text-xs text-zinc-400 dark:text-zinc-600 font-mono">
                    every {monitor.frequency}m
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Edit slide-over */}
      {editOpen && (
        <EditMonitorSheet
          monitorId={monitor.id}
          url={monitor.url}
          alertEmail={monitor.alertEmail}
          telegramChatId={monitor.telegramChatId}
          webhookUrl={monitor.webhookUrl}
          alertOnFailure={monitor.alertOnFailure}
          method={monitor.method}
          headers={monitor.headers}
          body={monitor.body}
          keywordCheck={monitor.keywordCheck}
          sslTrack={monitor.sslTrack}
          isHeartbeat={monitor.isHeartbeat}
          isPremium={isPremium}
          open={editOpen}
          onClose={() => setEditOpen(false)}
        />
      )}
    </>
  );
}
