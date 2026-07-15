"use client";

import React, { useRef, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const features = [
  {
    icon: "⬡",
    title: "Serverless Cron Engine",
    desc: "10-minute automated polling cycles powered by Cloudflare Cron, zero infrastructure overhead.",
    colSpan: "md:col-span-2 md:row-span-2",
    large: true,
  },
  {
    icon: "⚡",
    title: "Discord Webhook Alerts",
    desc: "Rich embed dispatch to your team channels the moment a monitored endpoint degrades.",
    colSpan: "md:col-span-1",
    large: false,
  },
  {
    icon: "⬡",
    title: "PostgreSQL Log Archive",
    desc: "Every check, latency reading, and status code stored durably in Neon PostgreSQL via Prisma 7.",
    colSpan: "md:col-span-1",
    large: false,
  },
  {
    icon: "🔔",
    title: "Telegram & Email Alerts",
    desc: "Multi-channel alert routing via Telegram Chat ID and Resend email — per-monitor configuration.",
    colSpan: "md:col-span-2",
    large: false,
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

/**
 * BentoFeatures — asymmetric bento grid with hover.dev border-glow on each card.
 * First card spans 2×2 on desktop; right column fills with 3 smaller cards.
 * Each card tracks cursor position locally for per-card glow.
 */
export default function BentoFeatures() {
  return (
    <section
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 sm:pb-24"
      aria-labelledby="features-title"
    >
      <h2 id="features-title" className="sr-only">
        Platform Features
      </h2>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-4 auto-rows-fr"
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
      >
        {features.map((feature) => (
          <motion.div
            key={feature.title}
            variants={cardVariant}
            className={feature.colSpan}
          >
            <GlowCard className={`p-5 h-full flex flex-col justify-between ${feature.large ? "min-h-[200px]" : "min-h-[120px]"}`}>
              <div className="relative z-10">
                <span
                  className="text-emerald-500 dark:text-emerald-400 text-2xl mb-4 block"
                  aria-hidden="true"
                >
                  {feature.icon}
                </span>
                <h3
                  className={`font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight mb-2 ${feature.large ? "text-base" : "text-sm"}`}
                >
                  {feature.title}
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
              {feature.large && (
                <div className="relative z-10 mt-6">
                  <Link
                    href="/dashboard"
                    className="btn-shimmer inline-flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50 dark:bg-emerald-950/20 px-3 py-1.5 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-950/40 transition-colors"
                  >
                    Start monitoring free
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
                  </Link>
                </div>
              )}
            </GlowCard>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
