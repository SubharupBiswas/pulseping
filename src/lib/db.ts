import 'server-only';
import { PrismaNeonHttp } from '@prisma/adapter-neon';
import { PrismaClient } from '@prisma/client';

// ─────────────────────────────────────────────────────────────────────────────
// Cloudflare Worker Isolate — Stale Connection Error Codes
//
// Cloudflare freezes/thaws isolate contexts between requests. Any TCP or
// WebSocket socket held from a previous lifecycle becomes silently dead.
// PrismaNeonHttp uses stateless HTTPS fetch for every query, so it has no
// persistent TCP pool to go stale. However, if the underlying neon() client
// or PrismaClient itself enters a bad state (e.g. during a Neon cold-start
// timeout or a transient network reset), we detect known error fingerprints
// and retry once with a freshly constructed client.
// ─────────────────────────────────────────────────────────────────────────────

/** Prisma client-level error codes that indicate a stale / broken connection. */
const STALE_CONNECTION_CODES = new Set([
  'P1001', // Can't reach database server
  'P1002', // Timed out reaching database server
  'P1008', // Operations timed out
  'P1017', // Server closed the connection
]);

/** Node.js / OS-level error messages that indicate a dead socket. */
const STALE_SOCKET_MESSAGES = [
  'ECONNRESET',
  'EPIPE',
  'socket hang up',
  'Connection terminated unexpectedly',
  'connection is closed',
];

function isStaleConnectionError(err: unknown): boolean {
  if (!err || typeof err !== 'object') return false;
  const e = err as Record<string, unknown>;

  // Prisma client error with a known connectivity code
  if (typeof e['code'] === 'string' && STALE_CONNECTION_CODES.has(e['code'])) {
    return true;
  }

  // Node/OS-level socket message fingerprint
  const msg = typeof e['message'] === 'string' ? e['message'] : '';
  return STALE_SOCKET_MESSAGES.some(pattern => msg.includes(pattern));
}

// ─────────────────────────────────────────────────────────────────────────────
// Connection String Resolution
//
// Priority order:
//   1. Cloudflare Worker environment bindings (production, via OpenNext context)
//   2. process.env (local development / Next.js dev server)
// ─────────────────────────────────────────────────────────────────────────────

function resolveConnectionString(): string {
  // 1. Try Cloudflare Worker environment bindings first (production edge path)
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { getCloudflareContext } = require('@opennextjs/cloudflare');
    const ctx = getCloudflareContext();
    if (ctx?.env?.DATABASE_URL) {
      return ctx.env.DATABASE_URL as string;
    }
  } catch {
    // Not running inside an OpenNext context — fall through to process.env
  }

  // 2. Fallback: process.env (local dev, Vercel, etc.)
  const envUrl = process.env.DATABASE_URL;
  if (envUrl && envUrl.trim() !== '') {
    return envUrl;
  }

  throw new Error(
    'CRITICAL RUNTIME ERROR: DATABASE_URL is not set. ' +
    'Add it to Cloudflare Dashboard > Settings > Environment Variables.'
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PrismaClient Factory
//
// Uses PrismaNeonHttp — a stateless, fetch-based adapter that issues every
// query as an independent HTTPS request to Neon's /sql endpoint. This is the
// correct pattern for Cloudflare Workers:
//   • No persistent TCP connections that freeze/thaw across isolate lifecycles.
//   • Neon's HTTP transport supports full CRUD and all Prisma query types.
//   • Transactions are not supported in HTTP mode; use sequential queries instead.
// ─────────────────────────────────────────────────────────────────────────────

function createPrismaClient(): PrismaClient {
  const connectionString = resolveConnectionString();
  // PrismaNeonHttp wraps @neondatabase/serverless neon() HTTP client internally.
  // The options arg is required by the type signature; an empty object is valid.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const adapter = new PrismaNeonHttp(connectionString, {} as any);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new PrismaClient({ adapter } as any);
}

// ─────────────────────────────────────────────────────────────────────────────
// Resilient Query Proxy
//
// Wraps every Prisma model method with a one-shot retry on stale-connection
// errors. On first failure, the internal client cache is nullified and a fresh
// PrismaClient is constructed before the retry. A console.warn is emitted so
// Cloudflare tail logs capture the event for observability.
//
// The Proxy is lazy: the PrismaClient is not instantiated until the first
// property access. This makes the module safe to import in client-component
// trees (via server actions) without crashing during static analysis or
// client-side bundle evaluation.
// ─────────────────────────────────────────────────────────────────────────────

let _client: PrismaClient | null = null;

function getClient(): PrismaClient {
  if (!_client) {
    _client = createPrismaClient();
  }
  return _client;
}

function resetClient(): void {
  _client = null;
}

/**
 * Wraps a model method with transparent retry-on-stale-connection logic.
 * Ensures the function is always called with the correct client/model context.
 */
function withRetry(
  getValue: () => unknown,
  prop: string | symbol,
  getContext: () => unknown
): unknown {
  const value = getValue();
  if (typeof value !== 'function') return value;

  return function (this: unknown, ...args: unknown[]) {
    const context = getContext();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = (value as any).apply(context, args);
    if (result && typeof result.then === 'function') {
      return result.catch((err: unknown) => {
        if (isStaleConnectionError(err)) {
          console.warn(
            `[PulsePing/db] Stale connection detected on "${String(prop)}", ` +
            `resetting client and retrying once. Error: ${(err as Error).message}`
          );
          resetClient();
          // Re-resolve the method and context from a fresh client and retry
          const freshContext = getContext();
          const freshValue = getValue();
          if (typeof freshValue === 'function') {
            return (freshValue as (...a: unknown[]) => unknown).apply(freshContext, args);
          }
        }
        throw err;
      });
    }
    return result;
  };
}

/**
 * Recursively wraps object properties of the Prisma client in proxies to ensure
 * that nested model calls (like db.user.findUnique) are fully resilient.
 */
function createResilientProxy<T extends object>(
  target: T,
  getParentClient: () => PrismaClient,
  path: string[] = []
): T {
  return new Proxy(target, {
    get(obj, prop) {
      if (typeof window !== 'undefined') {
        return undefined;
      }

      // Ignore special JS symbols and promise traits
      if (typeof prop === 'symbol' || prop === 'then' || prop === 'toJSON') {
        return Reflect.get(obj, prop);
      }

      const client = getParentClient();
      let currentParent: any = client;
      for (const segment of path) {
        currentParent = currentParent?.[segment];
      }
      const value = Reflect.get(currentParent || obj, prop);

      if (typeof value === 'function') {
        return withRetry(
          () => {
            let retryParent: any = getClient();
            for (const segment of path) {
              retryParent = retryParent?.[segment];
            }
            return Reflect.get(retryParent || obj, prop);
          },
          prop,
          () => {
            let retryParent: any = getClient();
            for (const segment of path) {
              retryParent = retryParent?.[segment];
            }
            return retryParent || obj;
          }
        );
      }

      if (value && typeof value === 'object') {
        return createResilientProxy(value, getParentClient, [...path, prop as string]);
      }

      return value;
    },
  });
}

/**
 * The exported `db` instance is a lazy recursive Proxy. In server environments
 * it transparently delegates to a real PrismaClient. In browser/SSR static-
 * analysis contexts (where resolveConnectionString would throw) the Proxy
 * simply returns undefined for any property access, preventing module-load
 * crashes in client bundles.
 */
export const db = createResilientProxy({} as PrismaClient, getClient);

/** Alias for consumers that prefer the `prisma` name. */
export const prisma = db;