import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
// @ts-ignore
import ws from "ws";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

// On Cloudflare Workers / Edge runtime, set webSocketConstructor to undefined to use HTTP fetch mode (eliminates WebSocket CPU overhead)
if (typeof globalThis.WebSocket !== "undefined") {
  neonConfig.webSocketConstructor = undefined;
} else {
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
    !(connectionString.startsWith("postgres://") || connectionString.startsWith("postgresql://"))
  ) {
    console.error("❌ CRITICAL: DATABASE_URL is missing or invalid in process.env, .env.local, or .env");
    throw new Error(
      `Database Client Initialization Error: Required environment variable DATABASE_URL is missing or invalid.`
    );
  }

  const adapter = new PrismaNeon({ connectionString });
  return new PrismaClient({ adapter });
}

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}

export const prisma = db;
export const loadEnv = ensureEnvLoaded;