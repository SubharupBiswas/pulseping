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
    // 1. Skip Next.js internals, static files, and explicitly exclude the public cron route from running Clerk at all
    "/((?!_next|api/cron/ping|[^?]*\\.(?:html|css|js|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // 2. Run Clerk for all other API paths except our public cron ping route
    "/api/(?!cron/ping)(.*)",
    // 3. Run Clerk for all trpc routes
    "/trpc(.*)",
  ],
};
