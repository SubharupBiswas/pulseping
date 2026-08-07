"use client";

import React, { useState } from "react";

export default function LaunchDiscountBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="sticky top-0 z-50 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 shadow-md flex items-center justify-between gap-3 border-b border-emerald-500/30">
      <div className="flex items-center gap-2 mx-auto">
        <span className="text-base animate-pulse">🔥</span>
        <span>
          <strong className="font-extrabold uppercase tracking-wide">Launch Special:</strong> Get{" "}
          <span className="bg-white/20 px-1.5 py-0.5 rounded font-bold">50% OFF</span> Pro &amp; Business Tiers! Use promo code{" "}
          <code className="bg-black/30 text-emerald-200 px-2 py-0.5 rounded font-mono font-bold tracking-wider">
            LAUNCH50
          </code>{" "}
          at checkout.
        </span>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="text-white/80 hover:text-white transition-colors p-1 rounded-md hover:bg-white/10 shrink-0 cursor-pointer"
        aria-label="Dismiss launch banner"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
