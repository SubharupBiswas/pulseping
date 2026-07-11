"use client";

import React, { useState, useTransition } from "react";
import { updateMonitorAlert } from "@/app/actions/monitors";

type Props = {
  monitorId: string;
  url: string;
  alertEmail: string | null;
  telegramChatId: string | null;
  alertOnFailure: boolean;
  open: boolean;
  onClose: () => void;
};

export default function EditMonitorSheet({ monitorId, url, alertEmail, telegramChatId, alertOnFailure: initialAlertOnFailure, open, onClose }: Props) {
  const [email, setEmail] = useState(alertEmail ?? "");
  const [telegram, setTelegram] = useState(telegramChatId ?? "");
  const [alertOnFailure, setAlertOnFailure] = useState(initialAlertOnFailure);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setError(null);
    setSaved(false);
    startTransition(async () => {
      const result = await updateMonitorAlert(
        monitorId,
        email.trim() || null,
        telegram.trim() || null,
        alertOnFailure
      );
      if (result.success) {
        setSaved(true);
        setTimeout(() => { setSaved(false); onClose(); }, 1200);
      } else {
        setError(result.error ?? "Failed to save.");
      }
    });
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-sm bg-white dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-800 z-50 flex flex-col shadow-2xl sheet-enter">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 dark:border-zinc-800">
          <div>
            <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Edit Monitor</h2>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 font-mono truncate max-w-[200px] mt-0.5">{url}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-6 space-y-5">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
              Alert Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alerts@yourdomain.com"
              disabled={isPending}
              className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/40 focus:border-emerald-500/50 transition disabled:opacity-50"
            />
            <p className="text-xs text-zinc-400 dark:text-zinc-600">
              Receive email alerts when this monitor goes down.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
              Telegram Chat ID
            </label>
            <input
              type="text"
              value={telegram}
              onChange={(e) => setTelegram(e.target.value)}
              placeholder="-1001234567890"
              disabled={isPending}
              className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm font-mono text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/40 focus:border-emerald-500/50 transition disabled:opacity-50"
            />
            <p className="text-xs text-zinc-400 dark:text-zinc-600">
              Get Telegram alerts via your bot. Use a group chat ID for team alerts.
            </p>
          </div>

          <div
            onClick={() => !isPending && setAlertOnFailure(!alertOnFailure)}
            className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800 cursor-pointer select-none"
          >
            <div>
              <span className="block text-xs font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                Alert on Failure
              </span>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
                Dispatch notifications immediately if checks fail.
              </p>
            </div>
            <div
              className={`relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                alertOnFailure ? "bg-emerald-500" : "bg-zinc-200 dark:bg-zinc-800"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  alertOnFailure ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/40 px-3 py-2.5 rounded-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
              {error}
            </div>
          )}

          {saved && (
            <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 px-3 py-2.5 rounded-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              Settings saved successfully.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-zinc-100 dark:border-zinc-800 flex gap-3">
          <button
            onClick={onClose}
            disabled={isPending}
            className="flex-1 px-4 py-2 text-sm font-semibold text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isPending}
            className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-950 rounded-lg hover:bg-zinc-800 dark:hover:bg-white transition flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {isPending && (
              <span className="w-3 h-3 border border-white/40 border-t-white rounded-full animate-spin" />
            )}
            Save Changes
          </button>
        </div>
      </div>
    </>
  );
}
