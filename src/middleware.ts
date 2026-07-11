import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/", 
  "/pricing", 
  "/privacy", 
  "/terms"
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
  return NextResponse.next();
});

export const config = {
  matcher: [
    // 1. Intercept all routes except Next.js internals, static assets, and the public cron endpoint
    "/((?!_next|api/cron/ping|[^?]*\\.(?:html|css|js|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // 2. Explicitly target our specific active transaction API endpoints to satisfy Next.js route validation constraints
    "/api/create-order",
    "/api/verify-payment",
    // 3. Intercept all trpc routes safely
    "/trpc(.*)",
  ],
};
