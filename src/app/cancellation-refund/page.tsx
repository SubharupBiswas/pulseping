import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
          <p className="text-zinc-400 dark:text-zinc-700 text-xs mt-4 font-mono">Effective: August 1, 2026 · Version 1.0</p>
        </div>

        {/* Cancellation and Refund Policy details */}
        <div className="space-y-8">
          <div>
            <h2 className="text-sm font-bold text-zinc-850 dark:text-zinc-200 mb-3">1. Instant Resource Provisioning</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-[1.8]">
              PulsePing operates a developer-first SaaS platform. Upon successful signature verification of a checkout transaction processed by our payment gateway (Razorpay), your subscription resources (e.g. up to 100 monitor streams, high-frequency 10-second or 30-second checking, multi-channel webhook alert relays) are provisioned instantaneously to your account context.
            </p>
          </div>

          <div>
            <h2 className="text-sm font-bold text-zinc-850 dark:text-zinc-200 mb-3">2. Cancellation Guidelines</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-[1.8]">
              You can cancel your active paid subscription (Pro or Business) at any time. To cancel, navigate to your <strong>Billing & Usage</strong> settings within the console and click "Cancel Subscription". Your limits and resource allocation settings will immediately downgrade back to the Free plan tier upon submission.
            </p>
          </div>

          <div>
            <h2 className="text-sm font-bold text-zinc-850 dark:text-zinc-200 mb-3">3. Refund Terms & 14-Day Guarantee</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-[1.8]">
              We offer a <strong>14-day money-back guarantee</strong> for initial paid subscription upgrades. If you are unsatisfied with your upgraded tier, contact support at <a href="mailto:support@subharup.com" className="text-emerald-600 dark:text-emerald-400 underline font-semibold">support@subharup.com</a> within 14 days of purchase for a full cancellation refund. Payments processed via the Razorpay gateway for subsequent recurring renewal cycles are non-refundable except as required by applicable law.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-zinc-200 dark:border-zinc-900/60 mt-12 pt-8">
          <p className="text-xs text-zinc-500 dark:text-zinc-700">
            For further inquiries regarding transaction statements or invoicing, contact support at{" "}
            <a href="mailto:support@subharup.com" className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 transition duration-150">
              support@subharup.com
            </a>
          </p>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
