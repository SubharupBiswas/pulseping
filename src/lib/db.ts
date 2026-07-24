import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool } from "@neondatabase/serverless";
import fs from "fs";
import path from "path";

/**
 * Explicitly load environment variables prior to client/pool instantiation.
 * Checks process.cwd() for .env.local and .env files, populating process.env if DATABASE_URL is not set.
 */
export function loadEnv() {
  if (typeof window !== "undefined") return;

  if (!process.env.DATABASE_URL) {
    const envFiles = [".env.local", ".env"];
    for (const file of envFiles) {
      const fullPath = path.resolve(process.cwd(), file);
      if (fs.existsSync(fullPath)) {
        try {
          if (typeof (process as any).loadEnvFile === "function") {
            (process as any).loadEnvFile(fullPath);
          } else {
            const content = fs.readFileSync(fullPath, "utf-8");
            for (const line of content.split("\n")) {
              const trimmed = line.trim();
              if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
                const [key, ...valParts] = trimmed.split("=");
                const val = valParts.join("=").replace(/^["']|["']$/g, "").trim();
                const k = key.trim();
                if (k && !process.env[k]) {
                  process.env[k] = val;
                }
              }
            }
          }
        } catch {
          // Ignore env file read errors
        }
      }
    }
  }
}

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
      // Always ensure environment variables are loaded before checking or initializing connections
      loadEnv();

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
            `Database Client Initialization Error: Required environment variable DATABASE_URL is missing, uninitialized, or missing its PostgreSQL connection string prefix ("postgresql://" or "postgres://"). ` +
            `Ensure DATABASE_URL is configured in your environment or .env file prior to initializing database connections. Received: "${url}"`
          );
        }

        const pool = new Pool({ connectionString: url });
        const adapter = new PrismaNeon(pool as any);
        const client = new PrismaClient({ adapter });

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