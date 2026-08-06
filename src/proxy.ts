import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/api/health",
  "/api/cron/ping",
  "/api/webhooks(.*)",
  "/api/heartbeat(.*)",
  "/api/relay(.*)",
  "/status(.*)",
  "/pricing(.*)",
  "/privacy(.*)",
  "/terms(.*)",
  "/contact(.*)",
  "/cancellation-refund(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|json|webmanifest|ttf|woff2?|png|jpg|jpeg|gif|svg|ico|csv|docx?|xlsx?|zip)).*)",
    "/(api|trpc)(.*)",
  ],
};