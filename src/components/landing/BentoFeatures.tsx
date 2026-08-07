"use client";

import React, { useRef, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const features = [
  {
    icon: "⬡",
    title: "Automated Cron Engine",
    desc: "High-frequency automated polling cycles (10s Business / 30s Pro) with loopback orchestration and zero external infrastructure overhead.",
  },
  {
    icon: "🤖",
    title: "AI Incident Diagnostics",
    desc: "3-Tier AI waterfall engine powered by Gemini, OmniRoute, and Groq analyzes status failures for instant root-cause diagnostics.",
  },
  {
    icon: "⚡",
    title: "Webhook Guard & Relay",
    desc: "Catch silent webhook timeouts (>4.5s), verify HMAC signatures, and inspect or replay failed payloads.",
  },
  {
    icon: "🔔",
    title: "Multi-Channel Alert Dispatch",
    desc: "Per-monitor routing across Discord Webhooks, Telegram Bot, Slack, and Email dispatch with custom triggers.",
  },
  {
    icon: "💓",
    title: "Inverse Heartbeats",
    desc: "Monitor background cron jobs, worker scripts, and database sync pipelines with tokenized dead-man switches.",
  },
  {
    icon: "📊",
    title: "Public Status Boards",
    desc: "Share real-time operational availability with custom-branded, 1-minute ISR public status pages.",
  },
];

type GlowCardProps = {
  children: React.ReactNode;
  className?: string;
};

function GlowCard({ children, className = "" }: GlowCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty("--mouse-x", `${x}%`);
    card.style.setProperty("--mouse-y", `${y}%`);
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={`bento-card group relative bg-white/90 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl shadow-sm backdrop-blur-md hover:border-zinc-300/80 dark:hover:border-zinc-700/60 hover:shadow-md transition-all duration-300 ${className}`}
      style={{ "--mouse-x": "50%", "--mouse-y": "50%" } as React.CSSProperties}
    >
      {/* hover.dev border glow overlay */}
      <div className="bento-card-border" aria-hidden="true" />
      {children}
    </div>
  );
}

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 200, damping: 22 },
  },
};

export default function BentoFeatures() {
  return (
    <section
      className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 sm:pb-24"
      aria-labelledby="features-title"
    >
      <h2 id="features-title" className="sr-only">
        Platform Features
      </h2>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr"
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
      >
        {features.map((feature) => (
          <motion.div key={feature.title} variants={cardVariant} className="h-full">
            <GlowCard className="p-6 h-full flex flex-col justify-between min-h-[200px]">
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <span
                    className="text-emerald-500 dark:text-emerald-400 text-2xl mb-3 block"
                    aria-hidden="true"
                  >
                    {feature.icon}
                  </span>
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight text-base mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/40">
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    Learn more →
                  </Link>
                </div>
              </div>
            </GlowCard>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
