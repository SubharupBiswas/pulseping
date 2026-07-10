"use client";

import React, { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { deleteMonitor } from "@/app/actions/monitors";

type Props = {
  monitorId: string;
  onDeleted?: () => void;
};

const HOLD_DURATION = 1500; // ms

/**
 * HoldToDelete — press-and-hold delete with Framer Motion progress bar.
 * Progress uses motion.div scaleX (0→1) for GPU-composited animation.
 * Adds a red glow on the progress fill for dramatic effect.
 */
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
      {/* Framer Motion progress fill with glow */}
      <AnimatePresence>
        {holding && (
          <motion.span
            key="progress-fill"
            className="absolute inset-y-0 left-0 bg-rose-500/20 dark:bg-rose-500/25 pointer-events-none"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: progress / 100 }}
            exit={{ opacity: 0 }}
            style={{
              originX: 0,
              width: "100%",
              boxShadow: `${progress > 20 ? "4px 0 12px rgba(244,63,94,0.35)" : "none"}`,
              transition: "box-shadow 0.1s ease",
            }}
          />
        )}
      </AnimatePresence>

      <span className="relative z-10">
        {fired ? "Deleting…" : holding ? "Hold…" : "⌫ Delete"}
      </span>
    </button>
  );
}
