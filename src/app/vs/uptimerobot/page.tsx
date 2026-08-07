import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "PulsePing vs UptimeRobot — Best Uptime Monitor Alternative 2025",
  description:
    "See how PulsePing compares to UptimeRobot in polling speed, pricing, AI diagnostics, and status pages. Switch to PulsePing for 30-second checks and real-time incident intelligence.",
  keywords: ["uptimerobot alternative", "pulseping vs uptimerobot", "uptime monitoring comparison", "best uptime monitor 2025"],
  openGraph: {
    title: "PulsePing vs UptimeRobot — Superior Monitoring at a Better Price",
    description:
      "PulsePing offers 30-second polling, AI root-cause diagnostics, and custom status pages — all at competitive pricing. See how we stack up against UptimeRobot.",
    type: "website",
  },
};

const TABLE_DATA = [
  { feature: "Free Plan Monitors", pulseping: "3 monitors", competitor: "50 monitors" },
  { feature: "Free Poll Interval", pulseping: "3 minutes", competitor: "5 minutes" },
  { feature: "Paid Poll Interval", pulseping: "30 seconds (Pro)", competitor: "1 minute (paid)" },
  { feature: "AI Root-Cause Diagnostics", pulseping: "✓ Built-in", competitor: "✗ Not available" },
  { feature: "Custom Status Pages", pulseping: "✓ Branded pages", competitor: "✓ Basic pages" },
  { feature: "Heartbeat / Dead-Man Switches", pulseping: "✓ All paid plans", competitor: "✓ Paid plans" },
  { feature: "Multi-HTTP Methods (POST/PUT)", pulseping: "✓ Pro & Business", competitor: "Partial" },
  { feature: "SSL Expiry Tracking", pulseping: "✓ Pro & Business", competitor: "✓ Paid" },
  { feature: "India (INR) Pricing", pulseping: "✓ Native INR support", competitor: "✗ USD only" },
  { feature: "Starting Paid Price", pulseping: "₹699/mo", competitor: "~₹1,700/mo (USD)" },
];

const REASONS = [
  {
    icon: "⚡",
    title: "30-Second Polling",
    body: "UptimeRobot's cheapest paid plan checks every 1 minute. PulsePing Pro probes every 30 seconds — catching incidents 2× faster.",
  },
  {
    icon: "🤖",
    title: "AI Incident Diagnostics",
    body: "When your site goes down, PulsePing's built-in AI engine analyzes the failure pattern and surfaces likely root causes — no manual log digging needed.",
  },
  {
    icon: "₹",
    title: "Native INR Pricing",
    body: "Indian teams shouldn't pay USD conversion markups. PulsePing offers transparent rupee pricing with no surprise FX fees.",
  },
  {
    icon: "🎛️",
    title: "Full HTTP Verb Support",
    body: "Test POST, PUT, PATCH, and DELETE endpoints — not just simple GET pings. PulsePing is built for modern API monitoring, not just website uptime.",
  },
];

export default function VsUptimeRobotPage() {
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
            PulsePing <span className="text-zinc-400 dark:text-zinc-500">vs</span> UptimeRobot
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            UptimeRobot pioneered free uptime monitoring. PulsePing takes it further — with AI-powered incident intelligence,
            30-second checks, and pricing built for Indian teams.
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
                <th className="py-3 px-4 text-center text-zinc-500 dark:text-zinc-500 font-semibold text-sm">UptimeRobot</th>
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
          <h2 className="text-2xl font-bold text-center mb-8 text-zinc-900 dark:text-zinc-100">Why Teams Switch from UptimeRobot</h2>
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

        {/* CTA */}
        <section className="text-center rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-10">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">Ready to switch?</h2>
          <p className="text-zinc-500 dark:text-zinc-400 mb-6">
            PulsePing&apos;s free tier gets you started in minutes — no credit card required.
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
