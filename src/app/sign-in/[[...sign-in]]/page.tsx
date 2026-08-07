"use client";

import React, { useEffect, useState } from "react";
import { SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";
import Link from "next/link";
import Script from "next/script";
import PulsePingLogo from "@/components/PulsePingLogo";
import Footer from "@/components/Footer";
import ThemeToggle from "@/components/ThemeToggle";

export default function SignInPage() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen w-full bg-sky-50/60 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col justify-between transition-colors duration-250 relative overflow-x-hidden">

      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-emerald-500/10 via-indigo-500/5 to-transparent blur-3xl pointer-events-none z-0" />

      {/* Minimal top nav strip */}
      <header className="sticky top-0 left-0 right-0 z-20 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-sky-50/80 dark:bg-zinc-950/80 backdrop-blur-xl transition-colors duration-250">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2.5 group pointer-events-auto"
            aria-label="PulsePing Homepage"
          >
            <PulsePingLogo size="w-6 h-6" />
            <span className="font-semibold text-sm tracking-tight text-zinc-900 dark:text-zinc-100">
              PulsePing
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <span className="text-sm text-zinc-600 dark:text-zinc-400 font-medium">
              No account?{" "}
              <Link
                href="/sign-up"
                className="text-zinc-900 dark:text-zinc-100 font-semibold underline hover:text-emerald-500 transition duration-150"
              >
                Sign up free
              </Link>
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center py-12 px-4 relative z-10 w-full">
        <div className="w-full max-w-[420px]">
          {/* Page Title */}
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-100 mb-2 text-center">
            Sign in to PulsePing
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8 text-center">
            Monitor your endpoints with confidence.
          </p>

          {/* Clerk Sign-In Component */}
          <div className="flex flex-col items-center gap-4">
            <SignIn
              appearance={{
                baseTheme: mounted && resolvedTheme === "dark" ? dark : undefined,
                elements: {
                  rootBox: "mx-auto w-full",
                  card: "bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 shadow-xl rounded-2xl transition-colors",
                },
              } as any}
              fallbackRedirectUrl="/dashboard"
              signUpUrl="/sign-up"
            />
            <div className="mt-2">
              <div
                className="cf-turnstileMy"
                data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
              />
              {mounted && (
                <Script
                  src="https://challenges.cloudflare.com/turnstile/v0/api.js"
                  strategy="lazyOnload"
                />
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Adaptive Footer */}
      <Footer />
    </div>
  );
}