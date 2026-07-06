"use client";

import React, { useState, useTransition } from "react";
import { createMonitor } from "@/app/actions/monitors";

export default function AddMonitorForm({ userId }: { userId: string }) {
  const [url, setUrl] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!url.trim()) {
      setError("Target URL is required.");
      return;
    }

    startTransition(async () => {
      try {
        const result = await createMonitor(url.trim(), userId, webhookUrl.trim() || undefined);
        if (result.success) {
          setUrl("");
          setWebhookUrl("");
          setSuccess(true);
          setTimeout(() => setSuccess(false), 4000);
        } else {
          setError(result.error ?? "Pipeline parameters validation mismatch.");
        }
      } catch {
        setError("Network error — could not reach server action.");
      }
    });
  };

  return (
    <section className="bg-white dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl p-5 mb-8 shadow-sm backdrop-blur-md relative z-10 transition-colors" aria-labelledby="form-title">

      {/* Section Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 id="form-title" className="text-sm font-semibold text-zinc-900 dark:text-zinc-300 uppercase tracking-widest">Provision Target Stream</h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">Register an HTTPS endpoint for automated uptime polling.</p>
        </div>
        <div className="w-6 h-6 rounded-md bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center shadow-sm" aria-hidden="true">
          <span className="text-zinc-500 dark:text-zinc-400 text-sm font-bold">+</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

          {/* Destination URL Input */}
          <div className="space-y-1.5">
            <label
              htmlFor="monitor-url"
              className="block text-xs font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400"
            >
              Destination URL <span className="text-rose-500/70">*</span>
            </label>
            <input
              id="monitor-url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://api.yourdomain.com/health"
              className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100 font-mono text-sm placeholder-zinc-450 dark:placeholder-zinc-650 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-700 focus:ring-1 focus:ring-zinc-400/30 dark:focus:ring-zinc-700/30 transition duration-150 disabled:opacity-45 disabled:cursor-not-allowed shadow-sm"
              required
              disabled={isPending}
              autoComplete="off"
              spellCheck={false}
            />
          </div>

          {/* Discord Webhook Input */}
          <div className="space-y-1.5">
            <label
              htmlFor="monitor-webhook"
              className="block text-xs font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400"
            >
              Discord Webhook <span className="text-zinc-400 dark:text-zinc-550">(optional)</span>
            </label>
            <input
              id="monitor-webhook"
              type="url"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://discord.com/api/webhooks/..."
              className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100 font-mono text-sm placeholder-zinc-450 dark:placeholder-zinc-650 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-700 focus:ring-1 focus:ring-zinc-400/30 dark:focus:ring-zinc-700/30 transition duration-150 disabled:opacity-45 disabled:cursor-not-allowed shadow-sm"
              disabled={isPending}
              autoComplete="off"
              spellCheck={false}
            />
          </div>
        </div>

        {/* Submit Action */}
        <div className="flex items-center justify-between pt-1 gap-3">
          <p className="text-sm text-zinc-500 dark:text-zinc-455">
            Monitoring runs every 10 minutes via serverless cron.
          </p>
          <button
            type="submit"
            disabled={isPending || !url.trim()}
            className="shrink-0 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-950 disabled:bg-zinc-100 dark:disabled:bg-zinc-900 disabled:text-zinc-400 dark:disabled:text-zinc-600 disabled:cursor-not-allowed font-semibold text-sm rounded-lg transition duration-150 cursor-pointer shadow-md flex items-center gap-2"
          >
            {isPending && (
              <span className="w-3 h-3 border border-zinc-400 border-t-zinc-200 dark:border-zinc-600 dark:border-t-zinc-300 rounded-full animate-spin" />
            )}
            {isPending ? "Deploying Node..." : "Activate Stream"}
          </button>
        </div>
      </form>

      {/* Success Toast */}
      {success && (
        <div className="mt-4 flex items-center gap-2.5 text-sm font-mono text-emerald-600 dark:text-emerald-450 bg-emerald-500/[0.04] border border-emerald-500/15 px-3.5 py-2.5 rounded-lg" role="status">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
          <span>
            <span className="text-emerald-700 dark:text-emerald-400 font-bold">ok //</span> Monitor stream deployed and queued for next cron cycle.
          </span>
        </div>
      )}

      {/* Error Toast */}
      {error && (
        <div className="mt-4 flex items-center gap-2.5 text-sm font-mono text-rose-600 dark:text-rose-400 bg-rose-500/[0.04] border border-rose-500/15 px-3.5 py-2.5 rounded-lg" role="alert">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-505 shrink-0" />
          <span>
            <span className="text-rose-700 dark:text-rose-400 font-bold">error //</span> {error}
          </span>
        </div>
      )}
    </section>
  );
}
