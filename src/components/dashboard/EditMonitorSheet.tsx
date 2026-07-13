"use client";

import React, { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { updateMonitorAlert } from "@/app/actions/monitors";

type Props = {
  monitorId: string;
  url: string;
  alertEmail: string | null;
  telegramChatId: string | null;
  alertOnFailure: boolean;
  method: string;
  headers: string | null;
  body: string | null;
  keywordCheck: string | null;
  sslTrack: boolean;
  isHeartbeat: boolean;
  isPremium: boolean;
  open: boolean;
  onClose: () => void;
};

export default function EditMonitorSheet({
  monitorId,
  url,
  alertEmail,
  telegramChatId,
  alertOnFailure: initialAlertOnFailure,
  method: initialMethod,
  headers: initialHeaders,
  body: initialBody,
  keywordCheck: initialKeywordCheck,
  sslTrack: initialSslTrack,
  isHeartbeat: initialIsHeartbeat,
  isPremium,
  open,
  onClose,
}: Props) {
  const router = useRouter();

  // Basic alert settings states
  const [email, setEmail] = useState(alertEmail ?? "");
  const [telegram, setTelegram] = useState(telegramChatId ?? "");
  const [alertOnFailure, setAlertOnFailure] = useState(initialAlertOnFailure);

  // Advanced telemetry settings states
  const [method, setMethod] = useState(initialMethod ?? "GET");
  const [headersVal, setHeadersVal] = useState(initialHeaders ?? "");
  const [bodyVal, setBodyVal] = useState(initialBody ?? "");
  const [keywordCheck, setKeywordCheck] = useState(initialKeywordCheck ?? "");
  const [sslTrack, setSslTrack] = useState(initialSslTrack);
  const [isHeartbeat, setIsHeartbeat] = useState(initialIsHeartbeat);

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (open) {
      setEmail(alertEmail ?? "");
      setTelegram(telegramChatId ?? "");
      setAlertOnFailure(initialAlertOnFailure);

      setMethod(initialMethod ?? "GET");
      setHeadersVal(initialHeaders ?? "");
      setBodyVal(initialBody ?? "");
      setKeywordCheck(initialKeywordCheck ?? "");
      setSslTrack(initialSslTrack);
      setIsHeartbeat(initialIsHeartbeat);

      setError(null);
      setSaved(false);
    }
  }, [
    open,
    alertEmail,
    telegramChatId,
    initialAlertOnFailure,
    initialMethod,
    initialHeaders,
    initialBody,
    initialKeywordCheck,
    initialSslTrack,
    initialIsHeartbeat,
  ]);

  const handleSave = () => {
    setError(null);
    setSaved(false);
    startTransition(async () => {
      const finalMethod = isPremium ? method : "GET";
      const finalHeaders = isPremium ? (headersVal.trim() || null) : null;
      const finalBody = isPremium ? (bodyVal.trim() || null) : null;
      const finalKeywordCheck = isPremium ? (keywordCheck.trim() || null) : null;
      const finalSslTrack = isPremium ? sslTrack : false;
      const finalIsHeartbeat = isPremium ? isHeartbeat : false;

      const result = await updateMonitorAlert(
        monitorId,
        email.trim() || null,
        telegram.trim() || null,
        null,
        alertOnFailure,
        finalMethod,
        finalHeaders,
        finalBody,
        finalKeywordCheck,
        finalSslTrack,
        finalIsHeartbeat
      );
      if (result.success) {
        setSaved(true);
        router.refresh();
        setTimeout(() => {
          setSaved(false);
          onClose();
        }, 1200);
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
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-800 z-50 flex flex-col shadow-2xl sheet-enter">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 dark:border-zinc-800">
          <div>
            <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Edit Monitor Settings</h2>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 font-mono truncate max-w-[280px] mt-0.5">{url}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-sky-100/30 dark:hover:bg-zinc-900 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6">
          
          {/* Section: Basic Alert Destinations */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 pb-1 border-b border-zinc-100 dark:border-zinc-900">
              Alert Targets
            </h3>
            
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
                className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-650 focus:outline-none focus:ring-1 focus:ring-emerald-500/40 focus:border-emerald-500/50 transition disabled:opacity-50"
              />
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
            </div>
          </div>

          {/* Section: Advanced Telemetry Settings */}
          <div className="space-y-4 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 pb-1 border-b border-zinc-100 dark:border-zinc-900">
              Advanced Telemetry
            </h3>

            {!isPremium && (
              <div className="flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/40 rounded-xl text-xs text-amber-700 dark:text-amber-300 leading-relaxed shadow-sm">
                <span className="text-base shrink-0 select-none">🔒</span>
                <p>
                  Advanced Telemetry features are locked under your current plan level. Upgrade to a premium tier to configure HTTP methods, custom headers, keyword matching, and live SSL tracking.
                </p>
              </div>
            )}

            {/* HTTP Method Selector */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                HTTP Request Method
              </label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                disabled={isPending || !isPremium}
                className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500/40 focus:border-emerald-500/50 transition font-medium disabled:opacity-50"
              >
                <option value="GET" className="bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">GET</option>
                <option value="POST" className="bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">POST</option>
                <option value="PUT" className="bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">PUT</option>
                <option value="PATCH" className="bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">PATCH</option>
                <option value="DELETE" className="bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">DELETE</option>
              </select>
            </div>

            {/* Custom Headers Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                Custom Headers (JSON)
              </label>
              <textarea
                value={headersVal}
                onChange={(e) => setHeadersVal(e.target.value)}
                placeholder='{"Authorization": "Bearer ...", "Content-Type": "application/json"}'
                disabled={isPending || !isPremium}
                rows={3}
                className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs font-mono text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-650 focus:outline-none focus:ring-1 focus:ring-emerald-500/40 focus:border-emerald-500/50 transition resize-none disabled:opacity-50"
              />
            </div>

            {/* Request Body Input (Conditional) */}
            {method !== "GET" && (
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                  Request Payload Body
                </label>
                <textarea
                  value={bodyVal}
                  onChange={(e) => setBodyVal(e.target.value)}
                  placeholder='{"key": "value"}'
                  disabled={isPending || !isPremium}
                  rows={3}
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs font-mono text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/40 focus:border-emerald-500/50 transition resize-none disabled:opacity-50"
                />
              </div>
            )}

            {/* Keyword Content Matching */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                Keyword Content Matching
              </label>
              <input
                type="text"
                value={keywordCheck}
                onChange={(e) => setKeywordCheck(e.target.value)}
                placeholder="e.g. success"
                disabled={isPending || !isPremium}
                className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-655 focus:outline-none focus:ring-1 focus:ring-emerald-500/40 focus:border-emerald-500/50 transition disabled:opacity-50"
              />
              <p className="text-[10px] text-zinc-400 dark:text-zinc-600 mt-0.5">
                Checks that the target response body string contains this specific keyword.
              </p>
            </div>

            {/* Interaction Switches Block */}
            <div className="space-y-3 pt-2">
              <div
                onClick={() => !isPending && isPremium && setSslTrack(!sslTrack)}
                className={`flex items-center justify-between select-none ${isPremium ? "cursor-pointer" : "opacity-60 cursor-not-allowed"}`}
              >
                <div>
                  <span className="block text-xs font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                    SSL Tracking
                  </span>
                  <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5">
                    Enable automated TLS/SSL certificate expiration tracking.
                  </p>
                </div>
                <div
                  className={`relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    sslTrack ? "bg-emerald-500" : "bg-zinc-200 dark:bg-zinc-800"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      sslTrack ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </div>
              </div>

              <div
                onClick={() => !isPending && isPremium && setIsHeartbeat(!isHeartbeat)}
                className={`flex items-center justify-between select-none ${isPremium ? "cursor-pointer" : "opacity-60 cursor-not-allowed"}`}
              >
                <div>
                  <span className="block text-xs font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                    Configure Heartbeat
                  </span>
                  <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5">
                    Configure as an Inverse Heartbeat (Dead-Man Switch endpoint).
                  </p>
                </div>
                <div
                  className={`relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    isHeartbeat ? "bg-emerald-500" : "bg-zinc-200 dark:bg-zinc-800"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      isHeartbeat ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Toggle Alert On Failure */}
          <div
            onClick={() => !isPending && setAlertOnFailure(!alertOnFailure)}
            className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800 cursor-pointer select-none"
          >
            <div>
              <span className="block text-xs font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                Alert on Failure
              </span>
              <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5">
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
            className="flex-1 px-4 py-2 text-sm font-semibold text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-sky-50/80 dark:hover:bg-zinc-900 transition disabled:opacity-50"
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
