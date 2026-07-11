import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool } from "@neondatabase/serverless";

declare global {
  var prisma: PrismaClient | undefined;
}

const createEdgeClient = () => {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL runtime environment variable is completely missing!");
  }

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
    const instance = process.env.NODE_ENV === "production"
      ? createEdgeClient()
      : (globalThis.prisma ??= createEdgeClient());

    const value = Reflect.get(instance, prop, receiver);
    return typeof value === "function" ? value.bind(instance) : value;
  }
});

export const db = prisma;