import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool, neonConfig } from "@neondatabase/serverless";

// Force HTTP fetch mode on Cloudflare Edge Isolates (eliminates WebSocket CPU overhead)
neonConfig.webSocketConstructor = undefined;

export function ensureEnvLoaded() {
  if (process.env.DATABASE_URL && process.env.DATABASE_URL.trim() !== "") {
    return;
  }
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  ensureEnvLoaded();
  const connectionString = process.env.DATABASE_URL;

  if (
    !connectionString ||
    connectionString.trim() === "" ||
    connectionString === "undefined" ||
    connectionString === "null" ||
    !(
      connectionString.startsWith("postgres://") ||
      connectionString.startsWith("postgresql://")
    )
  ) {
    console.error(
      "❌ CRITICAL: DATABASE_URL is missing or invalid in process.env at execution time"
    );
    throw new Error(
      `Database Client Initialization Error: Required environment variable DATABASE_URL is missing or invalid.`
    );
  }

  // Use HTTP Pool mode for zero-latency connection reuse across isolates
  const pool = new Pool({ connectionString });
  
  // Cast pool as `any` to bypass the @types/pg declaration clash
  const adapter = new PrismaNeon(pool as any);
  return new PrismaClient({ adapter });
}

// 🟢 LAZY PROXY INITIALIZATION: Delays Prisma instantiation until request runtime
export const db = new Proxy({} as PrismaClient, {
  get(_target, prop: keyof PrismaClient) {
    if (!globalForPrisma.prisma) {
      globalForPrisma.prisma = createPrismaClient();
    }
    const instance = globalForPrisma.prisma;
    const value = instance[prop];
    return typeof value === "function" ? value.bind(instance) : value;
  },
});

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}

export const prisma = db;
export const loadEnv = ensureEnvLoaded;