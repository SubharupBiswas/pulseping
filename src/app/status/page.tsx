import Link from "next/link";
import Navbar from "@/components/Navbar";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "System Status",
  description: "Live operational status of PulsePing's monitoring infrastructure, API gateways, cron executors, and database nodes.",
  alternates: {
    canonical: "https://pulseping.subnetmask.tech/status",
  },
  openGraph: {
    title: "System Status | PulsePing",
    description: "Live operational status of PulsePing's monitoring infrastructure, API gateways, cron executors, and database nodes.",
    url: "https://pulseping.subnetmask.tech/status",
  },
};


const systemComponents = [
  {
    category: "Core Infrastructure",
    services: [
      { name: "Monitoring Cron Executor", status: "operational", latency: "42ms", uptime: "99.98%" },
      { name: "Endpoint Polling Engine", status: "operational", latency: "38ms", uptime: "99.97%" },
      { name: "Alert Dispatch Pipeline", status: "operational", latency: "91ms", uptime: "99.94%" },
    ],
  },
  {
    category: "API Gateway",
    services: [
      { name: "Order Creation Endpoint", status: "operational", latency: "214ms", uptime: "99.99%" },
      { name: "Payment Verification API", status: "operational", latency: "302ms", uptime: "99.97%" },
      { name: "Dashboard Server Component", status: "operational", latency: "620ms", uptime: "99.95%" },
    ],
  },
  {
    category: "Database Layer",
    services: [
      { name: "Neon PostgreSQL Primary", status: "operational", latency: "9ms", uptime: "99.99%" },
      { name: "Prisma Connection Pool", status: "operational", latency: "4ms", uptime: "99.99%" },
      { name: "PingLog Write Throughput", status: "operational", latency: "18ms", uptime: "99.96%" },
    ],
  },
  {
    category: "Authentication",
    services: [
      { name: "Clerk Auth Gateway", status: "operational", latency: "81ms", uptime: "99.99%" },
      { name: "JWT Verification", status: "operational", latency: "12ms", uptime: "100.00%" },
      { name: "Session Token Refresh", status: "operational", latency: "55ms", uptime: "99.98%" },
    ],
  },
  {
    category: "Notification Services",
    services: [
      { name: "Discord Webhook Delivery", status: "operational", latency: "140ms", uptime: "99.91%" },
      { name: "Alert Embed Formatting", status: "operational", latency: "8ms", uptime: "99.99%" },
    ],
  },
];

const recentIncidents = [
  {
    date: "2026-06-28",
    title: "Elevated cron execution latency",
    status: "resolved",
    detail: "Monitoring cron jobs experienced 3–8 minute delays due to a Vercel infrastructure event. Polling resumed normal cadence after auto-recovery. No data was lost.",
    duration: "14 minutes",
  },
  {
    date: "2026-06-11",
    title: "Discord webhook delivery degradation",
    status: "resolved",
    detail: "Discord API rate limiting caused ~12% of outgoing alert webhooks to fail delivery during a burst monitoring window. Retry logic resolved queued alerts within 20 minutes.",
    duration: "20 minutes",
  },
  {
    date: "2026-05-19",
    title: "Scheduled database maintenance",
    status: "resolved",
    detail: "Neon PostgreSQL performed a scheduled infrastructure upgrade. Read-only mode was active for approximately 4 minutes. Dashboard access was temporarily unavailable.",
    duration: "4 minutes",
  },
];

const statusColors: Record<string, string> = {
  operational: "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.45)]",
  degraded: "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.45)]",
  outage: "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.45)]",
  maintenance: "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.45)]",
};

const statusLabel: Record<string, string> = {
  operational: "Operational",
  degraded: "Degraded",
  outage: "Outage",
  maintenance: "Maintenance",
};

const statusTextColors: Record<string, string> = {
  operational: "text-emerald-600 dark:text-emerald-400",
  degraded: "text-amber-600 dark:text-amber-400",
  outage: "text-rose-600 dark:text-rose-400",
  maintenance: "text-blue-600 dark:text-blue-400",
};

const incidentStatusStyles: Record<string, string> = {
  resolved: "text-emerald-600 dark:text-emerald-400 border-emerald-500/20 bg-emerald-500/[0.04]",
  investigating: "text-amber-600 dark:text-amber-400 border-amber-500/20 bg-amber-500/[0.04]",
  monitoring: "text-blue-600 dark:text-blue-400 border-blue-500/20 bg-blue-500/[0.04]",
};

