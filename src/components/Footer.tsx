import React from "react";
import Link from "next/link";
import { PulsePingLogo } from "@/components/PulsePingLogo";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 mt-auto bg-sky-50/80 dark:bg-zinc-950/60 backdrop-blur-xl transition-colors duration-250">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        {/* Brand & Copyright — Clickable Link to Homepage */}
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer group"
          >
            <PulsePingLogo className="w-5 h-5 text-emerald-500 group-hover:scale-105 transition-transform" />
            <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-200">
              PulsePing
            </span>
          </Link>
          <span className="text-sm text-zinc-500 dark:text-zinc-600 font-mono">
            © 2026
          </span>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center gap-5 flex-wrap justify-center text-sm text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-200 transition duration-150">
          <Link href="/pricing">Pricing</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/cancellation-refund">Refund Policy</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/status">Status</Link>
          <a href="https://github.com/SubharupBiswas/pulseping" target="_blank" rel="noopener noreferrer">GitHub</a>
        </div>
      </div>
    </footer>
  );
}