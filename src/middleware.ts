import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Mandatory edge runtime declaration for @opennextjs/cloudflare
export const runtime = "experimental-edge";

const isPublicRoute = createRouteMatcher([
  "/",
  "/pricing",
  "/privacy",
  "/terms",
  "/contact",
  "/cancellation-refund",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/status(.*)",
  "/api/cron/ping",
  "/api/heartbeat/(.*)",
  "/api/health",
  "/api/relay(.*)",
  // Razorpay webhook — server-to-server, no auth header
  "/api/webhooks(.*)",
  "/favicon.ico",
  "/icon",
  "/sitemap.xml",
  "/robots.txt",
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
  return NextResponse.next();
});

export const config = {
  matcher: [
    // 1. Intercept all routes except Next.js internals, static assets, and public API endpoints
    "/((?!_next|favicon\\.ico|icon|api/cron/ping|api/heartbeat|api/webhooks|[^?]*\\.(?:html|css|js|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // 2. Explicitly target active transaction API endpoints
    "/api/create-order",
    "/api/razorpay/order",
    "/api/verify-payment",
    // 3. Intercept all trpc routes safely
    "/trpc(.*)",
  ],
};