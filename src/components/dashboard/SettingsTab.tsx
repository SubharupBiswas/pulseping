"use client";

import React, { useState, useTransition } from "react";
import {
  updateUserAlertThreshold,
  updateUserNotificationSettings,
  addAlertChannel,
  deleteAlertChannel,
} from "@/app/actions/billing";
import { updateMonitorAlert } from "@/app/actions/monitors";
import { motion } from "framer-motion";

type AlertChannel = {
  id: string;
  providerType: string;
  destinationUrl: string;
  userFriendlyName: string | null;
};

type Monitor = {
  id: string;
  url: string;
  alertEmail: string | null;
  telegramChatId: string | null;
  webhookUrl: string | null;
  alertOnFailure: boolean;
  alertChannels: AlertChannel[];
};

type Props = {
  monitors: Monitor[];
  userId: string;
  initialThreshold: number;
  emailNotificationsEnabled: boolean;
  telegramNotificationsEnabled: boolean;
  alertChannels: AlertChannel[];
};

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      type="button"
      aria-checked={enabled}
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
        enabled ? "bg-emerald-500" : "bg-zinc-200 dark:bg-zinc-800"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          enabled ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

export default function SettingsTab({
  monitors,
  userId,
  initialThreshold,
  emailNotificationsEnabled,
  telegramNotificationsEnabled,
  alertChannels,
}: Props) {
  const [globalEmail, setGlobalEmail] = useState(emailNotificationsEnabled);
  const [globalTelegram, setGlobalTelegram] = useState(telegramNotificationsEnabled);
  const [threshold, setThreshold] = useState(initialThreshold ?? 3);

  // New Alert Channel Form State
  const [newProvider, setNewProvider] = useState("DISCORD");
  const [newUrl, setNewUrl] = useState("");
  const [newName, setNewName] = useState("");

  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleThresholdChange = (val: number) => {
    setThreshold(val);
    startTransition(async () => {
      await updateUserAlertThreshold(userId, val);
    });
  };

  const handleGlobalToggle = (emailVal: boolean, telegramVal: boolean) => {
    setGlobalEmail(emailVal);
    setGlobalTelegram(telegramVal);
    startTransition(async () => {
      await updateUserNotificationSettings(userId, emailVal, telegramVal);
    });
  };

  const handleAddChannel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl.trim()) return;

    startTransition(async () => {
      const res = await addAlertChannel(newProvider, newUrl.trim(), newName.trim() || null);
      if (res.success) {
        setNewUrl("");
        setNewName("");
      }
    });
  };

  const handleDeleteChannel = (channelId: string) => {
    startTransition(async () => {
      await deleteAlertChannel(channelId);
    });
  };

  const getProviderConfig = (provider: string) => {
    switch (provider) {
      case "DISCORD":
        return {
          label: "Discord Webhook URL",
          placeholder: "https://discord.com/api/webhooks/...",
          type: "url",
        };
      case "SLACK":
        return {
          label: "Slack Webhook URL",
          placeholder: "https://hooks.slack.com/services/...",
          type: "url",
        };
      case "EMAIL":
        return {
          label: "Destination Email Address (No API required)",
          placeholder: "alerts@yourcompany.com",
          type: "email",
        };
      case "WEBHOOK":
      default:
        return {
          label: "Custom Endpoint URL",
          placeholder: "https://api.yourdomain.com/v1/alerts",
          type: "url",
        };
    }
  };

  // Local state for per-monitor inputs
  const [monitorInputs, setMonitorInputs] = useState<
    Record<string, { email: string; telegram: string; webhook: string }>
  >(
    Object.fromEntries(
      monitors.map((m) => [
        m.id,
        {
          email: m.alertEmail ?? "",
          telegram: m.telegramChatId ?? "",
          webhook: m.webhookUrl ?? "",
        },
      ])
    )
  );

  const handleSaveMonitor = (monitorId: string) => {
    const vals = monitorInputs[monitorId];
    setSaving(monitorId);
    startTransition(async () => {
      await updateMonitorAlert(
        monitorId,
        vals.email.trim() || null,
        vals.telegram.trim() || null,
        vals.webhook.trim() || null
      );
      setSaving(null);
      setSaved(monitorId);
      setTimeout(() => setSaved(null), 2000);
    });
  };

  return (
    <div key="settings-tab-main-card" className="space-y-8">
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
            <Toggle enabled={globalEmail} onChange={(v) => handleGlobalToggle(v, globalTelegram)} />
          </div>

          {/* Telegram toggle */}
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Telegram Bot Alerts</p>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
                Push incidents to a Telegram chat via bot API.
              </p>
            </div>
            <Toggle enabled={globalTelegram} onChange={(v) => handleGlobalToggle(globalEmail, v)} />
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
            <motion.input
              type="range"
              min={1}
              max={10}
              value={threshold}
              onChange={(e) => handleThresholdChange(Number(e.target.value))}
              layout={false}
              key="global-threshold-slider-input"
              className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-855 rounded-full appearance-none accent-emerald-500"
            />
            <div className="flex justify-between text-xs text-zinc-400 dark:text-zinc-650 mt-1">
              <span>1 (immediate)</span>
              <span>10 (conservative)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Integration Channels Deck */}
      <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl p-5 shadow-sm">
        <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-2">Integration Channels</h3>
        <p className="text-xs text-zinc-400 dark:text-zinc-500 mb-6">
          Connect Discord webhooks, Slack webhooks, or generic API callback endpoints.
        </p>

        {/* Existing channels list */}
        {alertChannels.length === 0 ? (
          <p className="text-xs text-zinc-500 dark:text-zinc-400 italic mb-6">No integration channels connected yet.</p>
        ) : (
          <div className="space-y-3 mb-6">
            {alertChannels.map((channel) => (
              <div
                key={channel.id}
                className="flex items-center justify-between gap-4 p-3 bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800 rounded-lg"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400">
                      {channel.providerType}
                    </span>
                    {channel.userFriendlyName && (
                      <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                        {channel.userFriendlyName}
                      </span>
                    )}
                  </div>
                  <p className="font-mono text-[10px] text-zinc-500 dark:text-zinc-400 truncate mt-1">
                    {channel.destinationUrl}
                  </p>
                </div>

                <button
                  onClick={() => handleDeleteChannel(channel.id)}
                  disabled={isPending}
                  className="p-1.5 text-zinc-400 hover:text-rose-500 transition-colors rounded hover:bg-rose-500/10"
                  title="Remove integration channel"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add Channel Form */}
        <form onSubmit={handleAddChannel} className="border-t border-zinc-100 dark:border-zinc-800 pt-5 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">Connect New Channel</h4>
          <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-3">
            <div className="space-y-1">
              <label htmlFor="provider-select" className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Provider</label>
              <select
                id="provider-select"
                value={newProvider}
                onChange={(e) => setNewProvider(e.target.value)}
                disabled={isPending}
                className="text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 placeholder-zinc-400 dark:placeholder-zinc-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/40 rounded-xl text-sm w-full p-2.5 outline-none transition font-medium block"
              >
                <option value="DISCORD" className="bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">Discord</option>
                <option value="SLACK" className="bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">Slack</option>
                <option value="EMAIL" className="bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">Email</option>
                <option value="WEBHOOK" className="bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">Webhook</option>
              </select>
            </div>

            <div className="space-y-1">
              <label htmlFor="channel-url" className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                {getProviderConfig(newProvider).label}
              </label>
              <input
                id="channel-url"
                type={getProviderConfig(newProvider).type}
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder={getProviderConfig(newProvider).placeholder}
                required
                disabled={isPending}
                className="text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 placeholder-zinc-400 dark:placeholder-zinc-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/40 rounded-xl text-sm w-full p-2.5 outline-none transition font-medium block font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3 items-end">
            <div className="space-y-1">
              <label htmlFor="channel-name" className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Friendly Label <span className="text-zinc-400 dark:text-zinc-550">(optional)</span></label>
              <input
                id="channel-name"
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Production Alerts"
                disabled={isPending}
                className="text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 placeholder-zinc-400 dark:placeholder-zinc-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/40 rounded-xl text-sm w-full p-2.5 outline-none transition font-medium block"
              />
            </div>

            <button
              type="submit"
              disabled={isPending || !newUrl.trim()}
              className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-950 disabled:bg-zinc-100 dark:disabled:bg-zinc-900 disabled:text-zinc-400 dark:disabled:text-zinc-600 disabled:cursor-not-allowed font-semibold text-xs rounded-lg transition shadow-md flex items-center gap-1.5"
            >
              {isPending ? "Connecting..." : "Add Channel"}
            </button>
          </div>
        </form>
      </div>

      {/* Per-monitor alert config */}
      {monitors.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 pl-1">
            Per-Monitor Notification Routing
          </h3>
          <div className="space-y-4">
            {monitors.map((monitor) => {
              const vals = monitorInputs[monitor.id] || { email: "", telegram: "", webhook: "" };
              return (
                <div
                  key={monitor.id}
                  className="bg-white dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl p-5 shadow-sm space-y-4 mb-4"
                >
                  <p className="font-mono text-sm font-bold text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-800 pb-2 truncate">
                    {monitor.url}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block mb-1.5">
                        ALERT EMAIL
                      </label>
                      <input
                        type="email"
                        value={vals.email}
                        onChange={(e) =>
                          setMonitorInputs((prev) => ({
                            ...prev,
                            [monitor.id]: { ...prev[monitor.id], email: e.target.value },
                          }))
                        }
                        placeholder="alerts@yourdomain.com"
                        className="text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 placeholder-zinc-400 dark:placeholder-zinc-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/40 rounded-xl text-sm w-full p-2.5 outline-none transition"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block mb-1.5">
                        WEBHOOK URL
                      </label>
                      <input
                        type="url"
                        value={vals.webhook}
                        onChange={(e) =>
                          setMonitorInputs((prev) => ({
                            ...prev,
                            [monitor.id]: { ...prev[monitor.id], webhook: e.target.value },
                          }))
                        }
                        placeholder="https://discord.com/api/webhooks/..."
                        className="text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 placeholder-zinc-400 dark:placeholder-zinc-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/40 rounded-xl text-sm w-full p-2.5 outline-none transition font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block mb-1.5">
                        TELEGRAM CHAT ID
                      </label>
                      <input
                        type="text"
                        value={vals.telegram}
                        onChange={(e) =>
                          setMonitorInputs((prev) => ({
                            ...prev,
                            [monitor.id]: { ...prev[monitor.id], telegram: e.target.value },
                          }))
                        }
                        placeholder="-1001234567890"
                        className="text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 placeholder-zinc-400 dark:placeholder-zinc-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/40 rounded-xl text-sm w-full p-2.5 outline-none transition font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                    {saved === monitor.id && (
                      <span className="text-xs text-emerald-600 dark:text-emerald-400 font-mono">
                        ✓ Saved
                      </span>
                    )}
                    <button
                      onClick={() => handleSaveMonitor(monitor.id)}
                      disabled={saving === monitor.id}
                      className="text-xs font-semibold px-4 py-2 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-955 hover:bg-zinc-800 dark:hover:bg-white transition disabled:opacity-60 flex items-center gap-1.5"
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
          <p className="text-sm text-zinc-400 dark:text-zinc-650">No monitors provisioned yet.</p>
          <p className="text-xs text-zinc-400 dark:text-zinc-650 mt-1">Add a monitor stream to configure notification routing.</p>
        </div>
      )}
    </div>
  );
}
