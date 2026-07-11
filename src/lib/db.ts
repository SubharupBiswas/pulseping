import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool } from "@neondatabase/serverless";

declare global {
  var prisma: PrismaClient | undefined;
}

let cachedPrisma: PrismaClient | null = null;

export const prisma = new Proxy({} as PrismaClient, {
  get(target, prop, receiver) {
    if (typeof window !== "undefined") {
      return undefined;
    }

    if (!cachedPrisma) {
      if (process.env.NODE_ENV !== "production" && globalThis.prisma) {
        cachedPrisma = globalThis.prisma as any;
      } else {
        const url = process.env.DATABASE_URL;
        if (
          !url ||
          url.trim() === "" ||
          url === "undefined" ||
          url === "null" ||
          !(url.startsWith("postgres://") || url.startsWith("postgresql://"))
        ) {
          throw new Error(
            `Lazy Connection Error: DATABASE_URL runtime environment variable is invalid, uninitialized, or missing its protocol prefix! Received: "${url}"`
          );
        }

        const adapter = new PrismaNeon({ connectionString: url } as any);
        const client = new PrismaClient({ adapter } as any);

        cachedPrisma = client;
        if (process.env.NODE_ENV !== "production") {
          globalThis.prisma = client;
        }
      }
    }

    const value = Reflect.get(cachedPrisma!, prop, receiver);
    return typeof value === "function" ? value.bind(cachedPrisma!) : value;
  },
});

export const db = prisma;