import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool } from "@neondatabase/serverless";
import { cache } from "react";

declare global {
  var prisma: PrismaClient | undefined;
}

const createEdgeClient = () => {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaNeon(pool as any);
  return new PrismaClient({ adapter } as any);
};

// Memoize client instantiation across the duration of a single fetch request
const getRequestScopedClient = cache(() => {
  return createEdgeClient();
});

export const prisma = new Proxy({} as PrismaClient, {
  get(target, prop, receiver) {
    if (typeof window !== "undefined") {
      return undefined;
    }
    const instance = process.env.NODE_ENV === "production"
      ? getRequestScopedClient()
      : (globalThis.prisma ??= createEdgeClient());
      
    const value = Reflect.get(instance, prop, receiver);
    return typeof value === "function" ? value.bind(instance) : value;
  }
});

export const db = prisma;