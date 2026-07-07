import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

export const proxy = clerkMiddleware(async (auth, req) => {
  const isPublicRoute = createRouteMatcher([
    "/",
    "/sign-in(.*)",
    "/sign-up(.*)",
    "/status(.*)",
    "/sitemap.xml",
    "/robots.txt",
    "/privacy",
    "/terms"
  ]);

  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest))).*',
    '/(api|trpc)(.*)'
  ],
};
