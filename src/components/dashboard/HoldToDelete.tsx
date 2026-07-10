"use client";

import React, { useState, useRef, useCallback } from "react";
import { deleteMonitor } from "@/app/actions/monitors";

type Props = {
  monitorId: string;
  onDeleted?: () => void;
};

const HOLD_DURATION = 1500; // ms

export default function HoldToDelete({ monitorId, onDeleted }: Props) {
  const [holding, setHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fired, setFired] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startRef = useRef<number>(0);

  const startHold = useCallback(() => {
    if (fired) return;
    setHolding(true);
    startRef.current = Date.now();
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startRef.current;
      const pct = Math.min((elapsed / HOLD_DURATION) * 100, 100);
      setProgress(pct);
      if (pct >= 100) {
        clearInterval(intervalRef.current!);
        setFired(true);
        setHolding(false);
        deleteMonitor(monitorId).then(() => onDeleted?.());
      }
    }, 16);
  }, [fired, monitorId, onDeleted]);

  const stopHold = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setHolding(false);
    setProgress(0);
  }, []);

  return (
    <button
      onMouseDown={startHold}
      onMouseUp={stopHold}
      onMouseLeave={stopHold}
      onTouchStart={startHold}
      onTouchEnd={stopHold}
      disabled={fired}
      aria-label="Hold to delete monitor"
      className={`relative overflow-hidden text-xs font-semibold px-3 py-1.5 rounded-md border transition-all duration-150 select-none cursor-pointer ${
        fired
          ? "bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-300 dark:border-rose-800 opacity-60"
          : holding
          ? "border-rose-400 dark:border-rose-700 text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30"
          : "border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-900/40 hover:border-rose-300 dark:hover:border-rose-900/40 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20"
      }`}
    >
      {/* Fill progress bar */}
      {holding && (
        <span
          className="absolute inset-0 bg-rose-500/15 dark:bg-rose-500/20 pointer-events-none"
          style={{ width: `${progress}%`, transition: "none" }}
        />
      )}
      <span className="relative z-10">
        {fired ? "Deleting…" : holding ? "Hold…" : "Delete"}
      </span>
    </button>
  );
}
