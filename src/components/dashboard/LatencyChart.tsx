"use client";

import React, { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

type LogEntry = {
  id: string;
  statusCode: number;
  latency: number;
  checkedAt: string;
};

type TimeFilter = "24h" | "7d" | "30d" | "90d";

const FILTERS: { label: string; value: TimeFilter }[] = [
  { label: "24h", value: "24h" },
  { label: "7d", value: "7d" },
  { label: "30d", value: "30d" },
  { label: "90d", value: "90d" },
];

function filterLogs(logs: LogEntry[], filter: TimeFilter): LogEntry[] {
  const now = Date.now();
  const ms: Record<TimeFilter, number> = {
    "24h": 24 * 60 * 60 * 1000,
    "7d":  7  * 24 * 60 * 60 * 1000,
    "30d": 30 * 24 * 60 * 60 * 1000,
    "90d": 90 * 24 * 60 * 60 * 1000,
  };
  const cutoff = now - ms[filter];
  return logs.filter((l) => new Date(l.checkedAt).getTime() >= cutoff);
}

function formatTick(epoch: number, filter: TimeFilter) {
  const d = new Date(epoch);
  if (filter === "24h") {
    return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
  }
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-zinc-900 dark:bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 shadow-xl text-xs">
      <p className="text-zinc-400 mb-1">{new Date(label).toLocaleString()}</p>
      <p className="text-emerald-400 font-bold font-mono">{payload[0].value}ms</p>
    </div>
  );
};

type Props = {
  logs: LogEntry[];
  isPremium?: boolean;
};

export default function LatencyChart({ logs, isPremium }: Props) {
  const [filter, setFilter] = useState<TimeFilter>("24h");

  const filtered = filterLogs(logs, filter);
  const chartData = [...filtered]
    .map((l) => {
      const latVal = typeof l.latency === "string" ? l.latency : String(l.latency);
      const cleanedLatency = parseFloat(latVal.replace(/[^\d.]/g, "")) || 0;
      const epoch = new Date(l.checkedAt).getTime();
      return {
        timestamp: epoch,
        latency: cleanedLatency,
        ok: l.statusCode >= 200 && l.statusCode < 500,
      };
    })
    .sort((a, b) => a.timestamp - b.timestamp);

  if (!chartData || chartData.length === 0) {
    if (!isPremium) {
      return (
        <div className="h-28 flex flex-col items-center justify-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-500 text-xs gap-1 py-4">
          <p className="font-semibold text-zinc-700 dark:text-zinc-300">Upgrade to a premium plan to view detailed timeline history</p>
          <p className="text-[10px] text-zinc-400 dark:text-zinc-500">Free accounts do not record operational latency timelines.</p>
        </div>
      );
    }
    return <div className="h-24 flex items-center justify-center text-xs text-zinc-500">Recalculating analytics timeline...</div>;
  }

  return (
    <div className="mt-4">
      {/* Time filter pill row */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
          Latency History
        </p>
        <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-900 rounded-lg p-0.5">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`text-xs font-semibold px-2.5 py-1 rounded-md transition-all duration-150 ${
                filter === f.value
                  ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm"
                  : "text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {chartData.length <= 1 ? (
        <div className="h-28 flex flex-col items-center justify-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-450 dark:text-zinc-550 text-xs font-mono">
          <span>No telemetry timeline data for this period</span>
          <span className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5">(Requires at least 2 check logs)</span>
        </div>
      ) : (
        <div className="h-28 chart-animate w-full min-w-0 overflow-hidden">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 4, right: 0, left: -24, bottom: 0 }}>
              <defs>
                <linearGradient id="latencyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#10b981" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(113,113,122,0.12)" />
              <XAxis
                dataKey="timestamp"
                type="number"
                domain={['dataMin', 'dataMax']}
                tickFormatter={(v: number) => formatTick(v, filter)}
                tick={{ fontSize: 10, fill: "#71717a" }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                type="number"
                tick={{ fontSize: 10, fill: "#71717a" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v: number) => `${v}ms`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="latency"
                stroke="#10b981"
                strokeWidth={2}
                fill="url(#latencyGrad)"
                dot={false}
                activeDot={{ r: 4, fill: "#10b981", strokeWidth: 0 }}
                animationDuration={800}
                animationEasing="ease-out"
                connectNulls
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
