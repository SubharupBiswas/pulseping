"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import PillTabNav from "./PillTabNav";
import BentoMetrics from "./BentoMetrics";
import MonitorCard from "./MonitorCard";
import IncidentsTab from "./IncidentsTab";
import SettingsTab from "./SettingsTab";
import AddMonitorForm from "@/components/AddMonitorForm";

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
  userId: string;
  plan: string;
  isPremium: boolean;
};

const TABS = [
  { id: "streams",   label: "Streams"   },
  { id: "incidents", label: "Incidents" },
  { id: "settings",  label: "Settings"  },
];

export default function DashboardShell({ monitors, userId, plan, isPremium }: Props) {
  const [activeTab, setActiveTab] = useState("streams");

  // Compute aggregate metrics
  const totalMonitors = monitors.length;
  const activeIncidents = monitors.filter((m) => {
    const last = m.logs[0];
    return last && (last.statusCode >= 500 || last.statusCode === 0);
  }).length;

  const allLatencies = monitors.flatMap((m) => m.logs.map((l) => l.latency)).filter(Boolean);
  const avgLatency = allLatencies.length > 0
    ? Math.round(allLatencies.reduce((a, b) => a + b, 0) / allLatencies.length)
    : null;

  const allLogs = monitors.flatMap((m) => m.logs);
  const uptimePercent =
    allLogs.length > 0
      ? Math.round(
          (allLogs.filter((l) => l.statusCode >= 200 && l.statusCode < 500).length / allLogs.length) * 100
        )
      : null;

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
            {totalMonitors} stream{totalMonitors !== 1 ? "s" : ""} active
          </span>
        )}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
        >
          {activeTab === "streams" && (
            <section aria-label="Active Monitoring Channels">
              {monitors.length === 0 ? (
                <div className="bg-white dark:bg-zinc-900/5 border border-dashed border-zinc-200 dark:border-zinc-900/80 rounded-xl p-12 text-center shadow-sm">
                  <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/50 flex items-center justify-center mx-auto mb-4">
                    <span className="text-zinc-400 dark:text-zinc-650 text-sm">⬡</span>
                  </div>
                  <p className="text-zinc-400 dark:text-zinc-500 text-sm font-mono">No streams provisioned.</p>
                  <p className="text-zinc-400 dark:text-zinc-650 text-xs mt-1">
                    Register an endpoint URL above to begin log collection.
                  </p>
                </div>
              ) : (
                <AnimatePresence>
                  <div className="space-y-3">
                    {monitors.map((monitor) => (
                      <MonitorCard key={monitor.id} monitor={monitor} />
                    ))}
                  </div>
                </AnimatePresence>
              )}
            </section>
          )}

          {activeTab === "incidents" && (
            <section aria-label="Incident Stream">
              <IncidentsTab monitors={monitors} />
            </section>
          )}

          {activeTab === "settings" && (
            <section aria-label="Notification Settings">
              <SettingsTab monitors={monitors} />
            </section>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
