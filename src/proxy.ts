import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define which matching patterns require mandatory authenticated sessions
const isDashboardRoute = createRouteMatcher(["/dashboard(.*)"]);

export const proxy = clerkMiddleware(async (auth, req) => {
  const session = await auth();
  const isUnauthenticated = !session.userId || session.userId === "mock-user-uuid";

  if (isDashboardRoute(req)) {
    if (isUnauthenticated) {
      const signInUrl = new URL("/sign-in", req.url);
      return NextResponse.redirect(signInUrl);
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and static assets, run middleware on everything else
    "/((?!_next|[^?]*\\.(?:html|css|js|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API and TRPC routes
    "/(api|trpc)(.*)",
    // Clerk auto-proxy path for authentication routing
    "/__clerk/:path*",
  ],
};
