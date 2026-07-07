import React from "react";
import Link from "next/link";
import { Show, UserButton } from "@clerk/nextjs";
import ThemeToggle from "@/components/ThemeToggle";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-200 selection:bg-emerald-500/10 selection:text-emerald-500 font-sans antialiased relative overflow-x-hidden transition-colors duration-250">

      {/* === Ambient Glow Backdrops — vibrant modern SaaS blur === */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[480px] bg-gradient-to-tr from-emerald-500/10 via-indigo-500/5 to-transparent blur-3xl pointer-events-none z-0" />
      <div className="absolute top-[340px] right-[-8%] w-[420px] h-[420px] bg-gradient-to-tr from-indigo-500/10 via-purple-500/5 to-transparent blur-3xl pointer-events-none z-0 rounded-full" />
      <div className="absolute top-[200px] left-[-6%] w-[320px] h-[320px] bg-gradient-to-tr from-emerald-500/10 to-transparent blur-3xl pointer-events-none z-0 rounded-full" />

      {/* === Relative layout wrapper === */}
      <div className="relative z-10 flex flex-col min-h-screen">

        {/* ── Sticky Navigation Header ── */}
        <header className="border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/75 dark:bg-zinc-950/60 backdrop-blur-xl sticky top-0 z-50 transition-colors duration-250">
          <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between" aria-label="Main Navigation">

            {/* Brand Logo Link */}
            <Link
              href="/"
              className="flex items-center gap-2.5 pointer-events-auto hover:opacity-90 transition duration-150"
              aria-label="PulsePing Homepage"
            >
              <div className="w-5 h-5 rounded-md bg-zinc-950 dark:bg-zinc-50 flex items-center justify-center shadow-[0_0_12px_rgba(255,255,255,0.08)]">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-50 dark:bg-zinc-950" />
              </div>
              <span className="font-semibold text-sm tracking-tight text-zinc-950 dark:text-zinc-100">PulsePing</span>
            </Link>

            {/* Navigation Actions */}
            <div className="flex items-center gap-x-4 md:gap-x-6">
              <Link
                href="/pricing"
                className="text-sm font-semibold text-zinc-650 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-200 transition duration-150"
              >
                Pricing
              </Link>
              <ThemeToggle />
              <Show when="signed-out">
                <Link
                  href="/sign-in"
                  className="text-sm font-semibold bg-zinc-900 hover:bg-zinc-800 text-zinc-100 border border-zinc-800 px-3.5 py-1.5 rounded-lg transition duration-150 cursor-pointer shadow-sm"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className="text-sm font-semibold bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-100 dark:hover:bg-white text-zinc-950 dark:text-zinc-950 border border-zinc-300 dark:border-zinc-800 px-3.5 py-1.5 rounded-lg transition duration-150 cursor-pointer shadow-sm hidden sm:inline-block"
                >
                  Sign Up
                </Link>
              </Show>
              <Show when="signed-in">
                <Link
                  href="/dashboard"
                  className="text-sm font-semibold bg-zinc-900 hover:bg-zinc-800 text-zinc-100 border border-zinc-800 px-3 py-1.5 rounded-lg transition duration-150 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.03)]"
                >
                  Console
                </Link>
                <UserButton />
              </Show>
            </div>
          </nav>
        </header>

        {/* ── Main content area ── */}
        <main className="flex-1">

          {/* ── Hero Section ── */}
          <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 pb-16 sm:pb-20 text-center" aria-labelledby="hero-title">
            
            {/* Operational Status Micro-Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-800/60 bg-white/70 dark:bg-zinc-900/25 backdrop-blur-sm mb-8 shadow-sm transition-colors">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.55)]" />
              <span className="text-xs font-semibold tracking-wider text-zinc-500 dark:text-zinc-400 uppercase">All Systems Operational</span>
            </div>

            {/* Hero Title */}
            <h1 id="hero-title" className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50 max-w-2xl mx-auto leading-[1.08] mb-6">
              Uptime monitoring built for{" "}
              <span className="bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 bg-clip-text text-transparent">
                production teams.
              </span>
            </h1>

            {/* Supporting Description */}
            <p className="text-zinc-500 dark:text-zinc-400 text-base max-w-lg mx-auto leading-relaxed mb-10">
              Zero-configuration endpoint tracking. Deploy serverless monitoring pipelines that log response telemetry and dispatch rich Discord embeds the instant a monitored domain degrades.
            </p>

            {/* Action CTA triggers */}
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Link
                href="/dashboard"
                className="px-5 py-2.5 bg-zinc-950 hover:bg-zinc-900 dark:bg-zinc-50 dark:hover:bg-white text-zinc-100 dark:text-zinc-950 font-bold text-sm rounded-lg transition duration-150 shadow-md cursor-pointer"
              >
                Launch Free Workspace
              </Link>
              <a
                href="https://github.com/SubharupBiswas/pulseping"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-white hover:bg-zinc-50 dark:bg-zinc-900/50 dark:hover:bg-zinc-900 text-zinc-700 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-200 border border-zinc-200 dark:border-zinc-800/80 font-semibold text-sm rounded-lg transition duration-150 cursor-pointer shadow-sm"
              >
                View Source
              </a>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 px-4 mt-10">
              {["10-min polling cycles", "Discord webhook alerts", "Tiered resource controls", "PostgreSQL log persistence"].map((feat) => (
                <span
                  key={feat}
                  className="text-xs text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 px-2.5 py-1 rounded-full font-semibold tracking-wide bg-white/70 dark:bg-zinc-900/30"
                >
                  {feat}
                </span>
              ))}
            </div>
          </section>

          {/* ── Blueprint Dashboard Preview ── */}
          <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 sm:pb-28" aria-label="Console Dashboard Preview">
            <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-1.5 shadow-sm backdrop-blur-md transition-colors duration-250">
              <div className="border border-zinc-200 dark:border-zinc-850 rounded-xl bg-zinc-50 dark:bg-zinc-950 overflow-hidden">

                {/* Window Chrome bar */}
                <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-850 px-5 py-3 bg-white/40 dark:bg-transparent">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-800" />
                    <div className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-800" />
                    <div className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-800" />
                  </div>
                  <span className="font-mono text-xs text-zinc-400 dark:text-zinc-650 tracking-tight select-none">pulseping.subnetmask.tech/console</span>
                  <div className="w-12" />
                </div>

                {/* Simulated Stats matrix */}
                <div className="grid grid-cols-3 gap-px border-b border-zinc-200 dark:border-zinc-850 bg-zinc-200 dark:bg-zinc-800/30">
                  {[
                    { label: "Active Streams", value: "4", sub: "/ unlimited" },
                    { label: "System Status", value: "Operational", sub: "all nodes", emerald: true },
                    { label: "Incidents (7d)", value: "0", sub: "no degradation" }
                  ].map((stat) => (
                    <div key={stat.label} className="bg-white dark:bg-zinc-900/50 px-5 py-4">
                      <span className="text-xs uppercase tracking-widest text-zinc-400 dark:text-zinc-500 font-bold block mb-1">{stat.label}</span>
                      <span className={`text-xl font-semibold tracking-tight ${stat.emerald ? "text-emerald-500 dark:text-emerald-400" : "text-zinc-900 dark:text-zinc-100"}`}>{stat.value}</span>
                      <span className="text-xs text-zinc-400 dark:text-zinc-600 ml-1.5">{stat.sub}</span>
                    </div>
                  ))}
                </div>

                {/* Simulated Monitor Row items */}
                <div className="p-5 space-y-2.5">
                  {[
                    { url: "https://api.example.com/v1/health", latency: "38ms", code: 200, up: true },
                    { url: "https://auth.internal.io/verify", latency: "112ms", code: 200, up: true },
                    { url: "https://cdn.assets.dev/ping", latency: "21ms", code: 200, up: true },
                    { url: "https://payments.gateway.io/status", latency: "—", code: 503, up: false },
                  ].map((item, i) => (
                    <div key={i} className="bg-white dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl px-4 py-3 flex items-center justify-between gap-4 shadow-sm transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${item.up ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.45)]" : "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.45)]"}`} />
                        <span className="font-mono text-sm text-zinc-700 dark:text-zinc-300 truncate">{item.url}</span>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-xs text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded font-mono">{item.latency}</span>
                        <span className={`text-xs font-mono font-semibold px-2 py-0.5 rounded ${item.up ? "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10" : "text-rose-600 dark:text-rose-500/85 bg-rose-500/10"}`}>{item.code}</span>
                        <div className="flex gap-0.5" aria-hidden="true">
                          {Array.from({ length: 12 }).map((_, j) => (
                            <div key={j} className={`h-3 w-0.5 rounded-full ${item.up ? "bg-emerald-500/20 border-l border-emerald-500/30" : j >= 10 ? "bg-rose-500/25 border-l border-rose-500/30" : "bg-emerald-500/20 border-l border-emerald-500/30"}`} />
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          </section>

          {/* ── Feature Grid ── */}
          <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 sm:pb-24" aria-labelledby="features-title">
            <h2 id="features-title" className="sr-only">Platform Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: "⬡",
                  title: "Serverless Cron Engine",
                  desc: "10-minute automated polling cycles powered by Vercel Cron, zero infrastructure overhead."
                },
                {
                  icon: "⬡",
                  title: "Discord Webhook Alerts",
                  desc: "Rich embed dispatch to your team channels the moment a monitored endpoint degrades below threshold."
                },
                {
                  icon: "⬡",
                  title: "PostgreSQL Log Archive",
                  desc: "Every check, latency reading, and status code stored durably in Neon PostgreSQL via Prisma 7."
                }
              ].map((feature) => (
                <div key={feature.title} className="flex flex-col justify-between h-full bg-white dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl p-5 shadow-sm transition-colors duration-250">
                  <div>
                    <span className="text-emerald-600 dark:text-emerald-400 text-lg mb-3 block" aria-hidden="true">{feature.icon}</span>
                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-200 mb-1.5 tracking-tight">{feature.title}</h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </main>

        {/* ── Footer ── */}
        <footer className="border-t border-zinc-200 dark:border-zinc-850 mt-auto bg-white/75 dark:bg-zinc-950/60 backdrop-blur-xl transition-colors duration-250">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-md bg-zinc-800 flex items-center justify-center">
                <div className="w-1 h-1 rounded-full bg-zinc-400" />
              </div>
              <span className="text-sm text-zinc-500 dark:text-zinc-400 font-semibold">PulsePing</span>
              <span className="text-sm text-zinc-400 dark:text-zinc-650 font-mono">© 2026</span>
            </div>
            <div className="flex items-center gap-5">
              <Link href="/pricing" className="text-sm text-zinc-550 hover:text-zinc-950 dark:text-zinc-500 dark:hover:text-zinc-300 transition duration-150">Pricing</Link>
              <Link href="/terms" className="text-sm text-zinc-550 hover:text-zinc-950 dark:text-zinc-500 dark:hover:text-zinc-300 transition duration-150">Terms</Link>
              <Link href="/privacy" className="text-sm text-zinc-550 hover:text-zinc-950 dark:text-zinc-500 dark:hover:text-zinc-300 transition duration-150">Privacy</Link>
              <Link href="/status" className="text-sm text-zinc-550 hover:text-zinc-950 dark:text-zinc-500 dark:hover:text-zinc-300 transition duration-150">Status</Link>
              <a href="https://github.com/SubharupBiswas/pulseping" target="_blank" rel="noopener noreferrer" className="text-sm text-zinc-550 hover:text-zinc-950 dark:text-zinc-500 dark:hover:text-zinc-300 transition duration-150">GitHub</a>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}
