"use client";

import React, { useEffect, useState } from "react";
import { SignUp } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import Link from "next/link";
import Script from "next/script";

export default function SignUpPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen w-full bg-neutral-950 flex flex-col items-center justify-center px-4 py-12 relative overflow-x-hidden">

      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-emerald-500/10 via-indigo-500/5 to-transparent blur-3xl pointer-events-none z-0" />

      {/* Minimal top nav strip */}
      <nav className="absolute top-0 left-0 right-0 z-10 border-b border-neutral-800/60 bg-neutral-950/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 group pointer-events-auto"
            aria-label="PulsePing Homepage"
          >
            <div className="w-5 h-5 rounded-md bg-white flex items-center justify-center shadow-[0_0_10px_rgba(255,255,255,0.10)] group-hover:bg-neutral-200 transition duration-150">
              <div className="w-1.5 h-1.5 rounded-full bg-neutral-950" />
            </div>
            <span className="font-semibold text-sm tracking-tight text-white">
              PulsePing
            </span>
          </Link>
          <span className="text-sm text-neutral-400 font-medium">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="text-white font-semibold underline hover:text-emerald-400 transition duration-150"
            >
              Sign in
            </Link>
          </span>
        </div>
      </nav>

      {/* Card area */}
      <div className="relative z-10 w-full max-w-[420px]">
        {/* Page Title */}
        <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2 text-center">
          Create your workspace
        </h1>
        <p className="text-sm text-neutral-400 mb-8 text-center">
          Get started with 2 free monitor streams.
        </p>

        {/* Clerk Sign-Up Component */}
        <div className="flex flex-col items-center gap-4">
          <SignUp
            appearance={{
              baseTheme: dark,
              elements: {
                rootBox: "w-full",
                card: "bg-neutral-900 border border-neutral-800/60 shadow-xl rounded-2xl w-full",
                headerTitle: "text-white",
                headerSubtitle: "text-neutral-400",
                socialButtonsBlockButton:
                  "bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700 transition duration-150 rounded-lg text-xs font-medium",
                dividerLine: "bg-neutral-800",
                dividerText: "text-neutral-500 text-xs",
                formFieldLabel: "text-neutral-300 text-xs font-medium",
                formFieldInput:
                  "bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-600 focus:border-emerald-500 focus:ring-0 rounded-lg text-sm",
                formButtonPrimary:
                  "bg-white text-black hover:bg-neutral-200 transition-colors text-xs font-semibold rounded-lg py-2.5",
                footerActionText: "text-neutral-400 text-xs",
                footerActionLink:
                  "text-white hover:text-neutral-200 font-medium text-xs",
                identityPreviewText: "text-neutral-300 text-xs",
                identityPreviewEditButton:
                  "text-emerald-400 hover:text-emerald-300 text-xs",
                alertText: "text-neutral-300 text-xs",
                formResendCodeLink:
                  "text-emerald-400 hover:text-emerald-300 text-xs",
              },
            } as any}
            fallbackRedirectUrl="/dashboard"
            signInUrl="/sign-in"
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

      {/* Footer */}
      <footer className="absolute bottom-0 left-0 right-0 z-10 border-t border-neutral-800/60 py-5">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-center gap-6">
          <Link
            href="/terms"
            className="text-sm text-neutral-500 hover:text-neutral-300 transition duration-150"
          >
            Terms
          </Link>
          <Link
            href="/privacy"
            className="text-sm text-neutral-500 hover:text-neutral-300 transition duration-150"
          >
            Privacy
          </Link>
          <Link
            href="/status"
            className="text-sm text-neutral-500 hover:text-neutral-300 transition duration-150"
          >
            Status
          </Link>
        </div>
      </footer>
    </div>
  );
}
