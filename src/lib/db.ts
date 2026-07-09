import 'server-only';
import { loadEnvConfig } from '@next/env';
import { neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '@prisma/client';
// @ts-ignore
import ws from 'ws';

// 1. Force immediate environment variable population inside thread runtime contexts
if (typeof window === 'undefined') {
  loadEnvConfig(process.cwd());
}

// 2. Assign the native Node.js WebSocket constructor for server runtime cycles
(neonConfig as any).webSocketConstructor = ws;

const connectionString = process.env.DATABASE_URL;

if (!connectionString || connectionString.trim() === "") {
  throw new Error("CRITICAL RUNTIME ERROR: The DATABASE_URL environment variable is empty or unresolved.");
}

// 3. Natively enforce the metadata routing signatures directly into the serverless engine
(neonConfig as any).fetchHeaders = {
  'Neon-Connection-String': connectionString,
  'Neon-Raw-Text-Output': 'true',
  'Neon-Array-Mode': 'true',
};

// 4. Prisma 7 Native Adapter Setup: Pass the configuration payload directly.
//    This layout allows Prisma to bind the connection string context internally,
//    preventing environmental variable drops under Next.js Turbopack.
const adapter = new PrismaNeon({ connectionString });

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ adapter });

export const db = prisma;

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;