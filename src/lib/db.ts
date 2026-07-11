import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool } from "@neondatabase/serverless";

declare global {
  var prisma: PrismaClient | undefined;
}

let cachedPrisma: PrismaClient | undefined;

const createEdgeClient = () => {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    idleTimeoutMillis: 2000,
    max: 10
  });
  const adapter = new PrismaNeon(pool as any);
  return new PrismaClient({ adapter } as any);
};

// The Proxy traps lookups and defers execution until the request loop is actively handling data
export const prisma = new Proxy({} as PrismaClient, {
  get(target, prop, receiver) {
    if (typeof window !== "undefined") {
      return undefined;
    }

    // Strict protocol verification directly inside the dynamic request path
    const url = process.env.DATABASE_URL;
    if (
      !url ||
      url.trim() === "" ||
      url === "undefined" ||
      url === "null" ||
      !(url.startsWith("postgres://") || url.startsWith("postgresql://"))
    ) {
      throw new Error(
        `DATABASE_URL runtime environment variable is invalid, uninitialized, or missing its protocol prefix! Received: "${url}"`
      );
    }

    const instance = process.env.NODE_ENV === "production"
      ? (cachedPrisma ??= createEdgeClient())
      : (globalThis.prisma ??= createEdgeClient());

    const value = Reflect.get(instance, prop, receiver);
    return typeof value === "function" ? value.bind(instance) : value;
  }
});

export const db = prisma;