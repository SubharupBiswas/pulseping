import React from "react";
import Link from "next/link";
import { PulsePingLogo } from "@/components/PulsePingLogo";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200/80 dark:border-zinc-800/80 mt-auto bg-white/70 dark:bg-zinc-950/70 backdrop-blur-xl transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        
        {/* Brand & Copyright — Clickable Link to Homepage */}
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer group"
          >
            <PulsePingLogo size="w-5 h-5" className="text-emerald-500 group-hover:scale-105 transition-transform" />
            <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              PulsePing
            </span>
          </Link>
          <span className="text-sm text-zinc-400 dark:text-zinc-500 font-mono">
            © 2026
          </span>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center gap-5 flex-wrap justify-center text-sm text-zinc-600 dark:text-zinc-400">
          <Link href="/pricing" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
            Pricing
          </Link>
          <Link href="/terms" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
            Terms
          </Link>
          <Link href="/privacy" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
            Privacy
          </Link>
          <Link href="/cookie-policy" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
            Cookies
          </Link>
          <Link href="/cancellation-refund" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
            Refund Policy
          </Link>
          <Link href="/contact" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
            Contact
          </Link>
          <Link href="/status" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
            Status
          </Link>
          <a
            href="https://github.com/SubharupBiswas/pulseping"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}