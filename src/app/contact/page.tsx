import Link from "next/link";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Customer Support & Contact | PulsePing",
  description: "Contact PulsePing customer support for inquiries, assistance with website uptime tracking configurations, or billing updates.",
};

export default function ContactPage() {
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
              Support
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-3">
            Contact & Support
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
            Get in touch with PulsePing support. We are here to assist you with monitoring configs, custom webhooks, or dashboard operations.
          </p>
        </div>

        {/* Support Information Card */}
        <div className="bg-white/90 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl p-6 shadow-sm backdrop-blur-md transition-colors space-y-6">
          <div>
            <h2 className="text-sm font-bold text-zinc-850 dark:text-zinc-200 mb-1">Operational Business Name</h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">PulsePing (operated under Subnetmask Tech)</p>
          </div>

          <div>
            <h2 className="text-sm font-bold text-zinc-850 dark:text-zinc-200 mb-1">Primary Support Email</h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              <a href="mailto:support@subnetmask.tech" className="text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300 font-mono font-semibold">
                support@subnetmask.tech
              </a>
            </p>
          </div>

          <div>
            <h2 className="text-sm font-bold text-zinc-850 dark:text-zinc-200 mb-1">Response Timeframe Guarantee</h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Our engineering team responds to all customer support inquiries within <strong>24 hours</strong>. Priority developer support is provided to Business tier subscribers.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-zinc-200 dark:border-zinc-900/60 mt-12 pt-8">
          <p className="text-xs text-zinc-500 dark:text-zinc-700">
            For operational system metrics, check our{" "}
            <Link href="/status" className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 underline transition duration-150">
              System Status
            </Link>{" "}
            page.
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
