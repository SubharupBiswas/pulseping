import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Enforce strict public matching rules
const isPublicRoute = createRouteMatcher([
  "/", 
  "/pricing", 
  "/privacy", 
  "/terms",
  "/api/cron/ping(.*)" // Allow our automated cron loop to bypass token checks
]);

export default clerkMiddleware(async (auth, req) => {
  // Protect non-public routes
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
  
  // Explicitly clone and return the request headers context 
  // to guarantee OpenNext carries Clerk's auth states down to auth()
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Match all request paths except static files and next internals
    "/((?!_next|[^?]*\\.(?:html|css|js|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
