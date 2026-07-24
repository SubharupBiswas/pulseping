import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
// @ts-ignore
import ws from "ws";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

// Bind ws to neonConfig for Node.js server environments
if (typeof window === "undefined") {
  neonConfig.webSocketConstructor = ws;
}

export function ensureEnvLoaded() {
  if (process.env.DATABASE_URL && process.env.DATABASE_URL.trim() !== "") {
    return;
  }

  const cwd = process.cwd();
  const candidateDirs = [
    cwd,
    path.resolve(cwd, ".."),
    path.resolve(cwd, "../.."),
    path.resolve(__dirname, ".."),
    path.resolve(__dirname, "../.."),
    path.resolve(__dirname, "../../.."),
  ];

  for (const dir of candidateDirs) {
    const envStandard = path.resolve(dir, ".env");
    const envLocal = path.resolve(dir, ".env.local");

    if (fs.existsSync(envStandard)) {
      dotenv.config({ path: envStandard, override: true });
    }
    if (fs.existsSync(envLocal)) {
      dotenv.config({ path: envLocal, override: true });
    }

    if (process.env.DATABASE_URL && process.env.DATABASE_URL.trim() !== "") {
      break;
    }
  }
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

function getPrismaClient(): PrismaClient {
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma;
  }

  ensureEnvLoaded();
  const connectionString = process.env.DATABASE_URL;

  if (
    !connectionString ||
    connectionString.trim() === "" ||
    connectionString === "undefined" ||
    connectionString === "null" ||
    !(connectionString.startsWith("postgres://") || connectionString.startsWith("postgresql://"))
  ) {
    console.error("❌ CRITICAL: DATABASE_URL is missing or invalid in process.env, .env.local, or .env");
    throw new Error(
      `Database Client Initialization Error: Required environment variable DATABASE_URL is missing, uninitialized, or invalid. ` +
      `Ensure DATABASE_URL is configured with a valid postgresql:// connection string. Received: "${connectionString}"`
    );
  }

  const adapter = new PrismaNeon({ connectionString });
  const client = new PrismaClient({ adapter });

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = client;
  }

  return client;
}

// Lazy Proxy: Defer PrismaClient & Pool creation until the first DB query
export const db = new Proxy({} as PrismaClient, {
  get(_target, prop: keyof PrismaClient) {
    const client = getPrismaClient();
    const value = client[prop];
    return typeof value === "function" ? (value as Function).bind(client) : value;
  },
});

export const prisma = db;
export const loadEnv = ensureEnvLoaded;