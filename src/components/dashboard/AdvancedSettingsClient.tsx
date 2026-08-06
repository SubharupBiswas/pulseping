"use client";

import React, { useState, useEffect, useTransition } from "react";

interface AlertChannel {
  id: string;
  providerType: string;
  destinationUrl: string;
  userFriendlyName: string | null;
  createdAt: string;
}

interface Props {
  initialChannels: AlertChannel[];
  plan: string;
}

const CHANNEL_TYPES = ["DISCORD", "SLACK", "WEBHOOK", "EMAIL"];

export default function AdvancedSettingsClient({ initialChannels, plan }: Props) {
  const [channels, setChannels] = useState<AlertChannel[]>(initialChannels);
  const [showChannelModal, setShowChannelModal] = useState(false);
  const [showHeaderModal, setShowHeaderModal] = useState(false);
  const [channelType, setChannelType] = useState("DISCORD");
  const [channelUrl, setChannelUrl] = useState("");
  const [channelName, setChannelName] = useState("");
  const [channelError, setChannelError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Header preset state
  const [headerKey, setHeaderKey] = useState("");
  const [headerValue, setHeaderValue] = useState("");
  const [headerPresets, setHeaderPresets] = useState<Array<{ key: string; value: string }>>([]);
  const [headerError, setHeaderError] = useState<string | null>(null);

  // Load header presets from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("pulseping_header_presets");
      if (stored) setHeaderPresets(JSON.parse(stored));
    } catch (_) {}
  }, []);

  const handleAddChannel = () => {
    setChannelError(null);
    if (!channelUrl.trim() || channelUrl.trim().length < 8) {
      setChannelError("Please enter a valid webhook URL.");
      return;
    }

    startTransition(async () => {
      try {
        const res = await fetch("/api/alert-channels", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: channelType,
            url: channelUrl.trim(),
            name: channelName.trim() || null,
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          setChannelError(data.error || "Failed to add alert channel.");
          return;
        }

        setChannels((prev) => [
          {
            id: data.channel.id,
            providerType: data.channel.providerType,
            destinationUrl: data.channel.destinationUrl,
            userFriendlyName: data.channel.userFriendlyName ?? null,
            createdAt: data.channel.createdAt,
          },
          ...prev,
        ]);

        setChannelUrl("");
        setChannelName("");
        setShowChannelModal(false);
      } catch {
        setChannelError("Network error. Please try again.");
      }
    });
  };

  const handleAddHeader = () => {
    setHeaderError(null);
    if (!headerKey.trim()) {
      setHeaderError("Header name is required.");
      return;
    }
    const updated = [...headerPresets, { key: headerKey.trim(), value: headerValue.trim() }];
    setHeaderPresets(updated);
    localStorage.setItem("pulseping_header_presets", JSON.stringify(updated));
    setHeaderKey("");
    setHeaderValue("");
  };

  const handleRemoveHeader = (idx: number) => {
    const updated = headerPresets.filter((_, i) => i !== idx);
    setHeaderPresets(updated);
    localStorage.setItem("pulseping_header_presets", JSON.stringify(updated));
  };

  const CHANNEL_ICONS: Record<string, string> = {
    DISCORD: "💬",
    SLACK: "⚡",
    WEBHOOK: "🔗",
    EMAIL: "✉️",
  };

  return (
    <>
      {/* Configurations Card */}
      <div className="bg-white/90 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl p-6 shadow-sm backdrop-blur-md space-y-6">

        {/* Alert Channels section */}
        <div>
          <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-2">Multi-Channel Webhooks</h4>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed mb-4">
            Integrate Slack, Discord, or custom endpoints to receive alert notifications within seconds of a monitor failure.
          </p>

          {channels.length > 0 && (
            <div className="space-y-2 mb-4">
              {channels.map((ch) => (
                <div
                  key={ch.id}
                  className="flex items-center gap-3 bg-sky-50/60 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700/60 rounded-lg px-3 py-2.5"
                >
                  <span className="text-base">{CHANNEL_ICONS[ch.providerType] ?? "🔔"}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 truncate">
                      {ch.userFriendlyName || ch.providerType}
                    </p>
                    <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono truncate">{ch.destinationUrl}</p>
                  </div>
                  <span className="text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full shrink-0">
                    {ch.providerType}
                  </span>
                </div>
              ))}
            </div>
          )}

          <button
            id="add-alert-channel-btn"
            onClick={() => { setShowChannelModal(true); setChannelError(null); }}
            className="text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-950 px-4 py-2 rounded-lg transition shadow-sm active:scale-95"
          >
            + Add Alert Channel
          </button>
        </div>

        <div className="border-t border-zinc-150 dark:border-zinc-800/60 pt-6">
          <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-2">Request Header Presets</h4>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed mb-4">
            Bind Authorization tokens, custom cookies, or developer context parameters to outbound test requests.
          </p>

          {headerPresets.length > 0 && (
            <div className="space-y-1.5 mb-4">
              {headerPresets.map((h, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 bg-sky-50/60 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700/60 rounded-lg px-3 py-2"
                >
                  <code className="text-xs font-mono text-emerald-700 dark:text-emerald-400 flex-shrink-0">{h.key}:</code>
                  <code className="text-xs font-mono text-zinc-600 dark:text-zinc-300 truncate flex-1">{h.value || "(empty)"}</code>
                  <button
                    onClick={() => handleRemoveHeader(idx)}
                    className="text-red-400 hover:text-red-600 text-xs font-bold ml-1 shrink-0 transition"
                    aria-label={`Remove ${h.key} header`}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          <button
            id="manage-header-presets-btn"
            onClick={() => { setShowHeaderModal(true); setHeaderError(null); }}
            className="text-xs font-semibold border border-zinc-200 dark:border-zinc-800 px-4 py-2 rounded-lg hover:bg-sky-50 dark:hover:bg-zinc-800 transition active:scale-95"
          >
            {headerPresets.length > 0 ? "Manage Header Presets" : "Add Custom Header Preset"}
          </button>
        </div>
      </div>

      {/* Add Alert Channel Modal */}
      {showChannelModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setShowChannelModal(false); }}
        >
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in fade-in slide-in-from-bottom-4 duration-200">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Add Alert Channel</h2>
              <button
                onClick={() => setShowChannelModal(false)}
                className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition text-lg leading-none"
                aria-label="Close"
              >✕</button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-1.5">
                  Channel Type
                </label>
                <div className="flex flex-wrap gap-2">
                  {CHANNEL_TYPES.map((t) => (
                    <button
                      key={t}
                      onClick={() => setChannelType(t)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition ${
                        channelType === t
                          ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-transparent"
                          : "border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-sky-50 dark:hover:bg-zinc-800"
                      }`}
                    >
                      {CHANNEL_ICONS[t]} {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-1.5">
                  {channelType === "EMAIL" ? "Email Address" : "Webhook URL"}
                </label>
                <input
                  id="alert-channel-url-input"
                  type={channelType === "EMAIL" ? "email" : "url"}
                  value={channelUrl}
                  onChange={(e) => setChannelUrl(e.target.value)}
                  placeholder={
                    channelType === "DISCORD"
                      ? "https://discord.com/api/webhooks/…"
                      : channelType === "SLACK"
                      ? "https://hooks.slack.com/services/…"
                      : channelType === "EMAIL"
                      ? "alerts@yourdomain.com"
                      : "https://your-webhook-endpoint.com/notify"
                  }
                  className="w-full bg-sky-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-1.5">
                  Friendly Name <span className="text-zinc-400 normal-case font-normal">(optional)</span>
                </label>
                <input
                  id="alert-channel-name-input"
                  type="text"
                  value={channelName}
                  onChange={(e) => setChannelName(e.target.value)}
                  placeholder="e.g. Production Alerts · DevOps Slack"
                  maxLength={50}
                  className="w-full bg-sky-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition"
                />
              </div>

              {channelError && (
                <p className="text-xs text-red-500 font-semibold bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                  {channelError}
                </p>
              )}
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setShowChannelModal(false)}
                className="flex-1 text-sm font-semibold border border-zinc-200 dark:border-zinc-700 px-4 py-2.5 rounded-xl hover:bg-sky-50 dark:hover:bg-zinc-800 transition text-zinc-700 dark:text-zinc-300"
              >
                Cancel
              </button>
              <button
                id="submit-alert-channel-btn"
                onClick={handleAddChannel}
                disabled={isPending}
                className="flex-1 text-sm font-bold bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-950 disabled:opacity-50 text-white px-4 py-2.5 rounded-xl shadow transition active:scale-95"
              >
                {isPending ? "Saving…" : "Add Channel"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Header Presets Modal */}
      {showHeaderModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setShowHeaderModal(false); }}
        >
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl w-full max-w-lg p-6 animate-in fade-in slide-in-from-bottom-4 duration-200">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Request Header Presets</h2>
              <button
                onClick={() => setShowHeaderModal(false)}
                className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition text-lg leading-none"
                aria-label="Close"
              >✕</button>
            </div>

            {/* Existing presets */}
            {headerPresets.length > 0 && (
              <div className="space-y-1.5 mb-5">
                {headerPresets.map((h, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-sky-50/60 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700/60 rounded-lg px-3 py-2">
                    <code className="text-xs font-mono text-emerald-700 dark:text-emerald-400 shrink-0">{h.key}:</code>
                    <code className="text-xs font-mono text-zinc-600 dark:text-zinc-300 truncate flex-1">{h.value || "(empty)"}</code>
                    <button onClick={() => handleRemoveHeader(idx)} className="text-red-400 hover:text-red-600 text-xs font-bold transition shrink-0">✕</button>
                  </div>
                ))}
              </div>
            )}

            {/* Add new header */}
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">Add New Header</p>
              <div className="flex gap-2">
                <input
                  id="header-key-input"
                  type="text"
                  value={headerKey}
                  onChange={(e) => setHeaderKey(e.target.value)}
                  placeholder="Header-Name"
                  className="flex-1 bg-sky-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition"
                />
                <input
                  id="header-value-input"
                  type="text"
                  value={headerValue}
                  onChange={(e) => setHeaderValue(e.target.value)}
                  placeholder="value"
                  className="flex-1 bg-sky-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition"
                />
                <button
                  id="add-header-preset-btn"
                  onClick={handleAddHeader}
                  className="text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg transition active:scale-95 shrink-0"
                >
                  Add
                </button>
              </div>
              {headerError && (
                <p className="text-xs text-red-500 font-semibold bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                  {headerError}
                </p>
              )}
            </div>

            <div className="mt-6">
              <button
                onClick={() => setShowHeaderModal(false)}
                className="w-full text-sm font-semibold border border-zinc-200 dark:border-zinc-700 px-4 py-2.5 rounded-xl hover:bg-sky-50 dark:hover:bg-zinc-800 transition text-zinc-700 dark:text-zinc-300"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
