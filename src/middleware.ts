import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/", 
  "/pricing", 
  "/privacy", 
  "/terms",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/status(.*)",
  "/api/cron/ping",
  "/api/heartbeat/(.*)",
  // Razorpay webhook — server-to-server, no auth header
  "/api/webhooks/razorpay",
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
    "/((?!_next|api/cron/ping|api/heartbeat|api/webhooks|[^?]*\\.(?:html|css|js|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // 2. Explicitly target our specific active transaction API endpoints
    "/api/create-order",
    "/api/razorpay/order",
    "/api/verify-payment",
    // 3. Intercept all trpc routes safely
    "/trpc(.*)",
  ],
};
