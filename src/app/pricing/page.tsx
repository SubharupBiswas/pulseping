import React from "react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

export const metadata = {
  title: "Pricing | PulsePing",
  description: "Predictable, developer-first pricing plans for PulsePing uptime monitoring. Choose from Free, Pro, and Business tiers to satisfy your endpoint monitoring SLA targets.",
};

const pricingPlans = [
  {
    name: "Free",
    price: "₹0",
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
    price: "₹499",
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
    href: "/sign-up?redirect=/dashboard/billing",
    popular: true,
  },
  {
    name: "Business",
    price: "₹1,499",
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
    href: "mailto:support@pulseping.io?subject=PulsePing%20Business%20Tier%25Onboarding",
    popular: false,
  },
];

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
  return (
    <div className="min-h-screen bg-white text-zinc-900 dark:bg-[#030303] dark:text-zinc-100 font-sans antialiased relative overflow-x-hidden transition-colors duration-250">
      
      {/* Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[480px] bg-gradient-to-tr from-emerald-500/[0.03] via-indigo-500/[0.015] to-transparent blur-3xl pointer-events-none z-0" />

      {/* Sticky Header */}
      <nav className="sticky top-0 z-50 border-b border-zinc-200 dark:border-zinc-900/60 bg-white/75 dark:bg-[#030303]/60 backdrop-blur-xl transition-colors duration-250">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group pointer-events-auto">
            <div className="w-5 h-5 rounded-md bg-zinc-950 dark:bg-zinc-50 flex items-center justify-center shadow-[0_0_10px_rgba(255,255,255,0.06)] group-hover:bg-zinc-800 dark:group-hover:bg-zinc-200 transition duration-150">
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-50 dark:bg-zinc-950" />
            </div>
            <span className="font-semibold text-sm tracking-tight text-zinc-950 dark:text-zinc-100">PulsePing</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/pricing" className="text-sm font-semibold text-zinc-950 dark:text-zinc-100 transition duration-150">Pricing</Link>
            <ThemeToggle />
            <Link href="/terms" className="text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-zinc-300 transition duration-150">Terms</Link>
            <Link href="/privacy" className="text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-zinc-300 transition duration-150">Privacy</Link>
            <Link href="/dashboard" className="text-sm font-semibold bg-zinc-900 hover:bg-zinc-800 text-zinc-100 border border-zinc-800 px-3 py-1.5 rounded-lg transition duration-150 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.03)]">Console</Link>
          </div>
        </div>
      </nav>

      {/* Hero Header */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 relative z-10">
        <section className="text-center mb-16" aria-labelledby="pricing-title">
          <span className="text-xs font-bold tracking-widest uppercase text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 bg-emerald-500/[0.04] px-2.5 py-1 rounded-full mb-4 inline-block">Pricing Plans</span>
          <h1 id="pricing-title" className="text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50 leading-[1.1] mb-4">
            Predictable Pricing for{" "}
            <span className="bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 bg-clip-text text-transparent">
              Production Teams.
            </span>
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-base max-w-lg mx-auto leading-relaxed">
            Monitor API endpoints and resolve outage alerts instantly. Zero configuration required to start status log archiving.
          </p>
        </section>

        {/* Three-Tier Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24" aria-label="Subscription plans matrix">
          {pricingPlans.map((plan) => (
            <div
              key={plan.name}
              className={`flex flex-col justify-between rounded-2xl p-6 transition-all duration-200 ${
                plan.popular
                  ? "bg-zinc-50/50 dark:bg-zinc-900/40 border-2 border-emerald-500/60 shadow-[0_0_24px_rgba(16,185,129,0.08)] relative"
                  : "bg-white dark:bg-zinc-900/20 border border-zinc-200 dark:border-zinc-850 shadow-sm"
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full shadow-sm">
                  Most Popular
                </span>
              )}

              <div>
                <h3 className="text-base font-bold text-zinc-950 dark:text-zinc-50 tracking-tight">{plan.name} Plan</h3>
                <p className="text-xs text-zinc-400 dark:text-zinc-550 mt-1.5">{plan.description}</p>
                <div className="my-5 flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-extrabold text-zinc-950 dark:text-zinc-50">{plan.price}</span>
                  <span className="text-xs text-zinc-400 dark:text-zinc-550">/ {plan.period}</span>
                </div>

                <div className="border-t border-zinc-200 dark:border-zinc-850 pt-5 mb-8">
                  <ul className="space-y-3" aria-label={`Included features for ${plan.name} plan`}>
                    {plan.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2.5 text-xs text-zinc-600 dark:text-zinc-400">
                        <svg className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24" aria-hidden="true">
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
                className={`w-full py-2.5 rounded-lg text-center text-xs font-bold transition duration-150 block ${
                  plan.popular
                    ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/10"
                    : "bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-50 dark:hover:bg-white dark:text-zinc-950 border border-zinc-200 dark:border-transparent shadow-sm"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </section>

        {/* Razorpay Compliance FAQ Section */}
        <section className="border-t border-zinc-200 dark:border-zinc-850 pt-16 max-w-3xl mx-auto" aria-labelledby="faq-title">
          <h2 id="faq-title" className="text-lg sm:text-xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 text-center mb-10">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqItems.map((faq) => (
              <div key={faq.question} className="border border-zinc-200 dark:border-zinc-900/60 rounded-xl px-5 py-4 bg-zinc-50/20 dark:bg-transparent transition-colors">
                <h3 className="text-sm font-semibold text-zinc-950 dark:text-zinc-100 tracking-tight">{faq.question}</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed mt-1.5">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-850 bg-white/75 dark:bg-zinc-950/60 backdrop-blur-xl transition-colors duration-250">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <span className="text-sm text-zinc-500 dark:text-zinc-650">PulsePing © 2026</span>
          <div className="flex items-center gap-4">
            <Link href="/pricing" className="text-sm text-zinc-555 hover:text-zinc-950 dark:text-zinc-500 dark:hover:text-zinc-300 transition duration-150">Pricing</Link>
            <Link href="/status" className="text-sm text-zinc-555 hover:text-zinc-950 dark:text-zinc-500 dark:hover:text-zinc-300 transition duration-150">Status</Link>
            <Link href="/terms" className="text-sm text-zinc-555 hover:text-zinc-950 dark:text-zinc-500 dark:hover:text-zinc-300 transition duration-150">Terms</Link>
            <Link href="/privacy" className="text-sm text-zinc-555 hover:text-zinc-950 dark:text-zinc-500 dark:hover:text-zinc-300 transition duration-150">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
