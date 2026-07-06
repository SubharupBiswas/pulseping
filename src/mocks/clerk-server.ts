import { NextRequest, NextResponse } from "next/server";

export async function auth() {
  return {
    userId: "mock-user-uuid",
    protect: async () => {},
  };
}

export function createRouteMatcher(patterns: string[]) {
  return (req: NextRequest) => {
    const url = req.nextUrl.pathname;
    return patterns.some((pattern) => {
      const cleanPattern = pattern.replace("(.*)", "");
      return url.startsWith(cleanPattern);
    });
  };
}

type MiddlewareHandler = (auth: any, req: NextRequest) => Promise<any> | any;

export function clerkMiddleware(handler: MiddlewareHandler) {
  return async (req: NextRequest) => {
    const authContext = {
      userId: "mock-user-uuid",
      protect: async () => {},
    };
    await handler(authContext, req);
    return NextResponse.next();
  };
}
