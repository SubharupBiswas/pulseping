import { Pool } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";

// Global singleton pattern to prevent database connection pool exhaustion during local fast-refresh development
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  neonPool: Pool | undefined;
};

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is missing");
}

const pool = globalForPrisma.neonPool ?? new Pool({ connectionString });

const adapter = new PrismaNeon(pool);

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
  globalForPrisma.neonPool = pool;
}
