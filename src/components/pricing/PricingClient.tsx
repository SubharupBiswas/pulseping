"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LaunchDiscountBanner from "@/components/LaunchDiscountBanner";
import { motion, AnimatePresence } from "framer-motion";
import { PlanTier } from "@/lib/tiers";

const faqItems = [
  {
    question: "Can I cancel my plan?",
    answer: "Yes, you can cancel your subscription at any time directly through your dashboard workspace settings.",
  },
  {
    question: "What is your refund policy?",
    answer: "We offer a flexible refund architecture. If you are unsatisfied with your upgraded tier, contact support within 14 days for a full cancellation refund processing sequence.",
  },
  {
    question: "Are payment transactions secure?",
    answer: "Yes, all billing operations are handled by Razorpay's PCI-DSS compliant checkout framework. Prefill forms utilize dynamic data sanitization to protect user profile privacy.",
  },
];

type Props = {
  defaultCurrency: "INR" | "USD";
  isAdmin?: boolean;
};

export default function PricingClient({ defaultCurrency, isAdmin = false }: Props) {
  const router = useRouter();
  const [currency, setCurrency] = useState<"INR" | "USD">(defaultCurrency);
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");
  const [switchingTier, setSwitchingTier] = useState<string | null>(null);
  const [adminToast, setAdminToast] = useState<string | null>(null);

  // Promo code engine
  const [promoInput, setPromoInput] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState("");

  const handleApplyPromo = () => {
    setPromoError("");
    const code = promoInput.trim().toUpperCase();
    if (code === "LAUNCH50") {
      setPromoApplied(true);
    } else if (code === "") {
      setPromoApplied(false);
      setPromoError("");
    } else {
      setPromoApplied(false);
      setPromoError("Invalid promo code. Use LAUNCH50 for 50% OFF.");
    }
  };

  const handleAdminSwitchPlan = async (plan: PlanTier) => {
    try {
      setSwitchingTier(plan);
      setAdminToast(`⚡ [ADMIN OVERRIDE] Account tier switched to ${plan}! Refreshing...`);

      const res = await fetch("/api/admin/switch-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setAdminToast(`⚡ [ADMIN OVERRIDE] Account tier switched to ${plan}! Refreshing...`);
        setTimeout(() => {
          if (typeof window !== "undefined") {
            window.location.reload();
          } else {
            router.refresh();
          }
        }, 500);
      } else {
        alert(data.error || "Failed to switch plan");
        setAdminToast(null);
      }
    } catch (err: any) {
      console.error("Failed to switch plan:", err);
      alert("An error occurred while switching plan");
      setAdminToast(null);
    } finally {
      setSwitchingTier(null);
    }
  };

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem("pulseping_currency");
      if (saved === "INR" || saved === "USD") {
        setCurrency(saved);
        return;
      }
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
      const lang = typeof navigator !== "undefined" ? navigator.language || "" : "";
      if (timeZone.includes("Kolkata") || timeZone.includes("Calcutta") || lang.toLowerCase().includes("in")) {
        setCurrency("INR");
      } else {
        setCurrency(defaultCurrency);
      }
    } catch {
      // Fallback
    }
  }, [defaultCurrency]);

  const handleCurrencyChange = (newCurrency: "INR" | "USD") => {
    setCurrency(newCurrency);
    try {
      localStorage.setItem("pulseping_currency", newCurrency);
    } catch {
      // Ignore
    }
  };

  const formatPrice = (value: number, curr: "INR" | "USD") => {
    const discountMultiplier = promoApplied ? 0.5 : 1;
    const finalVal = Math.round(value * discountMultiplier);
    return new Intl.NumberFormat(curr === "INR" ? "en-IN" : "en-US", {
      style: "currency",
      currency: curr,
      maximumFractionDigits: 0,
    }).format(finalVal);
  };

  // Base prices:
  // PRO: Monthly ₹699 / $9 | Annual ₹559 / $7
  // BIZ: Monthly ₹2,199 / $29 | Annual ₹1,759 / $23
  const proPriceVal = currency === "INR"
    ? billingPeriod === "monthly" ? 699 : 559
    : billingPeriod === "monthly" ? 9 : 7;

  const bizPriceVal = currency === "INR"
    ? billingPeriod === "monthly" ? 2199 : 1759
    : billingPeriod === "monthly" ? 29 : 23;

  const pricingPlans = [
    {
      name: "Free",
      tier: "FREE" as PlanTier,
      price: formatPrice(0, currency),
      period: "forever",
      description: "Essential status checking parameters for personal services.",
      features: [
        "3 Active Monitors",
        "3-Minute Polling Cycles",
        "1 Heartbeat Monitor",
        "1 Public Status Page (With Badge)",
        "Basic Email Alerts",
      ],
      cta: "Get Started for Free",
      href: "/sign-up?redirect=/dashboard",
      popular: false,
    },
    {
      name: "Pro",
      tier: "PRO" as PlanTier,
      price: formatPrice(proPriceVal, currency),
      period: "per month",
      description: "Expanded limits and faster resolution loops for production pipelines.",
      features: [
        "20 Active Monitors",
        "30-Second Polling Cycles",
        "5 Inverse Heartbeats & Dead-Man Switches",
        "3 Public Status Pages (Option to Hide Badge)",
        "Detailed Gemini & OmniRoute AI Root-Cause Diagnostics",
        "Discord, Slack & Telegram Alerts",
      ],
      cta: "Upgrade to Pro",
      href: `/sign-up?redirect=/dashboard/billing&currency=${currency}&plan=pro`,
      popular: true,
    },
    {
      name: "Business",
      tier: "BUSINESS" as PlanTier,
      price: formatPrice(bizPriceVal, currency),
      period: "per month",
      description: "Dedicated scaling limits and custom SLA validation profiles.",
      features: [
        "100 Active Monitors",
        "10-Second Polling Cycles",
        "25 Inverse Heartbeats & Dead-Man Switches",
        "Unlimited Public Status Pages + Custom Domains",
        "Priority AI Diagnostics (Gemini -> OmniRoute -> Groq)",
        "Webhook Relays, SMS & Dedicated Support",
      ],
      cta: "Upgrade to Business",
      href: `/sign-up?redirect=/dashboard/billing&currency=${currency}&plan=business`,
      popular: false,
    },
  ];

  const cardContainer = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08 } },
  };

  const cardVariant = {
    hidden: { opacity: 0, y: 32, scale: 0.97 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring" as const, stiffness: 200, damping: 22 },
    },
  };

  return (
    <div className="min-h-screen bg-sky-50 text-zinc-900 dark:bg-[#030303] dark:text-zinc-100 font-sans antialiased relative overflow-x-hidden transition-colors duration-250">
      {/* Sticky Launch Discount Banner */}
      <LaunchDiscountBanner />

      {/* Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[480px] bg-gradient-to-tr from-emerald-500/[0.03] via-indigo-500/[0.015] to-transparent blur-3xl pointer-events-none z-0" />

      {/* Sticky Header */}
      <Navbar activeLink="pricing" />

      {/* Admin Toast */}
      {adminToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[100] bg-amber-500 text-black px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-2xl flex items-center gap-2 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-black animate-ping" />
          <span>{adminToast}</span>
        </div>
      )}

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24 relative z-10">
        {/* Hero Header */}
        <section className="text-center mb-10" aria-labelledby="pricing-title">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xs font-bold tracking-widest uppercase text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 bg-emerald-500/[0.04] px-2.5 py-1 rounded-full mb-4 inline-block"
          >
            TRANSPARENT TELEMETRY PRICING
          </motion.span>

          <h1
            id="pricing-title"
            className="text-3xl sm:text-5xl font-extrabold text-zinc-950 dark:text-zinc-50 tracking-tight max-w-2xl mx-auto leading-tight mb-4"
          >
            Simple, predictable pricing for{" "}
            <span className="bg-gradient-to-r from-emerald-500 to-teal-400 bg-clip-text text-transparent">
              production engineering.
            </span>
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-base max-w-lg mx-auto leading-relaxed">
            Monitor API endpoints and resolve outage alerts instantly. Zero configuration required to start status log archiving.
          </p>
        </section>

        {/* Currency & Billing Period Selectors */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          {/* Currency Toggle */}
          <div className="relative inline-flex p-1 rounded-xl bg-sky-100/40 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800">
            {(["INR", "USD"] as const).map((cur) => (
              <button
                key={cur}
                onClick={() => handleCurrencyChange(cur)}
                className="relative z-10 px-5 py-2 text-xs font-bold rounded-lg transition-colors duration-150 cursor-pointer"
                aria-pressed={currency === cur}
              >
                {currency === cur && (
                  <motion.div
                    layoutId="currency-pill"
                    className="absolute inset-0 bg-zinc-900 dark:bg-zinc-100 rounded-lg shadow-md"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span
                  className={`relative z-10 transition-colors duration-150 ${
                    currency === cur
                      ? "text-white dark:text-zinc-950"
                      : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
                  }`}
                >
                  {cur === "INR" ? "₹ INR" : "$ USD"}
                </span>
              </button>
            ))}
          </div>

          {/* Monthly / Yearly Toggle */}
          <div className="relative inline-flex p-1 rounded-xl bg-sky-100/40 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800">
            {(["monthly", "yearly"] as const).map((period) => (
              <button
                key={period}
                onClick={() => setBillingPeriod(period)}
                className="relative z-10 px-5 py-2 text-xs font-bold rounded-lg transition-colors duration-150 cursor-pointer flex items-center gap-1.5"
                aria-pressed={billingPeriod === period}
              >
                {billingPeriod === period && (
                  <motion.div
                    layoutId="period-pill"
                    className="absolute inset-0 bg-zinc-900 dark:bg-zinc-100 rounded-lg shadow-md"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span
                  className={`relative z-10 transition-colors duration-150 ${
                    billingPeriod === period
                      ? "text-white dark:text-zinc-950"
                      : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
                  }`}
                >
                  {period === "monthly" ? "Monthly" : "Yearly"}
                </span>
                {period === "yearly" && (
                  <span
                    className={`relative z-10 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      billingPeriod === "yearly"
                        ? "bg-emerald-500 text-black"
                        : "bg-emerald-500/10 text-emerald-500"
                    }`}
                  >
                    Save ~20%
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Promo Code Input Field */}
        <div className="max-w-md mx-auto mb-12 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-sky-50/50 dark:bg-zinc-900/40">
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Enter Promo Code (e.g. LAUNCH50)"
                value={promoInput}
                onChange={(e) => {
                  setPromoInput(e.target.value);
                  if (promoApplied) setPromoApplied(false);
                  if (promoError) setPromoError("");
                }}
                className="w-full px-3.5 py-2 text-xs font-mono rounded-xl bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 uppercase tracking-wider"
              />
              {promoApplied && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  ✓ 50% OFF APPLIED
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={handleApplyPromo}
              className="w-full sm:w-auto px-4 py-2 text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-black rounded-xl transition cursor-pointer shrink-0"
            >
              Apply Code
            </button>
          </div>
          {promoError && <p className="text-xs text-rose-500 font-mono mt-2 text-center">{promoError}</p>}
        </div>

        {/* Card Grid */}
        <section aria-label="Subscription plans matrix" className="mb-24">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={cardContainer}
            initial="hidden"
            animate="show"
          >
            {pricingPlans.map((plan) => (
              <motion.div
                key={plan.name}
                variants={cardVariant}
                className={`flex flex-col justify-between rounded-2xl p-6 relative ${
                  plan.popular
                    ? "bg-zinc-50/50 dark:bg-zinc-900/40 border-2 border-emerald-500/60 popular-glow"
                    : "bg-sky-50/60 dark:bg-zinc-900/20 border border-zinc-200 dark:border-zinc-800 shadow-sm"
                }`}
                whileHover={{ scale: plan.popular ? 1.015 : 1.01, transition: { type: "spring", stiffness: 300, damping: 22 } }}
              >
                {plan.popular && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full shadow-sm">
                    Most Popular
                  </span>
                )}

                <div>
                  <h3 className="text-base font-bold text-zinc-950 dark:text-zinc-50 tracking-tight">
                    {plan.name} Plan
                  </h3>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1.5">{plan.description}</p>

                  <div className="my-5 flex flex-col gap-0.5 overflow-hidden">
                    <div className="flex items-baseline gap-1">
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={`${plan.name}-${currency}-${billingPeriod}-${promoApplied}`}
                          initial={{ opacity: 0, y: -14 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 14 }}
                          transition={{ type: "spring", stiffness: 300, damping: 24 }}
                          className="text-3xl sm:text-4xl font-extrabold text-zinc-950 dark:text-zinc-50 tabular-nums"
                        >
                          {plan.price}
                        </motion.span>
                      </AnimatePresence>
                      <span className="text-xs text-zinc-400 dark:text-zinc-500">/ {plan.period}</span>
                    </div>

                    {/* Total Billed Annually Subtext */}
                    {billingPeriod === "yearly" && plan.tier !== "FREE" && (
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                        {plan.tier === "PRO"
                          ? `Billed as ${formatPrice(promoApplied ? 3354 : 6708, "INR")} / year (${formatPrice(
                              promoApplied ? 42 : 84,
                              "USD"
                            )} / year)`
                          : `Billed as ${formatPrice(promoApplied ? 10554 : 21108, "INR")} / year (${formatPrice(
                              promoApplied ? 138 : 276,
                              "USD"
                            )} / year)`}
                      </p>
                    )}
                  </div>

                  <div className="border-t border-zinc-200 dark:border-zinc-800 pt-5 mb-8">
                    <ul className="space-y-3" aria-label={`Included features for ${plan.name} plan`}>
                      {plan.features.map((feat) => (
                        <li key={feat} className="flex items-start gap-2.5 text-xs text-zinc-600 dark:text-zinc-400">
                          <svg
                            className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <Link
                    href={plan.href}
                    className={`btn-shimmer w-full py-2.5 rounded-lg text-center text-xs font-bold transition-all duration-200 block ${
                      plan.popular
                        ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/10"
                        : "bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-50 dark:hover:bg-white dark:text-zinc-950 border border-zinc-200 dark:border-transparent shadow-sm"
                    }`}
                  >
                    {plan.cta}
                  </Link>

                  {isAdmin && (
                    <button
                      type="button"
                      disabled={switchingTier === plan.tier}
                      onClick={() => handleAdminSwitchPlan(plan.tier)}
                      className="mt-2 w-full py-2 px-3 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-600 text-black shadow-sm transition flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
                    >
                      ⚡ Dev Switch (Instant) {switchingTier === plan.tier ? "..." : ""}
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* FAQ */}
        <section
          className="border-t border-zinc-200 dark:border-zinc-800 pt-16 max-w-3xl mx-auto"
          aria-labelledby="faq-title"
        >
          <h2
            id="faq-title"
            className="text-lg sm:text-xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 text-center mb-10"
          >
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqItems.map((faq) => (
              <div
                key={faq.question}
                className="border border-zinc-200 dark:border-zinc-900/60 rounded-xl px-5 py-4 bg-sky-50/30 dark:bg-transparent transition-colors hover:border-zinc-300 dark:hover:border-zinc-800"
              >
                <h3 className="text-sm font-semibold text-zinc-950 dark:text-zinc-100 tracking-tight">
                  {faq.question}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed mt-1.5">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
