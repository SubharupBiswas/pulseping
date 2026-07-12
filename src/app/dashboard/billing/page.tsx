import React from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import { db } from "@/lib/db";
import ThemeToggle from "@/components/ThemeToggle";
import { UserButton } from "@clerk/nextjs";
import { upgradeUserPlan } from "@/app/actions/billing";
import PulsePingLogo from "@/components/PulsePingLogo";
import BillingUpgradeCard from "@/components/BillingUpgradeCard";

export const dynamic = "force-dynamic";

export default async function BillingPage() {
  const { userId } = await auth();

  if (!userId || userId === "mock-user-uuid") {
    redirect("/sign-in");
  }

  let userRecord = await db.user.findUnique({ where: { id: userId } });
  if (!userRecord) {
    userRecord = await db.user.create({
      data: { id: userId, email: userId, plan: "FREE" },
    });
  }

  const headersList = await headers();
  const country = headersList.get("cf-ipcountry") || headersList.get("x-vercel-ip-country") || "US";
  const defaultCurrency = country === "IN" ? "INR" : "USD";

  const plan = userRecord.plan;
  const isPremium = plan === "PRO" || plan === "BUSINESS";

  // Calculate simulated renewal date (30 days from now)
  const renewalDateString = isPremium
    ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  // Mock past test invoices
  const mockInvoices = isPremium
    ? [
        {
          id: "INV-2026-002",
          date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
          amount: plan === "PRO" ? "₹499.00" : "₹1,499.00",
          status: "Paid",
        },
        {
          id: "INV-2026-001",
          date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
          amount: plan === "PRO" ? "₹499.00" : "₹1,499.00",
          status: "Paid",
        },
      ]
    : [];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 selection:bg-emerald-500/10 selection:text-emerald-500 font-sans antialiased relative overflow-x-hidden transition-colors duration-250">

      {/* Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[320px] bg-gradient-to-tr from-indigo-500/5 via-emerald-500/5 to-transparent blur-3xl pointer-events-none z-0" />

      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-zinc-900 dark:bg-zinc-950/40 border-b border-zinc-200 dark:border-zinc-850 backdrop-blur-xl transition-colors duration-250">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">

          {/* Brand Logo Link */}
          <Link href="/dashboard" className="flex items-center gap-2.5 group shrink-0 pointer-events-auto" aria-label="PulsePing Dashboard">
            <PulsePingLogo size="w-6 h-6" />
            <span className="font-semibold text-sm tracking-tight text-zinc-900 dark:text-zinc-100">PulsePing</span>
          </Link>

          {/* Right Controls */}
          <div className="flex items-center gap-x-4 md:gap-x-6">
            <ThemeToggle />
            <span className={`text-xs font-bold tracking-widest uppercase px-2.5 py-1 rounded-full border shadow-sm transition-colors ${
              isPremium
                ? "bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                : "bg-zinc-100 dark:bg-zinc-900/40 text-zinc-500 dark:text-zinc-400 border-zinc-200 dark:border-zinc-850"
            }`}>
              {plan} Tier
            </span>
            <UserButton appearance={{} as any}>
              <UserButton.MenuItems>
                <UserButton.Link
                  label="Billing & Usage"
                  labelIcon={
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  }
                  href="/dashboard/billing"
                />
              </UserButton.MenuItems>
            </UserButton>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">

        {/* Back Link */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 mb-6 transition"
        >
          <span>←</span> Back to Dashboard
        </Link>

        {/* Header Title */}
        <div className="mb-8">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-100">Billing & Usage</h1>
          <p className="text-sm text-zinc-550 dark:text-zinc-400 mt-1">Manage subscription tiers, renewals, and download payment receipts.</p>
        </div>

        {/* Current Subscription Grid */}
        <section className="bg-white dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl p-5 mb-8 shadow-sm backdrop-blur-md transition-colors">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-4">Subscription Summary</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-b border-zinc-200 dark:border-zinc-800/60 pb-5 mb-5">
            <div>
              <p className="text-xs text-zinc-450 dark:text-zinc-500 uppercase tracking-widest font-bold">Active Tier</p>
              <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mt-1">{plan} Plan</p>
            </div>
            <div>
              <p className="text-xs text-zinc-450 dark:text-zinc-500 uppercase tracking-widest font-bold">Billing Cycle</p>
              <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mt-1">{isPremium ? "Monthly / Annual" : "Free Forever"}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-450 dark:text-zinc-500 uppercase tracking-widest font-bold">Renewal Date</p>
              <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mt-1">{renewalDateString}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-205">Resource Allocations & Limits</h4>
              <p className="text-xs text-zinc-550 dark:text-zinc-400 mt-0.5">
                {plan === "FREE" && "Allows up to 2 active monitor streams, 10-minute resolution polling, and basic email notifications."}
                {plan === "PRO" && "Allows up to 20 active monitor streams, 1-minute high-frequency polling, and Discord webhook triggers."}
                {plan === "BUSINESS" && "Allows unlimited monitor streams, 30-second real-time polling, and priority multi-channel alerts."}
              </p>
            </div>

            {isPremium && (
              <form
                action={async () => {
                  "use server";
                  await upgradeUserPlan(userId, "FREE");
                }}
              >
                <button
                  type="submit"
                  className="text-xs font-semibold bg-zinc-100 hover:bg-zinc-200 text-zinc-900 dark:bg-zinc-800/60 dark:hover:bg-zinc-800 dark:text-zinc-200 border border-zinc-300/30 dark:border-zinc-700/50 px-3.5 py-2 rounded-lg transition duration-150 shadow-sm cursor-pointer shrink-0"
                >
                  Cancel Subscription
                </button>
              </form>
            )}
          </div>
        </section>

        {/* Upgrade Billing Options */}
        <BillingUpgradeCard userId={userId} currentPlan={plan} currency={defaultCurrency} />

        {/* Invoice History */}
        <section className="bg-white dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl p-5 shadow-sm backdrop-blur-md transition-colors">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-4">Payment Invoices</h3>

          {mockInvoices.length === 0 ? (
            <div className="border border-dashed border-zinc-200 dark:border-zinc-800/80 rounded-xl p-8 text-center bg-zinc-50/20 dark:bg-transparent">
              <p className="text-zinc-500 dark:text-zinc-400 text-sm font-mono">No invoice records found.</p>
              <p className="text-xs text-zinc-400 dark:text-zinc-550 mt-1">Upgrade your operational subscription tier to generate billing statements.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-800/60 text-zinc-400 dark:text-zinc-500 text-xs font-bold uppercase tracking-wider">
                    <th className="py-2.5">Invoice ID</th>
                    <th className="py-2.5">Billing Date</th>
                    <th className="py-2.5">Amount</th>
                    <th className="py-2.5">Status</th>
                    <th className="py-2.5 text-right">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/40 text-zinc-800 dark:text-zinc-300">
                  {mockInvoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-zinc-50/30 dark:hover:bg-zinc-900/10 transition duration-100">
                      <td className="py-3 font-mono font-semibold">{inv.id}</td>
                      <td className="py-3">{inv.date}</td>
                      <td className="py-3 font-semibold">{inv.amount}</td>
                      <td className="py-3">
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                          {inv.status}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <button
                          disabled
                          className="text-xs text-zinc-500 hover:text-zinc-900 dark:text-zinc-450 dark:hover:text-zinc-200 underline cursor-not-allowed"
                        >
                          Download PDF
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-900/40 mt-16 bg-white/75 dark:bg-zinc-950/60 backdrop-blur-xl transition-colors duration-250">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <span className="text-sm text-zinc-500 dark:text-zinc-650">PulsePing © 2026</span>
          <div className="flex items-center gap-4">
            <Link href="/status" className="text-sm text-zinc-555 hover:text-zinc-950 dark:text-zinc-500 dark:hover:text-zinc-300 transition duration-150">System Status</Link>
            <Link href="/terms" className="text-sm text-zinc-555 hover:text-zinc-950 dark:text-zinc-500 dark:hover:text-zinc-300 transition duration-150">Terms</Link>
            <Link href="/privacy" className="text-sm text-zinc-555 hover:text-zinc-950 dark:text-zinc-500 dark:hover:text-zinc-300 transition duration-150">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
