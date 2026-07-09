import 'server-only';
import { neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '@prisma/client';

let internalClientInstance: PrismaClient | undefined;

function initializeDatabaseClient(): PrismaClient {
  if (internalClientInstance) return internalClientInstance;

  let connectionString: string | undefined;

  // 1. Extract database secrets via OpenNext Context (Production Edge environment)
  try {
    const { getCloudflareContext } = require('@opennextjs/cloudflare');
    const ctx = getCloudflareContext();
    if (ctx && ctx.env) {
      connectionString = ctx.env.DATABASE_URL;
    }
  } catch (e) {
    // Gracefully skip if executed outside of an OpenNext server context
  }

  // 2. Fallback to process.env (Local development fallback)
  if (!connectionString) {
    connectionString = process.env.DATABASE_URL;
  }

  if (!connectionString || connectionString.trim() === "") {
    throw new Error(
      "CRITICAL RUNTIME ERROR: The DATABASE_URL environment string is unresolved. Verify your Cloudflare Dashboard secrets."
    );
  }

  // 3. FIX: Cast neonConfig as any to bypass the missing typing definitions
  (neonConfig as any).fetchHeaders = {
    'Neon-Connection-String': connectionString,
    'Neon-Raw-Text-Output': 'true',
    'Neon-Array-Mode': 'true',
  };

  const adapter = new PrismaNeon({ connectionString });
  internalClientInstance = new PrismaClient({ adapter });
  return internalClientInstance;
}

// Dynamic Proxy ensures client generation remains lazy and safe across threads
export const db = new Proxy({} as PrismaClient, {
  get(_, prop) {
    const targetClient = initializeDatabaseClient();
    const value = Reflect.get(targetClient, prop);
    return typeof value === 'function' ? value.bind(targetClient) : value;
  },
});

export const prisma = db;