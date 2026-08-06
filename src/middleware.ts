import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


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
  "/api/webhooks(.*)",
  "/favicon.ico",
  "/icon.svg",
  "/logo.svg",
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
    /*
     * 1. Exclude static assets, _next internal bundles, public icons, images, and static XML files.
     * 2. Always run middleware on API and TRPC endpoints to inject Clerk auth headers.
     */
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|json|webmanifest|png|jpg|jpeg|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|xml)).*)",
    "/(api|trpc)(.*)",
  ],
};