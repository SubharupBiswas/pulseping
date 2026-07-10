import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

export const runtime = "experimental-edge";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) await auth.protect();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.[\\w]+$)[^?]*Match*)',
    '/(api|trpc)(.*)',
  ],
};
