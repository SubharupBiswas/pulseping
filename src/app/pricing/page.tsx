"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { motion, AnimatePresence } from "framer-motion";

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

export default function PricingPage() {
  const [currency, setCurrency] = useState<"INR" | "USD">("INR");

  useEffect(() => {
    try {
      const isIndia = Intl.DateTimeFormat().resolvedOptions().timeZone === "Asia/Kolkata";
      if (!isIndia) setCurrency("USD");
    } catch {
      // fallback to INR
    }
  }, []);

  const pricingPlans = [
    {
      name: "Free",
      price: currency === "INR" ? "₹0" : "$0",
      period: "forever",
      description: "Essential status checking parameters for personal services.",
      features: [
        "2 active monitor streams",
        "10-minute polling cycles",
        "Discord webhook alerts",
        "90-day log history retention",
        "Basic response code telemetry",
      ],
      cta: "Get Started for Free",
      href: "/sign-up?redirect=/dashboard",
      popular: false,
    },
    {
      name: "Pro",
      price: currency === "INR" ? "₹499" : "$7",
      period: "per month",
      description: "Expanded limits and faster resolution loops for production pipelines.",
      features: [
        "20 active monitor streams",
        "1-minute polling cycles",
        "Instant Discord webhook alerts",
        "365-day log history retention",
        "Priority telemetry logging",
        "Enhanced response time graphs",
      ],
      cta: "Upgrade to Pro",
      href: `/sign-up?redirect=/dashboard/billing&currency=${currency}`,
      popular: true,
    },
    {
      name: "Business",
      price: currency === "INR" ? "₹1,499" : "$20",
      period: "per month",
      description: "Dedicated scaling limits and custom SLA validation profiles.",
      features: [
        "Unlimited monitor streams",
        "30-second polling cycles",
        "Dedicated response nodes",
        "Multi-channel webhook integrations",
        "SLA custom validation logs",
        "Priority developer support",
      ],
      cta: "Contact Sales",
      href: `mailto:support@subnetmask.tech?subject=PulsePing%20Business%20Tier%20Onboarding%20(${currency})`,
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
    <div className="min-h-screen bg-white text-zinc-900 dark:bg-[#030303] dark:text-zinc-100 font-sans antialiased relative overflow-x-hidden transition-colors duration-250">

      {/* Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[480px] bg-gradient-to-tr from-emerald-500/[0.03] via-indigo-500/[0.015] to-transparent blur-3xl pointer-events-none z-0" />

      {/* Sticky Header */}
      <Navbar activeLink="pricing" />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 relative z-10">

        {/* Hero Header */}
        <section className="text-center mb-10" aria-labelledby="pricing-title">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xs font-bold tracking-widest uppercase text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 bg-emerald-500/[0.04] px-2.5 py-1 rounded-full mb-4 inline-block"
          >
            Pricing Plans
          </motion.span>
          <motion.h1
            id="pricing-title"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 240, damping: 22, delay: 0.1 }}
            className="text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50 leading-[1.1] mb-4"
          >
            Predictable Pricing for{" "}
            <span className="bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 bg-clip-text text-transparent">
              Production Teams.
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22, duration: 0.5 }}
            className="text-zinc-500 dark:text-zinc-400 text-base max-w-lg mx-auto leading-relaxed"
          >
            Monitor API endpoints and resolve outage alerts instantly. Zero configuration required to start status log archiving.
          </motion.p>
        </section>

        {/* ── Hover.dev sliding pill currency selector ── */}
        <div className="flex items-center justify-center mb-12">
          <div className="relative inline-flex p-1 rounded-xl bg-zinc-100 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800">
            {(["INR", "USD"] as const).map((cur) => (
              <button
                key={cur}
                onClick={() => setCurrency(cur)}
                className="relative z-10 px-5 py-2 text-xs font-bold rounded-lg transition-colors duration-150"
                style={{ color: currency === cur ? undefined : undefined }}
                aria-pressed={currency === cur}
              >
                {/* Sliding pill indicator — layoutId slides underneath */}
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
        </div>

        {/* ── Three-Tier Card Grid — stagger entrance ── */}
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
                    : "bg-white dark:bg-zinc-900/20 border border-zinc-200 dark:border-zinc-800 shadow-sm"
                }`}
                whileHover={{ scale: plan.popular ? 1.015 : 1.01, transition: { type: "spring", stiffness: 300, damping: 22 } }}
              >
                {plan.popular && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full shadow-sm">
                    Most Popular
                  </span>
                )}

                <div>
                  <h3 className="text-base font-bold text-zinc-950 dark:text-zinc-50 tracking-tight">{plan.name} Plan</h3>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1.5">{plan.description}</p>

                  {/* ── Animated price — exits up, enters down on currency toggle ── */}
                  <div className="my-5 flex items-baseline gap-1 overflow-hidden">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={`${plan.name}-${currency}`}
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

                  <div className="border-t border-zinc-200 dark:border-zinc-800 pt-5 mb-8">
                    <ul className="space-y-3" aria-label={`Included features for ${plan.name} plan`}>
                      {plan.features.map((feat) => (
                        <li key={feat} className="flex items-start gap-2.5 text-xs text-zinc-600 dark:text-zinc-400">
                          <svg className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24" aria-hidden="true" width="14" height="14">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

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
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* FAQ */}
        <section className="border-t border-zinc-200 dark:border-zinc-800 pt-16 max-w-3xl mx-auto" aria-labelledby="faq-title">
          <h2 id="faq-title" className="text-lg sm:text-xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 text-center mb-10">
            Frequently Asked Questions
          </h2>
          <motion.div
            className="space-y-6"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-40px" }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
          >
            {faqItems.map((faq) => (
              <motion.div
                key={faq.question}
                variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 220, damping: 22 } } }}
                className="border border-zinc-200 dark:border-zinc-900/60 rounded-xl px-5 py-4 bg-zinc-50/20 dark:bg-transparent transition-colors hover:border-zinc-300 dark:hover:border-zinc-800"
              >
                <h3 className="text-sm font-semibold text-zinc-950 dark:text-zinc-100 tracking-tight">{faq.question}</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed mt-1.5">{faq.answer}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white/75 dark:bg-zinc-950/60 backdrop-blur-xl transition-colors duration-250">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <span className="text-sm text-zinc-500 dark:text-zinc-600">PulsePing © 2026</span>
          <div className="flex items-center gap-4">
            <Link href="/pricing" className="text-sm text-zinc-500 hover:text-zinc-950 dark:text-zinc-500 dark:hover:text-zinc-300 transition duration-150">Pricing</Link>
            <Link href="/status" className="text-sm text-zinc-500 hover:text-zinc-950 dark:text-zinc-500 dark:hover:text-zinc-300 transition duration-150">Status</Link>
            <Link href="/terms" className="text-sm text-zinc-500 hover:text-zinc-950 dark:text-zinc-500 dark:hover:text-zinc-300 transition duration-150">Terms</Link>
            <Link href="/privacy" className="text-sm text-zinc-500 hover:text-zinc-950 dark:text-zinc-500 dark:hover:text-zinc-300 transition duration-150">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
