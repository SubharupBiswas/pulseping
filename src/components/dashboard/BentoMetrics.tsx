"use client";

import React, { useRef, useCallback } from "react";
import { motion } from "framer-motion";

type BentoCardProps = {
  children: React.ReactNode;
  className?: string;
  colSpan?: string;
  rowSpan?: string;
  index?: number;
};

function BentoCard({ children, className = "", colSpan = "", rowSpan = "", index = 0 }: BentoCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty("--mouse-x", `${x}%`);
    card.style.setProperty("--mouse-y", `${y}%`);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 220,
        damping: 22,
        delay: index * 0.07,
      }}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      style={{ "--mouse-x": "50%", "--mouse-y": "50%" } as React.CSSProperties}
      className={`bento-card group bg-white dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl shadow-sm backdrop-blur-md transition-all duration-200 hover:border-zinc-300 dark:hover:border-zinc-700/70 hover:shadow-md ${colSpan} ${rowSpan} ${className}`}
    >
      {/* hover.dev border-glow overlay */}
      <div className="bento-card-border" aria-hidden="true" />
      <div className="relative z-10 h-full">{children}</div>
    </motion.div>
  );
}

type BentoMetricsProps = {
  totalMonitors: number;
  activeIncidents: number;
  avgLatency: number | null;
  uptimePercent: number | null;
  plan: string;
};

export default function BentoMetrics({
  totalMonitors,
  activeIncidents,
  avgLatency,
  uptimePercent,
  plan,
}: BentoMetricsProps) {
  const isHealthy = activeIncidents === 0;
  const monitorLimit = plan === "FREE" ? "/ 2 free" : plan === "PRO" ? "/ 20 limit" : "/ ∞";

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 grid-rows-2 gap-3 mb-8 auto-rows-fr">
      {/* Large: System Status — col 1-2, row 1-2 */}
      <BentoCard index={0} colSpan="col-span-2" rowSpan="row-span-2" className="p-5 flex flex-col justify-between min-h-[130px]">
        <div>
          <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-3">
            System Status
          </p>
          <div className="flex items-center gap-3">
            <motion.span
              animate={{
                scale: isHealthy ? [1, 1.2, 1] : [1, 1.1, 1],
                opacity: isHealthy ? [1, 0.6, 1] : 1,
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className={`w-3 h-3 rounded-full shrink-0 ${
                isHealthy
                  ? "bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]"
                  : "bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.5)]"
              }`}
            />
            <span
              className={`text-lg font-bold tracking-tight ${
                isHealthy
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-rose-600 dark:text-rose-400"
              }`}
            >
              {isHealthy ? "All Systems Operational" : "Degradation Detected"}
            </span>
          </div>
        </div>
        <div className="flex items-end justify-between mt-4">
          <div>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1">Active Incidents</p>
            <span
              className={`text-3xl font-bold tracking-tight ${
                activeIncidents > 0
                  ? "text-rose-600 dark:text-rose-400"
                  : "text-zinc-800 dark:text-zinc-200"
              }`}
            >
              {activeIncidents}
            </span>
          </div>
          <div className="text-right">
            <p className="text-xs text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1">Plan</p>
            <span className="text-sm font-bold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider">{plan}</span>
          </div>
        </div>
      </BentoCard>

      {/* Active Streams */}
      <BentoCard index={1} colSpan="col-span-1" className="p-4 flex flex-col justify-between">
        <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-2">
          Streams
        </p>
        <div className="flex items-baseline gap-1.5">
          <span className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
            {totalMonitors}
          </span>
          <span className="text-sm text-zinc-400 dark:text-zinc-500 font-mono">{monitorLimit}</span>
        </div>
      </BentoCard>

      {/* Avg Latency */}
      <BentoCard index={2} colSpan="col-span-1" className="p-4 flex flex-col justify-between">
        <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-2">
          Avg Latency
        </p>
        <div className="flex items-baseline gap-1">
          <span
            className={`text-3xl font-bold tracking-tight ${
              avgLatency === null
                ? "text-zinc-400 dark:text-zinc-600"
                : avgLatency < 300
                ? "text-emerald-600 dark:text-emerald-400"
                : avgLatency < 800
                ? "text-amber-600 dark:text-amber-400"
                : "text-rose-600 dark:text-rose-400"
            }`}
          >
            {avgLatency !== null ? avgLatency : "—"}
          </span>
          {avgLatency !== null && (
            <span className="text-sm text-zinc-400 dark:text-zinc-500 font-mono">ms</span>
          )}
        </div>
      </BentoCard>

      {/* Uptime % */}
      <BentoCard index={3} colSpan="col-span-2" className="p-4 flex flex-col justify-between">
        <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-2">
          Overall Uptime
        </p>
        <div className="flex items-center gap-4">
          <span
            className={`text-3xl font-bold tracking-tight ${
              uptimePercent === null
                ? "text-zinc-400 dark:text-zinc-600"
                : uptimePercent >= 99
                ? "text-emerald-600 dark:text-emerald-400"
                : uptimePercent >= 95
                ? "text-amber-600 dark:text-amber-400"
                : "text-rose-600 dark:text-rose-400"
            }`}
          >
            {uptimePercent !== null ? `${uptimePercent}%` : "—"}
          </span>
          {uptimePercent !== null && (
            <div className="flex-1 h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${
                  uptimePercent >= 99
                    ? "bg-emerald-500"
                    : uptimePercent >= 95
                    ? "bg-amber-500"
                    : "bg-rose-500"
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${uptimePercent}%` }}
                transition={{ duration: 0.9, ease: "easeOut", delay: 0.3 }}
              />
            </div>
          )}
        </div>
      </BentoCard>
    </div>
  );
}
