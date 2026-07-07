import Link from "next/link";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Terms of Service | PulsePing",
  description: "Read PulsePing's Terms of Service covering usage rights, monitor limits, billing policies, and service agreements.",
};

const sections = [
  {
    title: "1. Acceptance of Terms",
    body: `By accessing or using PulsePing ("Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not use the Service. These terms apply to all users, including those on free and paid account tiers.`,
  },
  {
    title: "2. Service Description",
    body: `PulsePing provides automated HTTP endpoint monitoring, uptime logging, and alert notification services. The Service operates serverless polling pipelines that periodically send HTTP requests to registered endpoint URLs and records response telemetry including status codes and latency measurements.`,
  },
  {
    title: "3. Account Registration",
    body: `Access to PulsePing requires authentication via Clerk. You are responsible for maintaining the security of your credentials and for all activity under your account. You must provide accurate information during registration. Accounts may not be shared or transferred without express written permission.`,
  },
  {
    title: "4. Monitor Stream Limits",
    body: `Free Tier accounts may register up to two (2) active monitor streams. Pro Tier accounts support unlimited monitor stream registrations. Monitors that consistently fail validation or target private IP ranges, localhost addresses, or internal network endpoints may be suspended without notice to protect shared infrastructure. Frequency of polling is fixed at 10-minute intervals for all plans.`,
  },
  {
    title: "5. Acceptable Use Policy",
    body: `You agree not to use the Service to monitor endpoints you do not own or have explicit permission to test. You may not use PulsePing to conduct load testing, vulnerability scanning, or any form of network probing beyond simple HTTP health checks. Any abuse of the monitoring infrastructure may result in immediate account termination.`,
  },
  {
    title: "6. Billing and Subscription",
    body: `Pro Tier subscriptions are billed monthly at the rate published on the pricing page at the time of purchase. All payments are processed securely via Razorpay. Subscription fees are non-refundable except as required by applicable law. You may cancel your subscription at any time; cancellation takes effect at the end of the current billing period. Downgrades to Free Tier will enforce stream limits at the start of the next billing cycle.`,
  },
  {
    title: "7. Service Availability",
    body: `PulsePing targets 99.5% monthly uptime for its core monitoring infrastructure. Scheduled maintenance windows will be announced via the status page at /status. We are not liable for missed alert notifications caused by third-party webhook delivery failures, including Discord API outages. Monitor polling may be delayed during infrastructure maintenance periods.`,
  },
  {
    title: "8. Data Retention",
    body: `PingLog entries (response records) are retained for 90 days for Free Tier accounts and 12 months for Pro Tier accounts, after which they are automatically purged. Registered endpoint URLs and Discord webhook URLs are retained for the lifetime of the account. Account data is deleted within 30 days of account termination.`,
  },
  {
    title: "9. Intellectual Property",
    body: `All content, code, designs, and trademarks associated with PulsePing are the exclusive property of their respective owners. You retain ownership of any endpoints you register. You grant PulsePing a limited license to access registered URLs solely for the purpose of performing monitor checks.`,
  },
  {
    title: "10. Limitation of Liability",
    body: `PulsePing is provided on an "as-is" and "as-available" basis. To the fullest extent permitted by law, we disclaim all warranties, express or implied. We are not liable for any indirect, incidental, consequential, or punitive damages arising from your use of the Service. Our total aggregate liability shall not exceed the amount you paid for the Service in the 3 months preceding the claim.`,
  },
  {
    title: "11. Termination",
    body: `We reserve the right to suspend or terminate your account at any time for violations of these terms, abuse of infrastructure, or non-payment. You may terminate your account at any time by contacting support. Upon termination, your data will be retained for 30 days before deletion.`,
  },
  {
    title: "12. Changes to Terms",
    body: `We may update these Terms of Service from time to time. Significant changes will be communicated via email or an in-app notice. Your continued use of the Service after such notice constitutes acceptance of the updated terms.`,
  },
  {
    title: "13. Governing Law",
    body: `These terms are governed by the laws of India. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the competent courts of India.`,
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 dark:bg-[#030303] dark:text-zinc-100 font-sans antialiased relative overflow-x-hidden transition-colors duration-250">

      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-zinc-650/[0.03] to-transparent blur-[100px] pointer-events-none z-0 dark:opacity-100 opacity-20" />

      {/* Sticky Navigation */}
      <Navbar activeLink="terms" />

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 relative z-10">

        {/* Page Header */}
        <div className="mb-12 pb-8 border-b border-zinc-200 dark:border-zinc-900/60">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-bold tracking-widest uppercase text-zinc-500 dark:text-zinc-650 border border-zinc-200 dark:border-zinc-800 px-2 py-0.5 rounded-full bg-zinc-50 dark:bg-transparent">Legal</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 mb-3">Terms of Service</h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
            Please read these terms carefully before using PulsePing. By accessing the service, you agree to the policies outlined below.
          </p>
          <p className="text-zinc-400 dark:text-zinc-700 text-xs mt-4 font-mono">Effective: January 1, 2026 · Version 1.0</p>
        </div>

        {/* Terms Sections */}
        <div className="space-y-8">
          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="text-sm font-bold text-zinc-800 dark:text-zinc-200 tracking-tight mb-3">{section.title}</h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-[1.8]">{section.body}</p>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-zinc-200 dark:border-zinc-900/60 mt-12 pt-8">
          <p className="text-xs text-zinc-500 dark:text-zinc-700">
            Questions about these terms? Contact us at{" "}
            <a href="mailto:support@subnetmask.tech" className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 transition duration-150">
              support@subnetmask.tech
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
