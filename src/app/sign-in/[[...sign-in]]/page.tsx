import { SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import Turnstile from "@marsview/react-turnstile";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-200 flex flex-col relative overflow-hidden transition-colors duration-250">
      
      {/* Ambient glow - vibrant modern SaaS blur */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-emerald-500/10 via-indigo-500/5 to-transparent blur-3xl pointer-events-none z-0" />

      {/* Minimal Header */}
      <nav className="relative z-10 border-b border-zinc-200 dark:border-zinc-850 bg-white/60 dark:bg-zinc-950/60 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group pointer-events-auto">
            <div className="w-5 h-5 rounded-md bg-zinc-950 dark:bg-zinc-50 flex items-center justify-center shadow-[0_0_10px_rgba(255,255,255,0.06)] group-hover:bg-zinc-800 dark:group-hover:bg-zinc-200 transition duration-150">
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-50 dark:bg-zinc-950" />
            </div>
            <span className="font-semibold text-sm tracking-tight text-zinc-900 dark:text-zinc-100">PulsePing</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-zinc-650 dark:text-zinc-400 font-medium">
              No account?{" "}
              <Link href="/sign-up" className="text-zinc-900 dark:text-zinc-100 font-semibold underline hover:text-emerald-500 transition duration-150">
                Sign up free
              </Link>
            </span>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* Centered Sign-In Card */}
      <div className="flex-1 flex items-center justify-center py-16 px-4 relative z-10">
        <div className="w-full max-w-[420px]">
          {/* Page Title */}
          <div className="text-center mb-8">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 mb-2">Sign in to PulsePing</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Monitor your endpoints with confidence.</p>
          </div>

          {/* Clerk Sign-In Component */}
          <div className="flex flex-col items-center gap-4">
            <SignIn
              appearance={{
                baseTheme: dark,
                elements: {
                  rootBox: "w-full",
                  card: "bg-white dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04),0_32px_64px_rgba(0,0,0,0.6)] backdrop-blur-md rounded-2xl w-full",
                  headerTitle: "text-zinc-900 dark:text-zinc-100 text-base font-semibold tracking-tight",
                  headerSubtitle: "text-zinc-500 text-xs",
                  socialButtonsBlockButton: "bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition duration-150 rounded-lg text-xs font-medium",
                  dividerLine: "bg-zinc-200 dark:bg-zinc-800/60",
                  dividerText: "text-zinc-450 dark:text-zinc-650 text-xs",
                  formFieldLabel: "text-zinc-600 dark:text-zinc-400 text-xs font-medium",
                  formFieldInput: "bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-650 focus:border-zinc-400 dark:focus:border-zinc-600 focus:ring-0 rounded-lg text-sm",
                  formButtonPrimary: "bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-white text-xs font-semibold rounded-lg py-2.5 transition duration-150 shadow-[0_1px_2px_rgba(0,0,0,0.08)]",
                  footerActionText: "text-zinc-500 text-xs",
                  footerActionLink: "text-emerald-600 dark:text-emerald-500 hover:text-emerald-500 dark:hover:text-emerald-450 font-medium text-xs",
                  identityPreviewText: "text-zinc-700 dark:text-zinc-300 text-xs",
                  identityPreviewEditButton: "text-emerald-600 dark:text-emerald-500 hover:text-emerald-500 dark:hover:text-emerald-450 text-xs",
                  alertText: "text-zinc-800 dark:text-zinc-300 text-xs",
                  formResendCodeLink: "text-emerald-600 dark:text-emerald-500 hover:text-emerald-500 dark:hover:text-emerald-450 text-xs",
                },
              } as any}
              fallbackRedirectUrl="/dashboard"
              signUpUrl="/sign-up"
            />
            <div className="mt-2">
              <Turnstile siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY} />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-zinc-200 dark:border-zinc-900/40 py-6">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-center gap-5">
          <Link href="/terms" className="text-sm text-zinc-550 hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-zinc-300 transition duration-150">Terms</Link>
          <Link href="/privacy" className="text-sm text-zinc-550 hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-zinc-300 transition duration-150">Privacy</Link>
          <Link href="/status" className="text-sm text-zinc-550 hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-zinc-300 transition duration-150">Status</Link>
        </div>
      </footer>
    </div>
  );
}