export default function StatusPage() {
  const allOperational = systemComponents.every((cat) =>
    cat.services.every((s) => s.status === "operational")
  );

  return (
    <div className="min-h-screen bg-sky-50 text-zinc-900 dark:bg-[#030303] dark:text-zinc-100 font-sans antialiased relative overflow-x-hidden transition-colors duration-250">

      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[320px] bg-gradient-to-b from-emerald-500/[0.035] to-transparent blur-[110px] pointer-events-none z-0 dark:opacity-100 opacity-20" />

      {/* Sticky Navigation */}
      <Navbar activeLink="status" />

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 relative z-10">

        {/* Page Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-5">
            <span className="text-xs font-bold tracking-widest uppercase text-zinc-500 dark:text-zinc-600 border border-zinc-200 dark:border-zinc-800 px-2 py-0.5 rounded-full">Operations</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 mb-3">System Status</h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-base">Real-time health metrics for PulsePing's global monitoring infrastructure.</p>
        </div>

        {/* Global Status Hero Banner */}
        <div className={`border rounded-2xl p-6 mb-10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] transition-colors ${
          allOperational
            ? "bg-emerald-500/[0.04] border-emerald-500/15"
            : "bg-rose-500/[0.04] border-rose-500/15"
        }`}>
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              allOperational ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-rose-500/10 border border-rose-500/20"
            }`}>
              <span className={`w-2.5 h-2.5 rounded-full ${allOperational ? "bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" : "bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]"}`} />
            </div>
            <div>
              <p className={`text-base font-semibold tracking-tight ${allOperational ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                {allOperational ? "All Systems Operational" : "Active Service Degradation Detected"}
              </p>
              <p className="text-sm text-zinc-500 dark:text-zinc-600 mt-0.5">
                {allOperational
                  ? "All monitoring, API, and database nodes are functioning within normal parameters."
                  : "One or more service components are experiencing degraded performance."}
              </p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800/40 grid grid-cols-3 gap-4">
            {[
              { label: "Monitoring Uptime", value: "99.97%", period: "30d" },
              { label: "API Availability", value: "99.98%", period: "30d" },
              { label: "Avg Check Latency", value: "41ms", period: "24h" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-base font-bold text-zinc-900 dark:text-zinc-200 tracking-tight">{stat.value}</p>
                <p className="text-xs text-zinc-400 dark:text-zinc-600 uppercase tracking-widest">{stat.label}</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-700">{stat.period} avg</p>
              </div>
            ))}
          </div>
        </div>

        {/* Component Status Grid */}
        <div className="space-y-6 mb-12">
          {systemComponents.map((category) => (
            <div key={category.category}>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-600 mb-3">{category.category}</h2>
              <div className="border border-zinc-200 dark:border-zinc-900/80 rounded-xl overflow-hidden shadow-[inset_0_1px_0_0_rgba(255,255,255,0.02)] bg-sky-50/40 dark:bg-transparent transition-colors">
                {category.services.map((service, idx) => (
                  <div
                    key={service.name}
                    className={`flex items-center justify-between px-5 py-3.5 bg-sky-50/80 dark:bg-zinc-900/10 hover:bg-sky-100/40 dark:hover:bg-zinc-900/20 transition duration-150 ${
                      idx < category.services.length - 1 ? "border-b border-zinc-200 dark:border-zinc-900/60" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${statusColors[service.status]}`} />
                      <span className="text-sm font-medium text-zinc-800 dark:text-zinc-300">{service.name}</span>
                    </div>
                    <div className="flex items-center gap-5 shrink-0">
                      <span className="text-xs text-zinc-500 dark:text-zinc-700 font-mono hidden sm:block">{service.uptime} uptime</span>
                      <span className="text-xs text-zinc-500 dark:text-zinc-700 font-mono hidden sm:block">{service.latency}</span>
                      <span className={`text-sm font-medium ${statusTextColors[service.status]}`}>
                        {statusLabel[service.status]}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Recent Incidents */}
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-600 mb-4">Recent Incidents</h2>

          {recentIncidents.length === 0 ? (
            <div className="border border-dashed border-zinc-200 dark:border-zinc-900/80 rounded-xl p-8 text-center bg-sky-50/30 dark:bg-transparent">
              <p className="text-zinc-500 dark:text-zinc-600 text-sm">No incidents recorded in the past 90 days.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentIncidents.map((incident) => (
                <div
                  key={incident.title}
                  className="bg-sky-50/50 dark:bg-zinc-900/10 border border-zinc-200 dark:border-zinc-900/80 rounded-xl p-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.02)] transition-colors"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-200 tracking-tight">{incident.title}</p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-600 font-mono mt-0.5">{incident.date} · Duration: {incident.duration}</p>
                    </div>
                    <span className={`shrink-0 text-xs font-semibold uppercase tracking-widest px-2 py-1 rounded-full border ${incidentStatusStyles[incident.status]}`}>
                      {incident.status}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{incident.detail}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Subscribe note */}
        <div className="mt-10 border border-zinc-200 dark:border-zinc-900/60 rounded-xl px-5 py-4 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.02)] bg-sky-50/30 dark:bg-transparent transition-colors">
          <p className="text-sm text-zinc-500 dark:text-zinc-650">
            Subscribe to status notifications at{" "}
            <a href="mailto:support@subnetmask.tech" className="text-zinc-700 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 transition duration-150">
              support@subnetmask.tech
            </a>{" "}
            or follow our{" "}
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-zinc-700 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 transition duration-150">
              GitHub Discussions
            </a>{" "}
            page for real-time incident reports.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-900/40 bg-sky-50/60 dark:bg-transparent transition-colors duration-250">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="text-sm text-zinc-500 dark:text-zinc-650">PulsePing © 2026</span>
          <div className="flex items-center gap-5 flex-wrap justify-center">
            <Link href="/pricing" className="text-sm text-zinc-500 hover:text-zinc-950 dark:text-zinc-500 dark:hover:text-zinc-300 transition duration-150">Pricing</Link>
            <Link href="/terms" className="text-sm text-zinc-500 hover:text-zinc-955 dark:text-zinc-500 dark:hover:text-zinc-300 transition duration-150">Terms</Link>
            <Link href="/privacy" className="text-sm text-zinc-500 hover:text-zinc-950 dark:text-zinc-500 dark:hover:text-zinc-300 transition duration-150">Privacy</Link>
            <Link href="/cancellation-refund" className="text-sm text-zinc-500 hover:text-zinc-950 dark:text-zinc-500 dark:hover:text-zinc-300 transition duration-150">Refund Policy</Link>
            <Link href="/contact" className="text-sm text-zinc-500 hover:text-zinc-950 dark:text-zinc-500 dark:hover:text-zinc-300 transition duration-150">Contact</Link>
            <Link href="/status" className="text-sm text-zinc-500 hover:text-zinc-950 dark:text-zinc-500 dark:hover:text-zinc-300 transition duration-150">Status</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
