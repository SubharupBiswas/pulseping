import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import DotGridHero from "@/components/landing/DotGridHero";
import MagnetCTA from "@/components/landing/MagnetCTA";
import BentoFeatures from "@/components/landing/BentoFeatures";
import HeroText from "@/components/landing/HeroText";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-200 selection:bg-emerald-500/10 selection:text-emerald-500 font-sans antialiased relative overflow-x-hidden transition-colors duration-250">

      {/* === Ambient glow blobs === */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[480px] bg-gradient-to-tr from-emerald-500/10 via-indigo-500/5 to-transparent blur-3xl pointer-events-none z-0" />
      <div className="absolute top-[340px] right-[-8%] w-[420px] h-[420px] bg-gradient-to-tr from-indigo-500/10 via-purple-500/5 to-transparent blur-3xl pointer-events-none z-0 rounded-full" />
      <div className="absolute top-[200px] left-[-6%] w-[320px] h-[320px] bg-gradient-to-tr from-emerald-500/10 to-transparent blur-3xl pointer-events-none z-0 rounded-full" />

      {/* === Relative layout wrapper === */}
      <div className="relative z-10 flex flex-col min-h-screen">

        {/* ── Sticky Navigation Header ── */}
        <Navbar />

        {/* ── Main content area ── */}
        <main className="flex-1">

          {/* ── Hero Section ── */}
          <section
            className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 pb-16 sm:pb-20 text-center overflow-hidden"
            aria-labelledby="hero-title"
          >
            {/* Interactive dot-grid background — client island */}
            <DotGridHero />

            {/* Operational Status Micro-Badge */}
            <div className="relative z-10 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-800/60 bg-white/70 dark:bg-zinc-900/25 backdrop-blur-sm mb-8 shadow-sm transition-colors animate-fade-up">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.55)]" />
              <span className="text-xs font-semibold tracking-wider text-zinc-500 dark:text-zinc-400 uppercase">
                All Systems Operational
              </span>
            </div>

            {/* Hero Title — spring word reveal via client island */}
            <h1
              id="hero-title"
              className="relative z-10 text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-zinc-950 dark:text-zinc-50 max-w-3xl mx-auto leading-tight mb-6"
            >
              <span className="block">
                <HeroText text="Uptime monitoring" delay={0.1} />
              </span>
              <span className="block">
                <HeroText text="built for" delay={0.2} />
              </span>
              <span className="block bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 bg-clip-text text-transparent">
                <HeroText
                  text="production teams."
                  delay={0.3}
                  className="bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 bg-clip-text text-transparent"
                />
              </span>
            </h1>

            {/* Supporting Description */}
            <p className="relative z-10 text-zinc-500 dark:text-zinc-400 text-base sm:text-lg max-w-lg mx-auto leading-relaxed mb-10 animate-fade-up [animation-delay:0.5s] opacity-0 [animation-fill-mode:forwards]">
              Zero-configuration endpoint tracking. Deploy serverless monitoring pipelines that log response telemetry and dispatch rich Discord embeds the instant a monitored domain degrades.
            </p>

            {/* Magnetic CTA buttons — client island */}
            <div className="relative z-10 flex items-center justify-center gap-4 flex-wrap animate-fade-up [animation-delay:0.65s] opacity-0 [animation-fill-mode:forwards]">
              <MagnetCTA>
                <Link
                  href="/dashboard"
                  className="btn-shimmer inline-flex items-center gap-2 px-6 py-3 bg-zinc-950 hover:bg-zinc-900 dark:bg-zinc-50 dark:hover:bg-white text-zinc-100 dark:text-zinc-950 font-bold text-sm rounded-xl transition duration-150 shadow-lg cursor-pointer"
                >
                  Launch Free Workspace
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
                </Link>
              </MagnetCTA>
              <MagnetCTA>
                <a
                  href="https://github.com/SubharupBiswas/pulseping"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-shimmer inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-zinc-50 dark:bg-zinc-900/50 dark:hover:bg-zinc-900 text-zinc-700 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-200 border border-zinc-200 dark:border-zinc-800/80 font-semibold text-sm rounded-xl transition duration-150 cursor-pointer shadow-sm"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
                  View Source
                </a>
              </MagnetCTA>
            </div>

            {/* Feature Pills */}
            <div className="relative z-10 flex flex-wrap items-center justify-center gap-2 md:gap-3 px-4 mt-10 animate-fade-up [animation-delay:0.8s] opacity-0 [animation-fill-mode:forwards]">
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
          <section
            className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 sm:pb-28"
            aria-label="Console Dashboard Preview"
          >
            <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-1.5 shadow-sm backdrop-blur-md transition-colors duration-250">
              <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-950 overflow-hidden">

                {/* Window Chrome */}
                <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 px-5 py-3 bg-white/40 dark:bg-transparent">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-400/70 dark:bg-zinc-800" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400/70 dark:bg-zinc-800" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/70 dark:bg-zinc-800" />
                  </div>
                  <span className="font-mono text-xs text-zinc-400 dark:text-zinc-600 tracking-tight select-none">
                    pulseping.subnetmask.tech/console
                  </span>
                  <div className="w-12" />
                </div>

                {/* Stats matrix */}
                <div className="grid grid-cols-3 gap-px border-b border-zinc-200 dark:border-zinc-800 bg-zinc-200 dark:bg-zinc-800/30">
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

                {/* Monitor rows */}
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

          {/* ── Animated Bento Features Grid — client island ── */}
          <BentoFeatures />

        </main>

        {/* ── Footer ── */}
        <footer className="border-t border-zinc-200 dark:border-zinc-800 mt-auto bg-white/75 dark:bg-zinc-950/60 backdrop-blur-xl transition-colors duration-250">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-md bg-zinc-800 flex items-center justify-center">
                <div className="w-1 h-1 rounded-full bg-zinc-400" />
              </div>
              <span className="text-sm text-zinc-500 dark:text-zinc-400 font-semibold">PulsePing</span>
              <span className="text-sm text-zinc-400 dark:text-zinc-600 font-mono">© 2026</span>
            </div>
            <div className="flex items-center gap-5">
              <Link href="/pricing" className="text-sm text-zinc-500 hover:text-zinc-950 dark:text-zinc-500 dark:hover:text-zinc-300 transition duration-150">Pricing</Link>
              <Link href="/terms" className="text-sm text-zinc-500 hover:text-zinc-950 dark:text-zinc-500 dark:hover:text-zinc-300 transition duration-150">Terms</Link>
              <Link href="/privacy" className="text-sm text-zinc-500 hover:text-zinc-950 dark:text-zinc-500 dark:hover:text-zinc-300 transition duration-150">Privacy</Link>
              <Link href="/status" className="text-sm text-zinc-500 hover:text-zinc-950 dark:text-zinc-500 dark:hover:text-zinc-300 transition duration-150">Status</Link>
              <a href="https://github.com/SubharupBiswas/pulseping" target="_blank" rel="noopener noreferrer" className="text-sm text-zinc-500 hover:text-zinc-950 dark:text-zinc-500 dark:hover:text-zinc-300 transition duration-150">GitHub</a>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}
