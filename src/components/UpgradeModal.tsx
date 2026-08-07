"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export type UpgradeReason =
  | "monitors"
  | "heartbeats"
  | "interval"
  | "status_pages"
  | "alert_channels"
  | "ai_diagnostics"
  | "remove_badge"
  | "generic";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  reason?: UpgradeReason;
  currentPlan?: string;
  currency?: "INR" | "USD";
}

const REASON_COPY: Record<UpgradeReason, { title: string; body: string }> = {
  monitors: {
    title: "Monitor Limit Reached",
    body: "You've hit the maximum number of monitors for your current plan. Upgrade to track more endpoints with faster polling.",
  },
  heartbeats: {
    title: "Heartbeat Limit Reached",
    body: "Your plan doesn't support additional Dead-Man Switch heartbeats. Upgrade to add more cron monitors.",
  },
  interval: {
    title: "Faster Polling Available",
    body: "Free plans poll every 3 minutes. Upgrade to Pro for 30-second checks or Business for 10-second checks.",
  },
  status_pages: {
    title: "Status Page Limit Reached",
    body: "Upgrade to create more public status pages and share uptime reports with your users.",
  },
  alert_channels: {
    title: "Alert Channel Not Available",
    body: "This notification channel type (Slack, Telegram, SMS) is not available on your current plan. Upgrade to unlock multi-channel alerting.",
  },
  ai_diagnostics: {
    title: "AI Diagnostics Locked",
    body: "AI-powered root-cause analysis is a Pro & Business exclusive. Upgrade to unlock instant incident diagnostics.",
  },
  remove_badge: {
    title: "Remove 'Powered by PulsePing'",
    body: "Upgrade to Pro or Business to remove the PulsePing badge from your public status pages and deliver a fully branded experience.",
  },
  generic: {
    title: "Upgrade Required",
    body: "This feature is not available on your current plan. Upgrade to unlock the full power of PulsePing.",
  },
};

const PLAN_OPTIONS = [
  {
    tier: "PRO",
    priceINR: "₹699/mo",
    priceUSD: "$9/mo",
    highlights: ["20 Monitors", "30-second checks", "Discord & Slack alerts", "AI Diagnostics"],
    planId: "pro_monthly",
    popular: true,
  },
  {
    tier: "BUSINESS",
    priceINR: "₹2,199/mo",
    priceUSD: "$29/mo",
    highlights: ["100 Monitors", "10-second checks", "All channel types + SMS", "Priority Support"],
    planId: "business_monthly",
    popular: false,
  },
];

export default function UpgradeModal({ isOpen, onClose, reason = "generic", currentPlan = "FREE", currency = "USD" }: Props) {
  const copy = REASON_COPY[reason];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="upgrade-modal-title">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="relative z-10 w-full max-w-lg rounded-2xl border border-zinc-700/60 bg-zinc-900 shadow-2xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ type: "spring", stiffness: 280, damping: 26 }}
          >
            {/* Ambient top gradient */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-emerald-500/10 via-transparent to-transparent pointer-events-none" />

            <div className="relative p-6">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-200 transition-colors p-1 rounded-lg hover:bg-zinc-800"
                aria-label="Close upgrade modal"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>

              {/* Icon + title */}
              <div className="flex items-start gap-3 mb-4">
                <div className="mt-0.5 flex-shrink-0 w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                  </svg>
                </div>
                <div>
                  <h2 id="upgrade-modal-title" className="text-lg font-bold text-zinc-100">{copy.title}</h2>
                  <p className="text-sm text-zinc-400 mt-1 leading-relaxed">{copy.body}</p>
                </div>
              </div>

              {/* Plan cards */}
              <div className="grid grid-cols-2 gap-3 mt-5">
                {PLAN_OPTIONS.map((plan) => (
                  <div
                    key={plan.tier}
                    className={`relative rounded-xl border p-4 transition-colors ${
                      plan.popular
                        ? "border-emerald-500/40 bg-emerald-500/5"
                        : "border-zinc-700/60 bg-zinc-800/40"
                    }`}
                  >
                    {plan.popular && (
                      <span className="absolute -top-2.5 left-3 text-[10px] font-bold bg-emerald-500 text-black px-2 py-0.5 rounded-full tracking-wide">
                        POPULAR
                      </span>
                    )}
                    <p className="font-bold text-zinc-100 text-sm">{plan.tier}</p>
                    <p className="text-emerald-400 font-bold text-lg mt-0.5">
                      {currency === "INR" ? plan.priceINR : plan.priceUSD}
                    </p>
                    <ul className="mt-3 space-y-1.5">
                      {plan.highlights.map((h) => (
                        <li key={h} className="flex items-center gap-1.5 text-[11px] text-zinc-400">
                          <svg className="h-3 w-3 text-emerald-500 flex-shrink-0" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0z" />
                          </svg>
                          {h}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <Link
                href={`/pricing?currency=${currency}`}
                className="mt-4 w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-3 text-sm transition-colors"
                onClick={onClose}
              >
                See All Plans & Upgrade
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>

              <p className="text-center text-[11px] text-zinc-600 mt-3">
                Currently on <span className="text-zinc-500 font-medium">{currentPlan}</span> · Cancel anytime
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
