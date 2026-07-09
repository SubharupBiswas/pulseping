import 'server-only';
import { neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '@prisma/client';

let internalClientInstance: PrismaClient | undefined;

/**
 * Lazily evaluates environment variables and prepares the Prisma instance
 * exclusively inside request execution contexts when a query is fired.
 */
function initializeDatabaseClient(): PrismaClient {
  if (internalClientInstance) return internalClientInstance;

  const connectionString = process.env.DATABASE_URL;

  if (!connectionString || connectionString.trim() === "") {
    throw new Error(
      "CRITICAL RUNTIME ERROR: The DATABASE_URL environment variable is unresolved inside this execution context. Check your Cloudflare Dashboard configuration variables."
    );
  }

  // Bind serverless engine telemetry flags
  (neonConfig as any).fetchHeaders = {
    'Neon-Connection-String': connectionString,
    'Neon-Raw-Text-Output': 'true',
    'Neon-Array-Mode': 'true',
  };

  const adapter = new PrismaNeon({ connectionString });
  internalClientInstance = new PrismaClient({ adapter });
  return internalClientInstance;
}

// Export a dynamic Proxy instance. This mirrors the PrismaClient API 
// perfectly but delays execution until a data method is invoked.
export const db = new Proxy({} as PrismaClient, {
  get(_, prop) {
    const targetClient = initializeDatabaseClient();
    const value = Reflect.get(targetClient, prop);
    return typeof value === 'function' ? value.bind(targetClient) : value;
  },
});

export const prisma = db;