"use client";

import React, { useState, useTransition } from "react";

export default function BillingUpgradeCard({
  userId,
  currentPlan,
}: {
  userId: string;
  currentPlan: string;
}) {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ type: "success" | "error" | "info"; message: string } | null>(null);

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

    // Compute cost in INR paise
    // PRO: Monthly ₹499 (49900 paise), Yearly ₹399/mo (478800 paise)
    // BUSINESS: Monthly ₹1499 (149900 paise), Yearly ₹1199/mo (1438800 paise)
    let amount = 0;
    let planId = "";
    if (plan === "PRO") {
      amount = billingPeriod === "monthly" ? 49900 : 478800;
      planId = billingPeriod === "monthly" ? "plan_pro_test_id" : "plan_pro_annual_test_id";
    } else {
      amount = billingPeriod === "monthly" ? 149900 : 1438800;
      planId = billingPeriod === "monthly" ? "plan_biz_test_id" : "plan_biz_annual_test_id";
    }

    startTransition(async () => {
      try {
        const orderRes = await fetch("/api/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount, currency: "INR", plan, planId }),
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

        const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
        if (!razorpayKey) {
          setFeedback({ type: "error", message: "Razorpay public key is not configured." });
          return;
        }

        if (typeof window === "undefined" || !(window as any).Razorpay) {
          setFeedback({ type: "error", message: "Billing SDK not available on window scope." });
          return;
        }

        const checkoutOptions = {
          key: razorpayKey,
          amount: orderData.amount,
          currency: orderData.currency,
          name: "PulsePing",
          description: `Upgrade to ${plan} — ${billingPeriod} subscription`,
          order_id: orderData.order_id,
          prefill: {
            contact: "9876543210",
            email: "test.premium@pulseping.io",
          },
          theme: {
            color: "#09090b",
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

  if (currentPlan === "PRO" || currentPlan === "BUSINESS") return null;

  return (
    <section className="relative z-10 bg-white dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-6 sm:p-8 mb-8 shadow-sm backdrop-blur-md transition-colors" aria-labelledby="billing-title">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 id="billing-title" className="text-lg font-bold tracking-tight text-zinc-905 dark:text-zinc-50">Upgrade Monitor Telemetry Limits</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Scale up your active monitoring channels and telemetry resolution cycle speeds.</p>
        </div>

        {/* Monthly / Yearly Toggle */}
        <div className="flex items-center gap-2 self-start md:self-auto bg-zinc-100 dark:bg-zinc-950 p-1 rounded-xl border border-zinc-200 dark:border-zinc-850">
          <button
            onClick={() => setBillingPeriod("monthly")}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition ${
              billingPeriod === "monthly"
                ? "bg-white dark:bg-zinc-900 text-zinc-950 dark:text-zinc-100 shadow-sm"
                : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-450 dark:hover:text-zinc-350"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingPeriod("yearly")}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
              billingPeriod === "yearly"
                ? "bg-white dark:bg-zinc-900 text-zinc-950 dark:text-zinc-100 shadow-sm"
                : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-450 dark:hover:text-zinc-350"
            }`}
          >
            Yearly
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">Save 20%</span>
          </button>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Tier: FREE */}
        <div className="bg-zinc-50/50 dark:bg-zinc-950/20 border border-zinc-200 dark:border-zinc-900 rounded-xl p-5 flex flex-col justify-between transition hover:border-zinc-300 dark:hover:border-zinc-800/80 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.01)]">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold tracking-widest uppercase text-zinc-500 dark:text-zinc-600">Free Tier</span>
              {currentPlan === "FREE" && (
                <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 bg-zinc-200/50 dark:bg-zinc-900/60 px-2 py-0.5 rounded-full">Current Plan</span>
              )}
            </div>
            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">₹0</span>
              <span className="text-xs text-zinc-500 dark:text-zinc-450">/ month</span>
            </div>
            <ul className="space-y-2.5 mb-6 text-sm text-zinc-500 dark:text-zinc-400">
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>Up to 2 active monitor streams</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>10-minute standard polling</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>Basic email notifications</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-zinc-400 dark:text-zinc-650">✗</span>
                <span className="text-zinc-400 dark:text-zinc-650">Discord webhook channel alerts</span>
              </li>
            </ul>
          </div>
          <button
            disabled
            className="w-full text-center text-xs font-semibold bg-zinc-200/50 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-600 border border-zinc-300/30 dark:border-zinc-800 px-4 py-2.5 rounded-lg cursor-not-allowed shadow-[inset_0_1px_0_0_rgba(255,255,255,0.01)]"
          >
            {currentPlan === "FREE" ? "Active" : "Downgrade"}
          </button>
        </div>

        {/* Tier: PRO */}
        <div className="bg-zinc-50/50 dark:bg-zinc-950/20 border border-zinc-200 dark:border-zinc-900 rounded-xl p-5 flex flex-col justify-between transition hover:border-zinc-300 dark:hover:border-zinc-800/80 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.01)] relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[9px] uppercase tracking-widest font-bold px-3 py-1 rounded-bl-lg border-l border-b border-emerald-500/10">Popular</div>
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold tracking-widest uppercase text-emerald-600 dark:text-emerald-500/60">Pro Tier</span>
              {currentPlan === "PRO" && (
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">Current Plan</span>
              )}
            </div>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                {billingPeriod === "monthly" ? "₹499" : "₹399"}
              </span>
              <span className="text-xs text-zinc-500 dark:text-zinc-450">/ month</span>
            </div>
            <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mb-4">
              {billingPeriod === "yearly" ? "Billed annually (₹4,788/yr)" : "Billed monthly"}
            </p>
            <ul className="space-y-2.5 mb-6 text-sm text-zinc-500 dark:text-zinc-400">
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>Up to 20 active monitor streams</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>1-minute high-frequency polling</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>Discord webhook alert channels</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>7-day telemetry log archive</span>
              </li>
            </ul>
          </div>
          <button
            onClick={() => handleUpgrade("PRO")}
            disabled={isPending || currentPlan === "PRO"}
            className="w-full text-center text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-950 disabled:bg-zinc-200/50 dark:disabled:bg-zinc-900 disabled:text-zinc-500 dark:disabled:text-zinc-650 px-4 py-2.5 rounded-lg cursor-pointer disabled:cursor-not-allowed shadow-md transition"
          >
            {isPending ? "Connecting..." : currentPlan === "PRO" ? "Current Plan" : "Upgrade to Pro"}
          </button>
        </div>

        {/* Tier: BUSINESS */}
        <div className="bg-zinc-50/50 dark:bg-zinc-950/20 border border-zinc-200 dark:border-zinc-900 rounded-xl p-5 flex flex-col justify-between transition hover:border-zinc-300 dark:hover:border-zinc-800/80 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.01)]">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold tracking-widest uppercase text-indigo-600 dark:text-indigo-400">Business Tier</span>
              {currentPlan === "BUSINESS" && (
                <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full">Current Plan</span>
              )}
            </div>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                {billingPeriod === "monthly" ? "₹1,499" : "₹1,199"}
              </span>
              <span className="text-xs text-zinc-500 dark:text-zinc-455">/ month</span>
            </div>
            <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mb-4">
              {billingPeriod === "yearly" ? "Billed annually (₹14,388/yr)" : "Billed monthly"}
            </p>
            <ul className="space-y-2.5 mb-6 text-sm text-zinc-500 dark:text-zinc-400">
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span className="font-semibold text-zinc-900 dark:text-zinc-200">Unlimited monitor streams</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>30-second real-time polling</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>Slack/Discord/Custom webhooks</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>30-day log persistence</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>Multi-seat team dashboards</span>
              </li>
            </ul>
          </div>
          <button
            onClick={() => handleUpgrade("BUSINESS")}
            disabled={isPending || currentPlan === "BUSINESS"}
            className="w-full text-center text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-950 disabled:bg-zinc-200/50 dark:disabled:bg-zinc-900 disabled:text-zinc-500 dark:disabled:text-zinc-650 px-4 py-2.5 rounded-lg cursor-pointer disabled:cursor-not-allowed shadow-md transition"
          >
            {isPending ? "Connecting..." : currentPlan === "BUSINESS" ? "Current Plan" : "Upgrade to Business"}
          </button>
        </div>

      </div>

      {/* Feedback Toast */}
      {feedback && (
        <div className={`mt-6 flex items-center gap-2.5 text-sm font-mono border px-3.5 py-2.5 rounded-lg ${
          feedback.type === "success"
            ? "text-emerald-600 dark:text-emerald-450 bg-emerald-500/[0.04] border-emerald-500/15"
            : feedback.type === "error"
            ? "text-rose-600 dark:text-rose-400 bg-rose-500/[0.04] border-rose-500/15"
            : "text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800"
        }`} role="status">
          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
            feedback.type === "success" ? "bg-emerald-500" : feedback.type === "error" ? "bg-rose-500" : "bg-zinc-450"
          }`} />
          <span>
            <span className="font-bold">{feedback.type === "success" ? "ok //" : feedback.type === "error" ? "error //" : "info //"}</span> {feedback.message}
          </span>
        </div>
      )}

      {/* Security Info */}
      <p className="text-center text-xs text-zinc-400 dark:text-zinc-650 mt-6">
        Transactions processed securely via Razorpay standard test checkout loops. Plan modifications auto-synchronize in Neon database instances.
      </p>

    </section>
  );
}
