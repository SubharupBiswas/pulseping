import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Cookie Policy — PulsePing",
  description:
    "PulsePing Cookie Policy and local storage transparency disclosures.",
};

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-sky-50 text-zinc-900 dark:bg-[#030303] dark:text-zinc-100 font-sans antialiased relative overflow-x-hidden transition-colors duration-250">
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-zinc-650/[0.03] to-transparent blur-[100px] pointer-events-none z-0 dark:opacity-100 opacity-20" />

      {/* Sticky Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8 relative z-10">
        <span className="text-xs font-mono font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
          LEGAL
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-4 mb-2 text-zinc-900 dark:text-zinc-50">
          Cookie Policy
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 font-mono mb-8">
          Effective: August 1, 2026 · Version 1.0
        </p>

        <div className="space-y-6 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
          <section className="bg-white/80 dark:bg-zinc-900/40 p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2">
              1. Overview
            </h2>
            <p>
              PulsePing utilizes essential cookies and local storage tokens solely to maintain secure authentication sessions (via Clerk), store user interface preferences (such as dark/light mode preference), and preserve CSRF security tokens.
            </p>
          </section>

          <section className="bg-white/80 dark:bg-zinc-900/40 p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2">
              2. Strictly Necessary Cookies
            </h2>
            <p>
              These cookies are required for platform operations, API request verification, and workspace authentication. Blocking these session tokens will prevent dashboard access.
            </p>
          </section>

          <section className="bg-white/80 dark:bg-zinc-900/40 p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2">
              3. Third-Party Services
            </h2>
            <p>
              Authentication and payment processing workflows integrate secure session cookies provided by Clerk authentication and Razorpay checkout iframe scripts.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
