import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

export const metadata = {
  title: "Privacy Policy | PulsePing",
  description: "Read PulsePing's Privacy Policy describing how we collect, store, and utilize database and authentication telemetry records.",
};

const sections = [
  {
    title: "1. Information We Collect",
    body: `We collect information necessary to perform uptime monitoring and alert notifications. This includes:`,
    bullets: [
      `User Profile Data: Email addresses, user IDs, and metadata provided by Clerk during user sign-in processes.`,
      `Registered Target Data: Target URLs and optional Discord webhook URL strings registered to user monitoring channels.`,
      `Telemetry Log Records: Status codes, HTTP response headers, check latencies, check timestamps, and target accessibility metrics logged to PostgreSQL.`,
      `Billing Details: Subscription status, payment references, and plan limits processed securely by Razorpay. We do not store raw card numbers.`,
    ],
  },
  {
    title: "2. How We Use Information",
    body: `Information is processed exclusively to:`,
    bullets: [
      `Instantiate and execute automated endpoint check cron tasks.`,
      `Dispatch Markdown failure embeds to your Discord channel targets when health rules are breached.`,
      `Generate the dashboard console charts, stats matrices, and check histories.`,
      `Manage subscription records, verify signatures, and upgrade plan capacities.`,
      `Verify user authorization inside monitors server actions.`,
    ],
  },
  {
    title: "3. Service Infrastructure and Database Storage",
    body: `Data is stored durably on Neon PostgreSQL servers utilizing Prisma 7. The database records are protected by encryption at rest. Internal database queries are strictly constrained to ensure that users may only view telemetry data matching their authenticated Clerk identity signature.`,
  },
  {
    title: "4. Telemetry Log Retention and Purges",
    body: `Uptime logs (PingLogs) are stored for:`,
    bullets: [
      `Free Tier: 90 days of check history, after which logs are permanently deleted.`,
      `Pro Tier: 365 days of check history, allowing for long-term SLA reporting.`,
      `Deleted Monitors: When a website monitor is deleted, all dependent PingLog entries are purged from the database immediately to preserve integrity.`,
    ],
  },
  {
    title: "5. Security notice and Warning Interception",
    body: `To protect your operational metrics, all dashboard and server pipelines intercept database driver event outputs. Database warnings are caught and sanitized before logs are written to external diagnostic consoles, preventing credentials or configurations from leaking.`,
  },
  {
    title: "6. Billing and Checkout Security",
    body: `All payment operations are handled by Razorpay's PCI-DSS compliant standard web checkout framework. Under sandbox and production profiles, checkout fields utilize dynamic data sanitization: customer contact details inside prefill objects are restricted to mock credentials (9876543210 / test.premium@pulseping.io) to protect your real profile information.`,
  },
  {
    title: "7. Cookies and Authentication Identifiers",
    body: `We do not set tracking or advertising cookies. Access tokens and session keys are managed natively by Clerk using secure HTTP-only cookie parameters to validate route routing configurations.`,
  },
  {
    title: "8. Data Sharing and Third-Party API Hooks",
    body: `We do not sell user data. Target check metrics are dispatched to third-party endpoints (e.g. Discord servers) solely when a webhook URL is configured by the user. These requests are sent over HTTPS with payload signatures.`,
  },
  {
    title: "9. Your Rights and Access Controls",
    body: `You have the right to access, edit, or delete any monitors registered to your account at any time via the console. If you wish to delete your entire profile and database record archive, you may contact support.`,
  },
  {
    title: "10. Children's Privacy",
    body: `PulsePing does not knowingly collect or solicit personal data from children. The Service is restricted to developers and professionals managing online endpoints.`,
  },
  {
    title: "11. Changes to this Privacy Policy",
    body: `We may revise this policy periodically. The version marker will be updated, and significant updates will be communicated on the homepage footer status bar or via email.`,
  },
  {
    title: "12. Contact Information",
    body: `For questions about this policy or database practices, contact support at legal@pulseping.io.`,
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 dark:bg-[#030303] dark:text-zinc-100 font-sans antialiased relative overflow-x-hidden transition-colors duration-250">

      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-zinc-650/[0.03] to-transparent blur-[100px] pointer-events-none z-0 dark:opacity-100 opacity-20" />

      {/* Sticky Navigation */}
      <nav className="sticky top-0 z-50 border-b border-zinc-200 dark:border-zinc-900/60 bg-white/75 dark:bg-[#030303]/60 backdrop-blur-xl transition-colors duration-250">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group pointer-events-auto">
            <div className="w-5 h-5 rounded-md bg-zinc-950 dark:bg-zinc-50 flex items-center justify-center shadow-[0_0_10px_rgba(255,255,255,0.06)] group-hover:bg-zinc-800 dark:group-hover:bg-zinc-200 transition duration-150">
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-50 dark:bg-zinc-950" />
            </div>
            <span className="font-semibold text-sm tracking-tight text-zinc-900 dark:text-zinc-100">PulsePing</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/pricing" className="text-xs text-zinc-500 hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-zinc-300 transition duration-150">Pricing</Link>
            <ThemeToggle />
            <Link href="/terms" className="text-xs text-zinc-500 hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-zinc-300 transition duration-150">Terms</Link>
            <Link href="/status" className="text-xs text-zinc-500 hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-zinc-300 transition duration-150">Status</Link>
            <Link href="/dashboard" className="text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-800 px-3 py-1.5 rounded-lg transition duration-150 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.03)]">Console</Link>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 relative z-10">

        {/* Page Header */}
        <div className="mb-12 pb-8 border-b border-zinc-200 dark:border-zinc-900/60">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-bold tracking-widest uppercase text-zinc-500 dark:text-zinc-650 border border-zinc-200 dark:border-zinc-800 px-2 py-0.5 rounded-full bg-zinc-50 dark:bg-transparent">Legal</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-3">Privacy Policy</h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
            This policy outlines how PulsePing processes user authentication information, endpoint targets, and monitoring log archives.
          </p>
          <p className="text-zinc-400 dark:text-zinc-700 text-xs mt-4 font-mono">Effective: January 1, 2026 · Version 1.0</p>
        </div>

        {/* Policy Sections */}
        <div className="space-y-8">
          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="text-sm font-bold text-zinc-800 dark:text-zinc-200 tracking-tight mb-3">{section.title}</h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-[1.8]">{section.body}</p>
              {section.bullets && (
                <ul className="list-disc pl-5 mt-3 space-y-2">
                  {section.bullets.map((bullet, i) => (
                    <li key={i} className="text-sm text-zinc-550 dark:text-zinc-450 leading-[1.7]">{bullet}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-zinc-200 dark:border-zinc-900/60 mt-12 pt-8">
          <p className="text-xs text-zinc-500 dark:text-zinc-700">
            Questions about your database files or data logs? Contact us at{" "}
            <a href="mailto:legal@pulseping.io" className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 transition duration-150">
              legal@pulseping.io
            </a>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-900/40 bg-zinc-50/50 dark:bg-transparent transition-colors duration-250">
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
