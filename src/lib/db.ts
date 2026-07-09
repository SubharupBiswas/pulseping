import 'server-only';
import { neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '@prisma/client';
// @ts-ignore
import ws from 'ws';

// 1. Assign the native Node.js WebSocket constructor safely for server environments
(neonConfig as any).webSocketConstructor = ws;

const connectionString = process.env.DATABASE_URL;

if (!connectionString || connectionString.trim() === "") {
  throw new Error("CRITICAL RUNTIME ERROR: The DATABASE_URL environment variable is empty or unresolved.");
}

// 2. Natively enforce metadata routing signatures directly into the serverless engine
(neonConfig as any).fetchHeaders = {
  'Neon-Connection-String': connectionString,
  'Neon-Raw-Text-Output': 'true',
  'Neon-Array-Mode': 'true',
};

// 3. Prisma 7 Native Adapter Setup: Clean and cross-runtime compliant
const adapter = new PrismaNeon({ connectionString });

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ adapter });

export const db = prisma;

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;