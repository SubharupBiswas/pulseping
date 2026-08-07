import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import DotGridHero from "@/components/landing/DotGridHero";
import MagnetCTA from "@/components/landing/MagnetCTA";
import BentoFeatures from "@/components/landing/BentoFeatures";
import Footer from "@/components/Footer";
import { db } from "@/lib/db";

export const revalidate = 10; // Refresh live stats every 10 seconds

async function getLiveStats() {
  let activeStreams = 4;
  let totalPings = 124500;
  let avgLatency = 42;

  try {
    activeStreams = await db.monitor.count({ where: { isActive: true } }).catch(() => 4);
  } catch {
    // Silent fallback when DB is offline
  }

  try {
    totalPings = await db.pingLog.count().catch(() => 124500);
  } catch {
    // Silent fallback
  }

  try {
    const agg = await db.pingLog.aggregate({
      _avg: { latency: true },
    }).catch(() => null);
    if (agg?._avg?.latency) {
      avgLatency = Math.round(agg._avg.latency);
    }
  } catch {
    // Silent fallback
  }

  return { activeStreams, totalPings, avgLatency, systemStatus: "Operational" };
}

export default async function LandingPage() {
  const stats = await getLiveStats();

  return (
    <div className="min-h-screen bg-sky-50/60 dark:bg-[#030303] text-zinc-900 dark:text-zinc-100 selection:bg-emerald-500/10 selection:text-emerald-500 font-sans antialiased relative overflow-x-hidden transition-colors duration-250">

      {/* === Ambient glow blobs === */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[480px] bg-gradient-to-tr from-emerald-500/10 via-indigo-500/5 to-transparent blur-3xl pointer-events-none z-0 transform-gpu will-change-transform" />
      <div className="absolute top-[340px] right-[-8%] w-[420px] h-[420px] bg-gradient-to-tr from-indigo-500/10 via-purple-500/5 to-transparent blur-3xl pointer-events-none z-0 rounded-full transform-gpu will-change-transform" />
      <div className="absolute top-[200px] left-[-6%] w-[320px] h-[320px] bg-gradient-to-tr from-emerald-500/10 to-transparent blur-3xl pointer-events-none z-0 rounded-full transform-gpu will-change-transform" />

      {/* === Relative layout wrapper === */}
      <div className="relative z-10 flex flex-col min-h-screen">

        {/* ── Navigation Header ── */}
        <Navbar />

        {/* ── Main content area ── */}
        <main className="flex-1">

          {/* ── Hero Section ── */}
          <section
            className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 pb-16 sm:pb-20 text-center overflow-hidden"
            aria-labelledby="hero-title"
          >
            {/* Interactive dot-grid background */}
            <DotGridHero />

            {/* Operational Status Micro-Badge */}
            <div className="relative z-10 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-800/60 bg-sky-50/80 dark:bg-zinc-900/25 backdrop-blur-sm mb-8 shadow-sm transition-colors animate-fade-up">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.55)]" />
              <span className="text-xs font-semibold tracking-wider text-zinc-700 dark:text-zinc-300 uppercase">
                AUTOMATED UPTIME MONITORING &amp; ALERTING
              </span>
            </div>

            {/* Hero Title — Balanced Typography */}
            <h1
              id="hero-title"
              className="relative z-10 text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight leading-[1.15] max-w-5xl mx-auto mb-6 text-center [text-wrap:balance]"
            >
              <span className="block text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm font-bold tracking-widest uppercase mb-3">
                PulsePing Platform
              </span>
              <span className="block text-zinc-900 dark:text-zinc-50">
                Uptime monitoring &amp; incident alerting
              </span>
              <span className="block text-emerald-600 dark:text-emerald-400 mt-1 sm:mt-2">
                built for production teams.
              </span>
            </h1>

            {/* Supporting Description */}
            <p className="relative z-10 text-zinc-600 dark:text-zinc-300 text-base sm:text-lg max-w-xl mx-auto leading-relaxed mb-10 animate-fade-up [animation-delay:0.5s] opacity-0 [animation-fill-mode:forwards]">
              PulsePing is an automated uptime monitoring and incident alerting platform. Track target API endpoints, log response telemetry, and dispatch real-time alerts via Discord, Telegram, and Email the instant a domain degrades.
            </p>

            {/* Magnetic CTA buttons */}
            <div className="relative z-10 flex items-center justify-center gap-4 flex-wrap animate-fade-up [animation-delay:0.65s] opacity-0 [animation-fill-mode:forwards]">
              <MagnetCTA>
                <Link
                  href="/dashboard"
                  aria-label="Launch Free Workspace"
                  className="btn-shimmer inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[44px] bg-zinc-950 hover:bg-zinc-900 dark:bg-zinc-50 dark:hover:bg-white text-zinc-100 dark:text-zinc-950 font-bold text-sm rounded-xl transition duration-150 shadow-lg cursor-pointer"
                >
                  Launch Free Workspace
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              </MagnetCTA>
              <MagnetCTA>
                <a
                  href="https://github.com/SubharupBiswas/pulseping"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="View Source Code on GitHub"
                  className="btn-shimmer inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[44px] bg-white/90 hover:bg-sky-50 dark:bg-zinc-900/50 dark:hover:bg-zinc-900 text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-zinc-100 border border-zinc-200 dark:border-zinc-800/80 font-semibold text-sm rounded-xl transition duration-150 cursor-pointer shadow-sm"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                  View Source
                </a>
              </MagnetCTA>
            </div>

            {/* Feature Pills */}
            <div className="relative z-10 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 max-w-xs sm:max-w-none mx-auto px-2 mt-10 animate-fade-up [animation-delay:0.8s] opacity-0 [animation-fill-mode:forwards]">
              {["10-sec polling cycles", "Discord & Telegram alerts", "Resend Email dispatch", "PostgreSQL log persistence"].map((feat) => (
                <span
                  key={feat}
                  className="text-[10px] sm:text-xs font-mono font-medium px-2.5 py-1 rounded-full border border-zinc-200 dark:border-zinc-800 bg-sky-50/80 dark:bg-zinc-900/80 text-zinc-700 dark:text-zinc-300"
                >
                  {feat}
                </span>
              ))}
            </div>
          </section>

          {/* ── Blueprint Dashboard Preview ── */}
          <section
            className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 sm:pb-28"
            aria-label="Console Dashboard Preview"
          >
            <div className="bg-white/90 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-1.5 shadow-sm backdrop-blur-md transition-colors duration-250 w-full max-w-full overflow-hidden">
              <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl bg-sky-50/80 dark:bg-zinc-950 overflow-hidden">

                {/* Window Chrome */}
                <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 px-3 sm:px-5 py-2.5 sm:py-3 bg-sky-50/40 dark:bg-transparent min-w-0">
                  <div className="flex items-center gap-1.5 shrink-0">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-400/70 dark:bg-zinc-800" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400/70 dark:bg-zinc-800" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/70 dark:bg-zinc-800" />
                  </div>
                  <span className="font-mono text-[9px] sm:text-xs text-zinc-600 dark:text-zinc-400 tracking-tight select-none truncate max-w-[150px] xs:max-w-xs sm:max-w-none text-center">
                    LIVE PREVIEW DEMO <span className="hidden xs:inline">· pulseping.subharup.com</span>
                  </span>
                  <div className="w-8 sm:w-12 shrink-0" />
                </div>

                {/* Stats matrix */}
                <div className="grid grid-cols-3 divide-x divide-zinc-200 dark:divide-zinc-800 border-b border-zinc-200 dark:border-zinc-800 bg-sky-50/80 dark:bg-zinc-900/50 text-center gap-1 p-2 sm:p-4">
                  {/* Active Streams */}
                  <div className="flex flex-col items-center justify-center min-w-0 px-0.5 sm:px-3">
                    <span className="text-[8px] xs:text-[10px] sm:text-xs font-mono font-medium uppercase tracking-tight text-zinc-500 dark:text-zinc-400 truncate max-w-full">
                      Active Streams
                    </span>
                    <p className="text-xs sm:text-base font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">
                      {stats.activeStreams} <span className="text-[10px] text-zinc-400 font-normal">/ ∞</span>
                    </p>
                  </div>

                  {/* System Status */}
                  <div className="flex flex-col items-center justify-center min-w-0 px-0.5 sm:px-3">
                    <span className="text-[8px] xs:text-[10px] sm:text-xs font-mono font-medium uppercase tracking-tight text-zinc-500 dark:text-zinc-400 truncate max-w-full">
                      System Status
                    </span>
                    <div className="flex items-center justify-center gap-1 mt-0.5 max-w-full min-w-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
                      <span className="text-xs sm:text-base font-bold text-emerald-600 dark:text-emerald-400 truncate min-w-0 flex-1">
                        {stats.systemStatus}
                      </span>
                    </div>
                  </div>

                  {/* Avg Latency */}
                  <div className="flex flex-col items-center justify-center min-w-0 px-0.5 sm:px-3">
                    <span className="text-[8px] xs:text-[10px] sm:text-xs font-mono font-medium uppercase tracking-tight text-zinc-500 dark:text-zinc-400 truncate max-w-full">
                      Avg Latency
                    </span>
                    <p className="text-xs sm:text-base font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">
                      {stats.avgLatency}ms <span className="text-[10px] text-zinc-400 font-normal hidden xs:inline">avg</span>
                    </p>
                  </div>
                </div>

                {/* Monitor rows */}
                <div className="p-3 sm:p-5 space-y-2.5 overflow-x-auto">
                  {[
                    { url: "https://api.example.com/v1/health", latency: `${stats.avgLatency}ms`, code: 200, up: true },
                    { url: "https://auth.internal.io/verify", latency: "112ms", code: 200, up: true },
                    { url: "https://cdn.assets.dev/ping", latency: "21ms", code: 200, up: true },
                    { url: "https://payments.gateway.io/status", latency: "—", code: 503, up: false },
                  ].map((item, i) => (
                    <div key={i} className="bg-white/90 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-4 shadow-sm transition-colors min-w-0">
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${item.up ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.45)]" : "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.45)]"}`} />
                        <span className="truncate font-mono text-[11px] sm:text-xs text-zinc-700 dark:text-zinc-300">{item.url}</span>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                        <span className="shrink-0 text-[10px] sm:text-xs text-amber-600 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded font-mono">{item.latency}</span>
                        <span className={`shrink-0 text-[10px] sm:text-xs font-mono font-semibold px-1.5 py-0.5 rounded ${item.up ? "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10" : "text-rose-600 dark:text-rose-500/85 bg-rose-500/10"}`}>{item.code}</span>
                        <div className="hidden sm:flex shrink-0 gap-0.5" aria-hidden="true">
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

          {/* ── Animated Bento Features Grid ── */}
          <BentoFeatures />

        </main>

        {/* ── Footer ── */}
        <Footer />

      </div>
    </div>
  );
}