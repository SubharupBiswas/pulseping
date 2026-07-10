"use client";

import React, { useState, useTransition } from "react";
import { updateMonitorAlert } from "@/app/actions/monitors";

type Monitor = {
  id: string;
  url: string;
  alertEmail: string | null;
  telegramChatId: string | null;
};

type Props = {
  monitors: Monitor[];
};

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={enabled}
      onClick={() => onChange(!enabled)}
      className={`relative w-10 h-5 rounded-full border transition-all duration-200 shrink-0 ${
        enabled
          ? "bg-emerald-500 border-emerald-500"
          : "bg-zinc-200 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700"
      }`}
    >
      <span
        className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${
          enabled ? "translate-x-5" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

export default function SettingsTab({ monitors }: Props) {
  const [globalEmail, setGlobalEmail] = useState(true);
  const [globalTelegram, setGlobalTelegram] = useState(false);
  const [threshold, setThreshold] = useState(3);

  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const [monitorSettings, setMonitorSettings] = useState<
    Record<string, { email: string; telegram: string }>
  >(
    Object.fromEntries(
      monitors.map((m) => [m.id, { email: m.alertEmail ?? "", telegram: m.telegramChatId ?? "" }])
    )
  );

  const handleSaveMonitor = (monitorId: string) => {
    const s = monitorSettings[monitorId];
    setSaving(monitorId);
    startTransition(async () => {
      await updateMonitorAlert(monitorId, s.email || null, s.telegram || null);
      setSaving(null);
      setSaved(monitorId);
      setTimeout(() => setSaved(null), 2000);
    });
  };

  return (
    <div className="space-y-8">
      {/* Global toggles */}
      <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl p-5 shadow-sm">
        <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-4">Global Notification Settings</h3>

        <div className="space-y-4">
          {/* Email toggle */}
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Email Alerts (Resend)</p>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
                Send downtime emails via Resend transactional API.
              </p>
            </div>
            <Toggle enabled={globalEmail} onChange={setGlobalEmail} />
          </div>

          {/* Telegram toggle */}
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Telegram Bot Alerts</p>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
                Push incidents to a Telegram chat via bot API.
              </p>
            </div>
            <Toggle enabled={globalTelegram} onChange={setGlobalTelegram} />
          </div>

          {/* Failure threshold */}
          <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Alert Threshold</p>
                <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
                  Trigger alert after this many consecutive failures.
                </p>
              </div>
              <span className="text-sm font-bold font-mono text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-lg">
                {threshold}×
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full appearance-none accent-emerald-500"
            />
            <div className="flex justify-between text-xs text-zinc-400 dark:text-zinc-600 mt-1">
              <span>1 (immediate)</span>
              <span>10 (conservative)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Per-monitor alert config */}
      {monitors.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-3">
            Per-Monitor Notification Routing
          </h3>
          <div className="space-y-3">
            {monitors.map((monitor) => {
              const settings = monitorSettings[monitor.id];
              return (
                <div
                  key={monitor.id}
                  className="bg-white dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl p-4 shadow-sm"
                >
                  <p className="font-mono text-xs font-semibold text-zinc-600 dark:text-zinc-400 truncate mb-3">
                    {monitor.url}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                        Alert Email
                      </label>
                      <input
                        type="email"
                        value={settings?.email ?? ""}
                        onChange={(e) =>
                          setMonitorSettings((prev) => ({
                            ...prev,
                            [monitor.id]: { ...prev[monitor.id], email: e.target.value },
                          }))
                        }
                        placeholder="alerts@yourdomain.com"
                        className="w-full px-3 py-1.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/40 focus:border-emerald-500/50 transition"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                        Telegram Chat ID
                      </label>
                      <input
                        type="text"
                        value={settings?.telegram ?? ""}
                        onChange={(e) =>
                          setMonitorSettings((prev) => ({
                            ...prev,
                            [monitor.id]: { ...prev[monitor.id], telegram: e.target.value },
                          }))
                        }
                        placeholder="-1001234567890"
                        className="w-full px-3 py-1.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm font-mono text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/40 focus:border-emerald-500/50 transition"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-3">
                    {saved === monitor.id && (
                      <span className="text-xs text-emerald-600 dark:text-emerald-400 font-mono">
                        ✓ Saved
                      </span>
                    )}
                    <button
                      onClick={() => handleSaveMonitor(monitor.id)}
                      disabled={saving === monitor.id}
                      className="text-xs font-semibold px-3 py-1.5 rounded-md bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-white transition disabled:opacity-60 flex items-center gap-1.5"
                    >
                      {saving === monitor.id && (
                        <span className="w-3 h-3 border border-white/40 border-t-white rounded-full animate-spin" />
                      )}
                      Save
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {monitors.length === 0 && (
        <div className="text-center py-10">
          <p className="text-sm text-zinc-400 dark:text-zinc-600">No monitors provisioned yet.</p>
          <p className="text-xs text-zinc-400 dark:text-zinc-600 mt-1">Add a monitor stream to configure notification routing.</p>
        </div>
      )}
    </div>
  );
}
