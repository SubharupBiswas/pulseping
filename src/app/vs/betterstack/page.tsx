import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "PulsePing vs Better Stack — Best Uptime Monitor Alternative 2025",
  description:
    "Compare PulsePing and Better Stack (formerly Logtail / Betterstack) on pricing, polling speed, AI diagnostics, and INR support. Switch to PulsePing for smarter, faster uptime monitoring.",
  keywords: ["betterstack alternative", "better stack alternative", "pulseping vs betterstack", "uptime monitoring comparison", "logtail alternative"],
  openGraph: {
    title: "PulsePing vs Better Stack — Smarter Monitoring at a Lower Price",
    description:
      "PulsePing delivers 30-second checks, AI-powered incident analysis, and native INR pricing — without the Better Stack price premium. Compare now.",
    type: "website",
  },
};

const TABLE_DATA = [
  { feature: "Free Plan Monitors", pulseping: "2 monitors", competitor: "0 (trial only)" },
  { feature: "Free Poll Interval", pulseping: "3 minutes", competitor: "Not available (paid only)" },
  { feature: "Paid Poll Interval", pulseping: "30 seconds (Pro)", competitor: "30 seconds (mid-tier)" },
  { feature: "AI Root-Cause Diagnostics", pulseping: "✓ Built-in (Pro+)", competitor: "Partial (separate AI product)" },
  { feature: "Custom Status Pages", pulseping: "✓ All plans", competitor: "✓ Paid plans" },
  { feature: "Heartbeat / Dead-Man Switches", pulseping: "✓ Pro & Business", competitor: "✓ Paid plans" },
  { feature: "Multi-HTTP Methods (POST/PUT)", pulseping: "✓ Pro & Business", competitor: "✓ Paid plans" },
  { feature: "SSL Expiry Tracking", pulseping: "✓ Pro & Business", competitor: "✓ Paid plans" },
  { feature: "India (INR) Pricing", pulseping: "✓ Native INR support", competitor: "✗ USD only" },
  { feature: "Starting Paid Price", pulseping: "₹699/mo", competitor: "$25+/mo" },
  { feature: "Log Management Bundled", pulseping: "Focused monitoring", competitor: "✓ Full observability stack" },
];

const REASONS = [
  {
    icon: "💸",
    title: "10× Better Value",
    body: "Better Stack's cheapest paid plan starts at ~$25/month. PulsePing Pro starts at ₹699/month (~$8.50) — same 30-second polling, no compromise.",
  },
  {
    icon: "🤖",
    title: "Purpose-Built AI Diagnostics",
    body: "PulsePing's AI is laser-focused on uptime incidents — analyzing failure cascades, timeout patterns, and DNS resolution to pinpoint root causes instantly.",
  },
  {
    icon: "🚀",
    title: "Zero Learning Curve",
    body: "Better Stack bundles logging, tracing, and on-call management into a sprawling platform. PulsePing stays focused: monitor endpoints, get alerted fast, fix incidents.",
  },
  {
    icon: "🌏",
    title: "Built for Indian Teams",
    body: "Native INR billing, Razorpay checkout, and pricing that respects Indian purchasing power. No USD conversion or currency surprise on your bank statement.",
  },
];

export default function VsBetterStackPage() {
  return (
    <div className="min-h-screen bg-sky-50 dark:bg-[#030303] text-zinc-900 dark:text-zinc-100 font-sans antialiased">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-28">
        {/* Hero */}
        <section className="text-center mb-16">
          <span className="inline-block text-xs font-bold tracking-widest uppercase text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 bg-emerald-500/[0.04] px-3 py-1 rounded-full mb-4">
            Comparison
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight mb-4">
            PulsePing <span className="text-zinc-400 dark:text-zinc-500">vs</span> Better Stack
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Better Stack is a powerful full-stack observability platform — but if you need focused, affordable uptime
            monitoring with AI intelligence, PulsePing delivers more for less.
          </p>
          <div className="flex justify-center gap-3 mt-8">
            <Link
              href="/sign-up"
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl transition-colors text-sm"
            >
              Start Free — No Card Required
            </Link>
            <Link
              href="/pricing"
              className="px-6 py-3 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 font-semibold rounded-xl transition-colors text-sm"
            >
              See Pricing
            </Link>
          </div>
        </section>

        {/* Comparison table */}
        <section className="mb-16 overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left py-3 px-4 text-zinc-500 dark:text-zinc-500 font-semibold text-xs uppercase tracking-wide w-1/3">Feature</th>
                <th className="py-3 px-4 text-center">
                  <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    PulsePing
                  </span>
                </th>
                <th className="py-3 px-4 text-center text-zinc-500 dark:text-zinc-500 font-semibold text-sm">Better Stack</th>
              </tr>
            </thead>
            <tbody>
              {TABLE_DATA.map((row, i) => (
                <tr
                  key={row.feature}
                  className={`border-t border-zinc-200 dark:border-zinc-800 ${i % 2 === 0 ? "bg-white/40 dark:bg-zinc-900/30" : ""}`}
                >
                  <td className="py-3.5 px-4 text-zinc-700 dark:text-zinc-300 font-medium">{row.feature}</td>
                  <td className="py-3.5 px-4 text-center text-emerald-700 dark:text-emerald-400 font-semibold">{row.pulseping}</td>
                  <td className="py-3.5 px-4 text-center text-zinc-500 dark:text-zinc-500">{row.competitor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Why Switch section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8 text-zinc-900 dark:text-zinc-100">Why Teams Choose PulsePing Over Better Stack</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {REASONS.map((r) => (
              <div
                key={r.title}
                className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/40"
              >
                <p className="text-2xl mb-2">{r.icon}</p>
                <h3 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">{r.title}</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{r.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* When Better Stack is better */}
        <section className="mb-16 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/30">
          <h2 className="font-bold text-zinc-900 dark:text-zinc-100 mb-2">When should you use Better Stack?</h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            If your team needs a unified observability platform — structured log management, distributed tracing, and on-call scheduling in one place — Better Stack is a solid choice. PulsePing is purpose-built for uptime monitoring and incident alerting.
          </p>
        </section>

        {/* CTA */}
        <section className="text-center rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-10">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">Ready to try PulsePing?</h2>
          <p className="text-zinc-500 dark:text-zinc-400 mb-6">
            Free plan, no credit card. Be up and monitoring in 60 seconds.
          </p>
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl transition-colors"
          >
            Create Free Account
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}
