import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool } from "@neondatabase/serverless";

declare global {
  var prisma: PrismaClient | undefined;
}

const createEdgeClient = () => {
  // Enforce strict pool bounds and quick idle timeouts to prevent V8 socket leaks
  const pool = new Pool({ 
    connectionString: process.env.DATABASE_URL,
    idleTimeoutMillis: 2000, 
    max: 10
  });
  const adapter = new PrismaNeon(pool as any);
  return new PrismaClient({ adapter } as any);
};

// Force production isolates to maintain a single context thread while keeping local hot-reloads stable
export const prisma = process.env.NODE_ENV === "production"
  ? createEdgeClient()
  : (globalThis.prisma ??= createEdgeClient());

export const db = prisma;