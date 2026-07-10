"use client";

import React, { useRef, useCallback } from "react";

/**
 * DotGridHero — hover.dev style interactive dot grid background.
 * Tracks cursor position and illuminates a radial emerald glow at pointer location.
 * Pure CSS approach — no canvas needed; edge-runtime safe.
 */
export default function DotGridHero() {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    el.style.setProperty("--mouse-x", `${x}%`);
    el.style.setProperty("--mouse-y", `${y}%`);
  }, []);

  const handleMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--mouse-x", `50%`);
    el.style.setProperty("--mouse-y", `50%`);
  }, []);

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="dot-grid-glow absolute inset-0 z-0 pointer-events-none"
      aria-hidden="true"
      style={{ "--mouse-x": "50%", "--mouse-y": "50%" } as React.CSSProperties}
    />
  );
}
