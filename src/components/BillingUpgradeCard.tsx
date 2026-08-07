"use client";

import React, { useState, useTransition } from "react";
import { useUser } from "@clerk/nextjs";
import { getPlanActionState } from "@/lib/plan";
import { upgradeUserPlan } from "@/app/actions/billing";
import { useRouter } from "next/navigation";
import { PlanTier } from "@/lib/tiers";

export default function BillingUpgradeCard({
  userId,
  currentPlan,
  currency: initialCurrency = "USD",
  isAdmin = false,
}: {
  userId: string;
  currentPlan: string;
  currency?: "INR" | "USD";
  isAdmin?: boolean;
}) {
  const { user } = useUser();
  const router = useRouter();
  const userEmail = user?.primaryEmailAddress?.emailAddress;
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");
  const [currency, setCurrency] = useState<"INR" | "USD">(initialCurrency);
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ type: "success" | "error" | "info"; message: string } | null>(null);

  // Promo code engine
  const [promoInput, setPromoInput] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState("");

  // Dev switch state
  const [switchingTier, setSwitchingTier] = useState<string | null>(null);

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem("pulseping_currency");
      if (saved === "INR" || saved === "USD") {
        setCurrency(saved);
        return;
      }
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
      if (tz.includes("Kolkata") || tz.includes("Calcutta") || tz.includes("Asia/Colombo")) {
        setCurrency("INR");
        return;
      }
      if (typeof navigator !== "undefined" && navigator.language.toLowerCase().includes("in")) {
        setCurrency("INR");
        return;
      }
      setCurrency("USD");
    } catch {
      // Ignore if localStorage/Intl is unavailable
    }
  }, []);

  const handleApplyPromo = () => {
    setPromoError("");
    const code = promoInput.trim().toUpperCase();
    if (code === "LAUNCH50") {
      setPromoApplied(true);
      setFeedback({ type: "success", message: "🔥 LAUNCH50 promo code applied — 50% discount activated!" });
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
      setFeedback({
        type: "info",
        message: `⚡ [ADMIN OVERRIDE] Account tier switched to ${plan}! Refreshing...`,
      });

      const res = await fetch("/api/admin/switch-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setFeedback({
          type: "success",
          message: `⚡ [ADMIN OVERRIDE] Account tier switched to ${plan}! Refreshing...`,
        });
        setTimeout(() => {
          if (typeof window !== "undefined") {
            window.location.reload();
          } else {
            router.refresh();
          }
        }, 500);
      } else {
        setFeedback({ type: "error", message: data.error || "Failed to switch plan" });
      }
    } catch (err: any) {
      console.error("Failed to switch plan:", err);
      setFeedback({ type: "error", message: "An error occurred while switching plan" });
    } finally {
      setSwitchingTier(null);
    }
  };

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window === "undefined") return resolve(false);
      if ((window as any).Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleUpgrade = async (plan: "PRO" | "BUSINESS") => {
    setFeedback(null);

    if (typeof window === "undefined") {
      setFeedback({ type: "error", message: "Client window scope not resolved." });
      return;
    }

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      setFeedback({ type: "error", message: "Billing checkout script failed to load. Check network connectivity." });
      return;
    }

    let planId = "";
    if (plan === "PRO") {
      planId = billingPeriod === "monthly" ? "pro_monthly" : "pro_yearly";
    } else {
      planId = billingPeriod === "monthly" ? "business_monthly" : "business_yearly";
    }

    const promoCodeToSend = promoApplied ? "LAUNCH50" : promoInput.trim() ? promoInput.trim() : undefined;

    startTransition(async () => {
      try {
        const orderRes = await fetch("/api/razorpay/order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ planId, currency, promoCode: promoCodeToSend }),
        });

        let orderData: any;
        try {
          orderData = await orderRes.json();
        } catch {
          setFeedback({ type: "error", message: "Malformed order response from server." });
          return;
        }

        if (!orderRes.ok || !orderData?.success) {
          setFeedback({
            type: "error",
            message: orderData?.error ?? `Order creation failed (HTTP ${orderRes.status}).`,
          });
          return;
        }

        if (!orderData.order_id || !orderData.amount) {
          setFeedback({ type: "error", message: "Invalid order response — missing required fields." });
          return;
        }

        const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
        if (!razorpayKey || razorpayKey.trim() === "") {
          setFeedback({
            type: "error",
            message: "Razorpay public key is not configured. Contact support.",
          });
          return;
        }

        if (typeof window === "undefined" || !(window as any).Razorpay) {
          setFeedback({ type: "error", message: "Billing SDK not available on window scope." });
          return;
        }

        const checkoutOptions = {
          key: razorpayKey,
          amount: orderData.amount as number,
          currency: orderData.currency as string,
          name: "PulsePing",
          description: `Upgrade to ${plan} — ${billingPeriod} subscription`,
          image: "/icon.svg",
          order_id: orderData.order_id as string,
          prefill: {
            ...(userEmail ? { email: userEmail } : {}),
          },
          theme: {
            color: "#09090b",
            backdrop_color: "rgba(0, 0, 0, 0.85)",
          },
          modal: {
            ondismiss: () => {
              setFeedback({ type: "info", message: "Checkout dismissed — no charges applied." });
            },
          },
          handler: function (response: any) {
            startTransition(async () => {
              try {
                const verifyRes = await fetch("/api/verify-payment", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                    plan,
                  }),
                });

                let verifyData: any;
                try {
                  verifyData = await verifyRes.json();
                } catch {
                  setFeedback({ type: "error", message: "Malformed verification response." });
                  return;
                }

                if (verifyRes.ok && verifyData?.success) {
                  setFeedback({ type: "success", message: `Payment verified — account upgraded to ${plan} Tier.` });
                  setTimeout(() => window.location.reload(), 1200);
                } else {
                  setFeedback({
                    type: "error",
                    message: verifyData?.error ?? "Signature verification failed.",
                  });
                }
              } catch {
                setFeedback({ type: "error", message: "Network error during payment verification." });
              }
            });
          },
        };

        const rzp = new (window as any).Razorpay(checkoutOptions);
        rzp.on("payment.failed", (response: any) => {
          setFeedback({
            type: "error",
            message: `Payment declined: ${response.error?.description ?? "Unknown reason"}`,
          });
        });

        rzp.open();
      } catch (err) {
        console.error("[CHECKOUT_ERROR]", err);
        setFeedback({ type: "error", message: "Checkout initialization failed. Please try again." });
      }
    });
  };

  const handlePlanSelect = (targetPlan: "FREE" | "PRO" | "BUSINESS") => {
    const action = getPlanActionState(targetPlan, currentPlan);
    if (action.disabled) return;

    if (action.label.startsWith("Downgrade") || targetPlan === "FREE") {
      setFeedback(null);
      startTransition(async () => {
        const res = await upgradeUserPlan(userId, targetPlan);
        if (res.success) {
          setFeedback({ type: "success", message: `Account plan updated to ${targetPlan} Tier.` });
          setTimeout(() => window.location.reload(), 1000);
        } else {
          setFeedback({ type: "error", message: res.error || "Failed to update plan." });
        }
      });
    } else {
      handleUpgrade(targetPlan as "PRO" | "BUSINESS");
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

  const freeState = getPlanActionState("FREE", currentPlan);
  const proState = getPlanActionState("PRO", currentPlan);
  const bizState = getPlanActionState("BUSINESS", currentPlan);

  const getProPrice = () => {
    const base = currency === "INR"
      ? billingPeriod === "monthly" ? 699 : 559
      : billingPeriod === "monthly" ? 9 : 7;
    return formatPrice(base, currency);
  };

  const getBizPrice = () => {
    const base = currency === "INR"
      ? billingPeriod === "monthly" ? 2199 : 1759
      : billingPeriod === "monthly" ? 29 : 23;
    return formatPrice(base, currency);
  };

  return (
    <section
      className="relative z-10 bg-white/90 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-6 sm:p-8 mb-8 shadow-sm backdrop-blur-md transition-colors"
      aria-labelledby="billing-title"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 id="billing-title" className="text-lg font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
            Upgrade Monitor Telemetry Limits
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Scale up active monitoring channels and telemetry resolution cycle speeds.
          </p>
        </div>

        {/* Currency & Billing Period Selectors */}
        <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
          {/* Currency */}
          <div className="flex items-center gap-1 bg-sky-100/40 dark:bg-zinc-950 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <button
              onClick={() => setCurrency("INR")}
              className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg transition ${
                currency === "INR"
                  ? "bg-white dark:bg-zinc-900 text-zinc-950 dark:text-zinc-100 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400"
              }`}
            >
              ₹ INR
            </button>
            <button
              onClick={() => setCurrency("USD")}
              className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg transition ${
                currency === "USD"
                  ? "bg-white dark:bg-zinc-900 text-zinc-950 dark:text-zinc-100 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400"
              }`}
            >
              $ USD
            </button>
          </div>

          {/* Monthly / Yearly */}
          <div className="flex items-center gap-1 bg-sky-100/40 dark:bg-zinc-950 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <button
              onClick={() => setBillingPeriod("monthly")}
              className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg transition ${
                billingPeriod === "monthly"
                  ? "bg-white dark:bg-zinc-900 text-zinc-950 dark:text-zinc-100 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod("yearly")}
              className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg transition flex items-center gap-1 ${
                billingPeriod === "yearly"
                  ? "bg-white dark:bg-zinc-900 text-zinc-950 dark:text-zinc-100 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400"
              }`}
            >
              Yearly
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">
                Save ~20%
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Promo Code Input */}
      <div className="mb-8 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-sky-50/40 dark:bg-zinc-950/40">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Promo Code (e.g. LAUNCH50)"
              value={promoInput}
              onChange={(e) => {
                setPromoInput(e.target.value);
                if (promoApplied) setPromoApplied(false);
                if (promoError) setPromoError("");
              }}
              className="w-full px-3.5 py-2 text-xs font-mono rounded-lg bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 uppercase tracking-wider"
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
            className="w-full sm:w-auto px-4 py-2 text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-black rounded-lg transition cursor-pointer shrink-0"
          >
            Apply Code
          </button>
        </div>
        {promoError && <p className="text-xs text-rose-500 font-mono mt-2">{promoError}</p>}
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* FREE */}
        <div className="bg-sky-50/50 dark:bg-zinc-950/20 border border-zinc-200 dark:border-zinc-900 rounded-xl p-5 flex flex-col justify-between transition hover:border-zinc-300 dark:hover:border-zinc-800/80">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold tracking-widest uppercase text-zinc-500 dark:text-zinc-600">
                Free Tier
              </span>
              {currentPlan === "FREE" && (
                <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 bg-zinc-200/50 dark:bg-zinc-900/60 px-2 py-0.5 rounded-full">
                  Current Plan
                </span>
              )}
            </div>
            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                {formatPrice(0, currency)}
              </span>
              <span className="text-xs text-zinc-500">/ month</span>
            </div>
            <ul className="space-y-2.5 mb-6 text-xs text-zinc-500 dark:text-zinc-400">
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>2 Active Monitors</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>3-Minute Polling Cycles</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>1 Heartbeat Monitor</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>1 Public Status Page (With Badge)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>7-Day Log History</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>Basic Email Alerts</span>
              </li>
            </ul>
          </div>
          <div>
            <button
              onClick={() => handlePlanSelect("FREE")}
              disabled={isPending || freeState.disabled}
              className="w-full text-center text-xs font-semibold bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 disabled:opacity-50 px-4 py-2.5 rounded-lg cursor-pointer disabled:cursor-not-allowed shadow-sm transition"
            >
              {freeState.label}
            </button>
            {isAdmin && (
              <button
                type="button"
                disabled={switchingTier === "FREE"}
                onClick={() => handleAdminSwitchPlan("FREE")}
                className="mt-2 w-full py-2 px-3 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-600 text-black shadow-sm transition flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
              >
                ⚡ Dev Switch (Instant) {switchingTier === "FREE" ? "..." : ""}
              </button>
            )}
          </div>
        </div>

        {/* PRO */}
        <div className="bg-sky-50/50 dark:bg-zinc-950/20 border border-zinc-200 dark:border-zinc-900 rounded-xl p-5 flex flex-col justify-between transition hover:border-zinc-300 dark:hover:border-zinc-800/80 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[9px] uppercase tracking-widest font-bold px-3 py-1 rounded-bl-lg border-l border-b border-emerald-500/10">
            Popular
          </div>
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold tracking-widest uppercase text-emerald-600 dark:text-emerald-500/60">
                Pro Tier
              </span>
              {currentPlan === "PRO" && (
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  Current Plan
                </span>
              )}
            </div>
            <div className="flex flex-col gap-0.5 mb-4">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                  {getProPrice()}
                </span>
                <span className="text-xs text-zinc-500">/ month</span>
              </div>
              {billingPeriod === "yearly" && (
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  Billed as {formatPrice(promoApplied ? 3354 : 6708, "INR")} / year ({formatPrice(promoApplied ? 42 : 84, "USD")} / year)
                </p>
              )}
            </div>
            <ul className="space-y-2.5 mb-6 text-xs text-zinc-500 dark:text-zinc-400">
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>20 Active Monitors</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>30-Second Polling Cycles</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>5 Inverse Heartbeats &amp; Dead-Man Switches</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>3 Public Status Pages (Option to Hide Badge)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>30-Day Log History</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>Detailed Gemini &amp; OmniRoute AI Root-Cause Diagnostics</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>Discord, Slack &amp; Telegram Alerts</span>
              </li>
            </ul>
          </div>
          <div>
            <button
              onClick={() => handlePlanSelect("PRO")}
              disabled={isPending || proState.disabled}
              className="w-full text-center text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-950 disabled:bg-zinc-200/50 dark:disabled:bg-zinc-900 disabled:text-zinc-500 px-4 py-2.5 rounded-lg cursor-pointer disabled:cursor-not-allowed shadow-md transition"
            >
              {isPending ? "Connecting..." : proState.label}
            </button>
            {isAdmin && (
              <button
                type="button"
                disabled={switchingTier === "PRO"}
                onClick={() => handleAdminSwitchPlan("PRO")}
                className="mt-2 w-full py-2 px-3 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-600 text-black shadow-sm transition flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
              >
                ⚡ Dev Switch (Instant) {switchingTier === "PRO" ? "..." : ""}
              </button>
            )}
          </div>
        </div>

        {/* BUSINESS */}
        <div className="bg-sky-50/50 dark:bg-zinc-950/20 border border-zinc-200 dark:border-zinc-900 rounded-xl p-5 flex flex-col justify-between transition hover:border-zinc-300 dark:hover:border-zinc-800/80">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold tracking-widest uppercase text-indigo-600 dark:text-indigo-400">
                Business Tier
              </span>
              {currentPlan === "BUSINESS" && (
                <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full">
                  Current Plan
                </span>
              )}
            </div>
            <div className="flex flex-col gap-0.5 mb-4">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                  {getBizPrice()}
                </span>
                <span className="text-xs text-zinc-500">/ month</span>
              </div>
              {billingPeriod === "yearly" && (
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  Billed as {formatPrice(promoApplied ? 10554 : 21108, "INR")} / year ({formatPrice(promoApplied ? 138 : 276, "USD")} / year)
                </p>
              )}
            </div>
            <ul className="space-y-2.5 mb-6 text-xs text-zinc-500 dark:text-zinc-400">
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span className="font-semibold text-zinc-900 dark:text-zinc-200">100 Active Monitors</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>10-Second Polling Cycles</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>25 Inverse Heartbeats &amp; Dead-Man Switches</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>Unlimited Public Status Pages + Custom Domains</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>90-Day Log History</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>Priority AI Diagnostics (Gemini -&gt; OmniRoute -&gt; Groq)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>Webhook Relays &amp; Dedicated Support</span>
              </li>
            </ul>
          </div>
          <div>
            <button
              onClick={() => handlePlanSelect("BUSINESS")}
              disabled={isPending || bizState.disabled}
              className="w-full text-center text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-950 disabled:bg-zinc-200/50 dark:disabled:bg-zinc-900 disabled:text-zinc-500 px-4 py-2.5 rounded-lg cursor-pointer disabled:cursor-not-allowed shadow-md transition"
            >
              {isPending ? "Connecting..." : bizState.disabled ? bizState.label : "Upgrade to Business"}
            </button>
            {isAdmin && (
              <button
                type="button"
                disabled={switchingTier === "BUSINESS"}
                onClick={() => handleAdminSwitchPlan("BUSINESS")}
                className="mt-2 w-full py-2 px-3 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-600 text-black shadow-sm transition flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
              >
                ⚡ Dev Switch (Instant) {switchingTier === "BUSINESS" ? "..." : ""}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Feedback Toast */}
      {feedback && (
        <div
          className={`mt-6 flex items-center gap-2.5 text-sm font-mono border px-3.5 py-2.5 rounded-lg ${
            feedback.type === "success"
              ? "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/30"
              : feedback.type === "error"
              ? "text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/30"
              : "text-zinc-600 dark:text-zinc-400 bg-sky-100/30 dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800"
          }`}
          role="status"
        >
          <span
            className={`w-2 h-2 rounded-full shrink-0 ${
              feedback.type === "success"
                ? "bg-emerald-500 animate-pulse"
                : feedback.type === "error"
                ? "bg-rose-500"
                : "bg-amber-500 animate-pulse"
            }`}
          />
          <span>{feedback.message}</span>
        </div>
      )}

      <p className="text-center text-xs text-zinc-400 dark:text-zinc-500 mt-6">
        Transactions processed securely via Razorpay standard checkout loops. Plan modifications auto-synchronize in database instances.
      </p>
    </section>
  );
}
