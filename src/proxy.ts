import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

export const runtime = "edge";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

export const proxy = clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) await auth.protect();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.[\\w]+$)[^?]*Match*)',
    '/(api|trpc)(.*)',
  ],
};
