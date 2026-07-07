# 🛰️ PulsePing - Serverless Edge-Native Uptime Monitoring SaaS

PulsePing is a developer-first, edge-native uptime monitoring platform engineered to run with zero infrastructure overhead. Operating directly on Cloudflare’s global edge network via Pages and Workers, the platform processes real-time endpoint latency telemetry, manages secure workspace sessions, validates service-level performance agreements (SLAs), and dispatches transaction alerts. By leveraging serverless architectures, PulsePing eliminates traditional VM maintenance costs while maintaining millisecond-level precision in uptime diagnostics.

## ⚡ Architecture & Core Capabilities

- **Edge Worker Runtime Execution:** The entire Next.js application bundle is compiled into an optimized worker format via the OpenNext adapter, aligning with Cloudflare Pages requirements to ensure global routing, sub-millisecond edge invocation times, and native cold-start elimination.
- **Serverless Polling Engine:** An automated edge cron pipeline (`/api/cron/ping`) triggers automated requests across active monitor streams. Using non-blocking, asynchronous task multiplexing with `Promise.all` and precise `performance.now()` telemetry, it runs health handshakes and logs latency updates directly at the edge.
- **Payment & Tiered Monetization:** Incorporates a robust Razorpay checkout integration (`/api/create-order` and `/api/verify-payment`) matching payment verification signatures locally using HMAC-SHA256 digests. Validated transaction payloads automatically transition accounts into paid subscription tiers (FREE, PRO, BUSINESS) inside the PostgreSQL datastore.
- **Discord Alert Integration:** A custom alerting pipeline triggers on validation failure states (HTTP status >= 500 or timeout connection errors). The edge runtime formats a rich embed payload detailing target address coordinates, status codes, and round-trip delay times, dispatching it to user-configured Discord webhook endpoints instantly.

## 🛠️ Production Tech Stack

| Dependency / Tool | Version | Architectural Role |
| :--- | :--- | :--- |
| **Next.js** | `15.3.4` | Edge-optimized full-stack framework with React 19 server & client hooks |
| **Tailwind CSS** | `4.x` | Compiler-optimized Utility-First styling system with modern custom-variant support |
| **Prisma Client** | `7.8.0` | ORM interface supporting serverless PostgreSQL connections |
| **PostgreSQL / Neon** | `*` | Primary serverless datastore with connection pool pooling capabilities |
| **Clerk Auth** | `^7.5.13` | Federated identity provider with edge-compatible middleware session control |
| **Razorpay API** | `*` | Secure checkout order generation and cryptographic payment validation |
| **Wrangler** | `*` | Developer CLI to compile, preview, and deploy workers to Cloudflare |

## ⚙️ Advanced Performance Engineering & Hardening

- **Binary Module Compression:** To bypass Cloudflare's strict maximum memory footprint thresholds for edge workers, the Prisma generator is configured with `compilerBuild = "small"`. This flag optimizes client generation by stripping unused native engines and metadata, shrinking the compiled WASM package from 3.67MB down to 1.85MB to guarantee safe execution.
- **Scope Safety Isolation Injection:** To address minification-induced variable collisions in edge production runtimes, the custom [scripts/cloudflare-build.js](file:///Users/subharup/Developer/pulseping/scripts/cloudflare-build.js) pipeline programmatically injects a global safety boundary (`globalThis.e = undefined;`) at the top of the compiled worker bundle. This sanitizes the global scope and prevents runtime `ReferenceError` crashes.
- **CDN Edge Asset Mapping:** A custom [_routes.json](file:///Users/subharup/Developer/pulseping/scripts/cloudflare-build.js#L20-L34) fallback generator maps assets to the edge network CDN. Explicitly routing static directory calls (`/_next/static/*`) and system items (`/favicon.ico`, `/robots.txt`) directly through the Cloudflare cache mesh significantly decreases core web vitals first-contentful paint (FCP) times and saves serverless compute CPU-cycles.

## 🚀 Local Development Setup

### 1. Prerequisites
Ensure you have Node.js 18+, PostgreSQL (or a Neon serverless instance), and npm installed.

### 2. Installation
Clone the repository and install dependencies:
```bash
npm install
```

### 3. Database Migration
Apply the database schema using Prisma:
```bash
npx prisma db push
```

### 4. Configuration
Create a `.env` file at the root of the workspace and configure the following environment keys:
```env
# Database Credentials
DATABASE_URL="postgresql://[username]:[password]@[host]/[database]?sslmode=require"

# Clerk Authentication Details
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."

# Razorpay Checkout Credentials
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_..."
RAZORPAY_KEY_SECRET="secret_..."

# Cron Handshake Authentication Token
CRON_SECRET="your_cron_passphrase_here"

# Google Analytics Identifier
NEXT_PUBLIC_GA_ID="G-..."

# Turnstile Security Key
NEXT_PUBLIC_TURNSTILE_SITE_KEY="0x..."
```

### 5. Launch local environment
Run the local Next.js development server:
```bash
npm run dev
```

### 6. Build compilation validation
To test and validate the production edge assets compilation sequence:
```bash
npm run cloudflare-deploy
```

## 📄 License

This project is open-source software licensed under the [MIT License](https://opensource.org/licenses/MIT).
