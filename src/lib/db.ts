import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool, neonConfig } from "@neondatabase/serverless";

// Force HTTP fetch mode on Cloudflare Edge Isolates (eliminates WebSocket CPU overhead)
neonConfig.webSocketConstructor = undefined;

function getDatabaseUrl(): string {
  // 1. Try standard process.env
  const processEnvUrl = process.env.DATABASE_URL;
  if (
    processEnvUrl &&
    processEnvUrl.trim() !== "" &&
    processEnvUrl !== "undefined" &&
    processEnvUrl !== "null" &&
    (processEnvUrl.startsWith("postgres://") || processEnvUrl.startsWith("postgresql://"))
  ) {
    return processEnvUrl;
  }

  // 2. Try OpenNext Cloudflare Request Context (Required for Cloudflare Pages Server Actions)
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { getCloudflareContext } = require("@opennextjs/cloudflare");
    const ctx = getCloudflareContext();
    const cfEnvUrl = ctx?.env?.DATABASE_URL;

    if (
      cfEnvUrl &&
      cfEnvUrl.trim() !== "" &&
      (cfEnvUrl.startsWith("postgres://") || cfEnvUrl.startsWith("postgresql://"))
    ) {
      return cfEnvUrl;
    }
  } catch {
    // Context unavailable outside active server request
  }

  console.error("❌ CRITICAL: DATABASE_URL is missing or invalid in process.env and Cloudflare Context");
  throw new Error("Database Client Initialization Error: DATABASE_URL is missing or invalid.");
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const connectionString = getDatabaseUrl();

  // Use HTTP Pool mode for connection reuse across isolates
  const pool = new Pool({ connectionString });

  // Cast pool as `any` to bypass the @types/pg declaration clash
  const adapter = new PrismaNeon(pool as any);
  return new PrismaClient({ adapter });
}

// 🟢 LAZY PROXY INITIALIZATION: Delays Prisma instantiation until request execution
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
export const loadEnv = () => {};