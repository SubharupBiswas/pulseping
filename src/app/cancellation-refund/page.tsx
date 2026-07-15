import Link from "next/link";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Cancellation & Refund Policy | PulsePing",
  description: "Read PulsePing's Cancellation and Refund Policy for details on subscription tier resource provisioning and cancellation guidelines.",
};

export default function CancellationRefundPage() {
  return (
    <div className="min-h-screen bg-sky-50 text-zinc-900 dark:bg-[#030303] dark:text-zinc-100 font-sans antialiased relative overflow-x-hidden transition-colors duration-250">
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-zinc-650/[0.03] to-transparent blur-[100px] pointer-events-none z-0 dark:opacity-100 opacity-20" />

      {/* Sticky Navigation */}
      <Navbar activeLink={null} />

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 relative z-10">
        {/* Page Header */}
        <div className="mb-12 pb-8 border-b border-zinc-200 dark:border-zinc-900/60">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-bold tracking-widest uppercase text-zinc-500 dark:text-zinc-650 border border-zinc-200 dark:border-zinc-800 px-2 py-0.5 rounded-full bg-sky-50/60 dark:bg-transparent">
              Billing Policy
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-3">
            Cancellation & Refund Policy
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
            Please read our cancellation guidelines and refund terms before purchasing platform subscriptions.
          </p>
        </div>

        {/* Cancellation and Refund Policy details */}
        <div className="space-y-8">
          <div>
            <h2 className="text-sm font-bold text-zinc-850 dark:text-zinc-200 mb-3">1. Instant Resource Provisioning</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-[1.8]">
              PulsePing operates a developer-first SaaS platform. Upon successful signature verification of a checkout transaction processed by our payment gateway (Razorpay), your subscription resources (e.g., increased stream limit parameters, high-frequency 1-minute checking, cron configurations) are provisioned instantaneously to your Clerk account context.
            </p>
          </div>

          <div>
            <h2 className="text-sm font-bold text-zinc-850 dark:text-zinc-200 mb-3">2. Cancellation Guidelines</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-[1.8]">
              You can cancel your active paid subscription (Pro or Business) at any time. To cancel, navigate to your <strong>Billing & Usage</strong> settings within the console and click "Cancel Subscription". Your limits and resource allocation settings will immediately downgrade back to the Free plan tier upon submission.
            </p>
          </div>

          <div>
            <h2 className="text-sm font-bold text-zinc-850 dark:text-zinc-200 mb-3">3. Refund Terms</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-[1.8]">
              Since platform tier resources are instantiated and utilized immediately upon checkout, we do not offer refunds or pro-rated credits for billing cycles already completed or active. All payments processed via the Razorpay gateway sandbox or production nodes are final.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-zinc-200 dark:border-zinc-900/60 mt-12 pt-8">
          <p className="text-xs text-zinc-500 dark:text-zinc-700">
            For further inquiries regarding transaction statements or invoicing, contact support at{" "}
            <a href="mailto:support@subnetmask.tech" className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 transition duration-150">
              support@subnetmask.tech
            </a>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-900/40 bg-sky-50/60 dark:bg-transparent transition-colors duration-250">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="text-xs text-zinc-500 dark:text-zinc-650">PulsePing © 2026</span>
          <div className="flex items-center gap-5">
            <Link href="/terms" className="text-xs text-zinc-500 hover:text-zinc-950 dark:text-zinc-500 dark:hover:text-zinc-300 transition duration-150">Terms</Link>
            <Link href="/privacy" className="text-xs text-zinc-500 hover:text-zinc-950 dark:text-zinc-500 dark:hover:text-zinc-300 transition duration-150">Privacy</Link>
            <Link href="/status" className="text-xs text-zinc-500 hover:text-zinc-950 dark:text-zinc-500 dark:hover:text-zinc-300 transition duration-150">Status</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
