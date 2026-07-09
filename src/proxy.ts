import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/status(.*)",
  "/sitemap.xml",
  "/robots.txt",
  "/privacy",
  "/terms",
  "/pricing",
  "/api/cron(.*)"
]);

const clerkProxy = clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export function proxy(req: any, event: any) {
  return clerkProxy(req, event);
}

// 1. Correct Next.js 16 App Router Standard: Top-level runtime declaration
export const runtime = "edge";

// 2. The config object now strictly holds framework routing scopes only
export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};