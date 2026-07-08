"use client";

import Link from "next/link";
import { Show, UserButton } from "@clerk/nextjs";
import ThemeToggle from "@/components/ThemeToggle";

/**
 * Shared Navbar — 3-zone responsive layout
 *
 * Zone 1 (left):   Brand logo — flex-shrink-0, never collapses
 * Zone 2 (center): Text nav links — hidden on mobile (hidden md:flex),
 *                  completely invisible <768px so they can NEVER fuse with
 *                  the brand text or right-side utilities.
 * Zone 3 (right):  ThemeToggle + Auth buttons — always rendered, tightly
 *                  grouped with gap-x-3.
 *
 * Usage:
 *   import Navbar from "@/components/Navbar";
 *   <Navbar />                          — shows Sign In / Sign Up
 *   <Navbar activeLink="pricing" />     — highlights the active center link
 *   <Navbar variant="console" />        — shows Console + UserButton instead
 */

type NavLink = "pricing" | "status" | "terms" | "privacy" | null;
type NavVariant = "public" | "console";

interface NavbarProps {
  /** Highlight one of the center nav links as active */
  activeLink?: NavLink;
  /** "public" shows Sign In/Up; "console" shows Console + UserButton */
  variant?: NavVariant;
}

export default function Navbar({ activeLink, variant }: NavbarProps) {
  const linkBase =
    "text-sm font-medium transition duration-150";
  const linkIdle =
    "text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100";
  const linkActive =
    "text-zinc-950 dark:text-zinc-100 font-semibold";

  function linkCls(id: NavLink) {
    return `${linkBase} ${activeLink === id ? linkActive : linkIdle}`;
  }

  return (
    <header className="border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/75 dark:bg-zinc-950/60 backdrop-blur-xl sticky top-0 z-50 transition-colors duration-250">
      <nav
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between"
        aria-label="Main Navigation"
      >
        {/* ── Zone 1: Brand (far-left, never shrinks) ── */}
        <div className="flex-shrink-0">
          <Link
            href="/"
            className="font-bold text-xl tracking-tight text-zinc-950 dark:text-white hover:opacity-90 transition duration-150 flex items-center gap-2"
            aria-label="PulsePing Homepage"
          >
            📡 PulsePing
          </Link>
        </div>

        {/* ── Zone 2: Center links (desktop only — vanishes on mobile) ── */}
        <div className="hidden md:flex items-center gap-x-8">
          <Link href="/pricing" className={linkCls("pricing")}>
            Pricing
          </Link>
          <Link href="/status" className={linkCls("status")}>
            Status
          </Link>
          <Link href="/terms" className={linkCls("terms")}>
            Terms
          </Link>
          <Link href="/privacy" className={linkCls("privacy")}>
            Privacy
          </Link>
        </div>

        {/* ── Zone 3: Right utilities (always visible, tightly grouped) ── */}
        <div className="flex items-center gap-x-4">
          <ThemeToggle />
          {variant === "console" ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm font-semibold bg-zinc-900 hover:bg-zinc-800 text-zinc-100 border border-zinc-800 px-3 py-1.5 rounded-lg transition duration-150 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.03)]"
              >
                Console
              </Link>
              <UserButton />
            </>
          ) : (
            <>
              <Show when="signed-out">
                <Link
                  href="/sign-in"
                  className="text-sm font-semibold bg-zinc-900 hover:bg-zinc-800 text-zinc-100 border border-zinc-800 px-3.5 py-1.5 rounded-lg transition duration-150 cursor-pointer shadow-sm"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className="text-sm font-semibold bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-100 dark:hover:bg-white text-zinc-950 dark:text-zinc-950 border border-zinc-300 dark:border-zinc-800 px-3.5 py-1.5 rounded-lg transition duration-150 cursor-pointer shadow-sm hidden sm:inline-flex"
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
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
