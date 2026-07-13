"use client";

import React, { useEffect } from "react";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function DashboardError({ error, reset }: Props) {
  useEffect(() => {
    // Log error to an analytics or monitoring system
    console.error("Dashboard error caught by boundary:", error);
  }, [error]);

  return (
    <div className="w-full min-w-full col-span-full mx-auto flex flex-col items-center justify-center py-12 px-4 min-h-[400px] bg-sky-50/60 dark:bg-zinc-950/20 rounded-xl border border-zinc-200 dark:border-zinc-900 shadow-sm">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto border border-rose-500/25">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
            Something went wrong in the dashboard panel
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-650">
            PulsePing encountered a runtime component error. You can attempt a recovery below or view diagnostics.
          </p>
        </div>

        {error.message && (
          <div className="p-3 bg-sky-100/30 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-left">
            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-600 mb-1">
              Error Message
            </p>
            <p className="font-mono text-xs text-zinc-700 dark:text-zinc-350 truncate">
              {error.message}
            </p>
          </div>
        )}

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-950 text-xs font-semibold rounded-lg shadow transition"
          >
            Attempt Recovery
          </button>
          <a
            href="/dashboard"
            className="px-4 py-2 border border-zinc-200 dark:border-zinc-850 hover:bg-sky-100/40 dark:hover:bg-zinc-900 text-zinc-600 dark:text-zinc-400 text-xs font-semibold rounded-lg transition"
          >
            Go to Streams
          </a>
        </div>
      </div>
    </div>
  );
}
