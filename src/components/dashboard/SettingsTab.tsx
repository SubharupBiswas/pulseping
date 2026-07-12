"use client";

import React, { useState, useTransition } from "react";
import {
  updateUserAlertThreshold,
  updateUserNotificationSettings,
  addAlertChannel,
  deleteAlertChannel,
} from "@/app/actions/billing";
import { toggleMonitorAlertChannel } from "@/app/actions/monitors";

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

  const handleToggleChannel = (monitorId: string, channelId: string, enabled: boolean) => {
    startTransition(async () => {
      await toggleMonitorAlertChannel(monitorId, channelId, enabled);
    });
  };

  const isLinked = (monitor: Monitor, channelId: string) => {
    return (monitor.alertChannels || []).some((ch) => ch.id === channelId);
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
            <input
              type="range"
              min={1}
              max={10}
              value={threshold}
              onChange={(e) => handleThresholdChange(Number(e.target.value))}
              className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full appearance-none accent-emerald-500"
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
          <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-3">
            <div className="space-y-1">
              <label htmlFor="provider-select" className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Provider</label>
              <select
                id="provider-select"
                value={newProvider}
                onChange={(e) => setNewProvider(e.target.value)}
                disabled={isPending}
                className="w-full px-3 py-1.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm text-zinc-900 dark:text-zinc-100 font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500/40 transition"
              >
                <option value="DISCORD">Discord</option>
                <option value="SLACK">Slack</option>
                <option value="EMAIL">Email</option>
                <option value="WEBHOOK">Webhook</option>
              </select>
            </div>

            <div className="space-y-1">
              <label htmlFor="channel-url" className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Destination URL</label>
              <input
                id="channel-url"
                type="url"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder="https://discord.com/api/webhooks/..."
                required
                disabled={isPending}
                className="w-full px-3 py-1.5 bg-zinc-50 dark:bg-zinc-955 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm font-mono text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-650 focus:outline-none focus:ring-1 focus:ring-emerald-500/40 transition"
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
                className="w-full px-3 py-1.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/40 transition"
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
              return (
                <div
                  key={monitor.id}
                  className="bg-white dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl p-5 shadow-sm space-y-4 mb-4"
                >
                  <p className="font-mono text-sm font-bold text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-800 pb-2 truncate">
                    {monitor.url}
                  </p>

                  {/* Channel multiselect grid */}
                  {alertChannels.length === 0 ? (
                    <p className="text-xs text-zinc-500 dark:text-zinc-450 italic">
                      No global alert channels configured. Add integration channels above.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {alertChannels.map((channel) => {
                        const active = isLinked(monitor, channel.id);
                        return (
                          <label
                            key={channel.id}
                            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg border transition-all cursor-pointer select-none ${
                              active
                                ? "bg-emerald-500/5 dark:bg-emerald-500/[0.02] border-emerald-500/30 text-emerald-700 dark:text-emerald-400"
                                : "bg-zinc-50/50 dark:bg-zinc-950/20 border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 hover:border-zinc-300 dark:hover:border-zinc-700"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={active}
                              disabled={isPending}
                              onChange={(e) => handleToggleChannel(monitor.id, channel.id, e.target.checked)}
                              className="w-4 h-4 rounded text-emerald-500 border-zinc-300 focus:ring-emerald-500/40 dark:bg-zinc-950 dark:border-zinc-800"
                            />
                            <div className="min-w-0 flex-1 truncate">
                              <span className="text-[9px] font-bold uppercase tracking-wider bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 px-1 rounded mr-1">
                                {channel.providerType}
                              </span>
                              <span className="text-xs font-semibold">
                                {channel.userFriendlyName || channel.destinationUrl}
                              </span>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  )}
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
