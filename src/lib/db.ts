import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

// Intercept and suppress pg-driver SSL security warnings during development
if (typeof process !== "undefined" && typeof process.emitWarning === "function") {
  const originalEmitWarning = process.emitWarning;
  process.emitWarning = function (warning: any, ...args: any[]) {
    const message = typeof warning === "string" ? warning : (warning && warning.message) || "";
    if (message.includes("SECURITY WARNING") || message.includes("SSL modes")) {
      return;
    }
    return originalEmitWarning.call(process, warning, ...args);
  };
}


const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pgPool: Pool | undefined;
};

const connectionString = process.env.DATABASE_URL;

const pool =
  globalForPrisma.pgPool ??
  new Pool({
    connectionString,
    max: 10,
  });

const adapter = new PrismaPg(pool);

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
  globalForPrisma.pgPool = pool;
}
