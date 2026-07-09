<p align="center">
  <img src="/public/logo.svg" alt="PulsePing Logo" width="80" height="80" />
  <h1 align="center">PulsePing</h1>
  <p align="center"><b>Production-Grade Serverless Edge-Native Uptime & Latency Telemetry Platform</b></p>
</p>

<p align="center">
  <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js-16.2.6-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" /></a>
  <a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" /></a>
  <a href="https://pages.cloudflare.com"><img src="https://img.shields.io/badge/Cloudflare_Pages-F38020?style=for-the-badge&logo=cloudflare&logoColor=white" alt="Cloudflare" /></a>
  <a href="https://prisma.io"><img src="https://img.shields.io/badge/Prisma-7.8.0-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" /></a>
</p>

<p align="center">
  <a href="https://pulseping.subnetmask.tech"><b>Live Console Deployment →</b></a>
</p>

---

PulsePing is an enterprise-grade, developer-first uptime and latency tracking SaaS engineered to run completely at the V8 Edge Runtime with zero traditional server overhead. Deployed on Cloudflare’s global edge network via Pages and Workers, the platform processes real-time endpoint latency telemetry, manages secure sessions, tracks service level agreements (SLAs), and dispatches concurrent alerts to keep developers ahead of production downtime.

By leveraging serverless adapters and non-blocking asynchronous execution layers, PulsePing provides sub-millisecond dispatch speeds and removes the maintenance, patching, and resource constraints of typical VM-based monitoring setups.

---

## ⚡ Flagship Capabilities & Features

### ⏱️ High-Speed Concurrent Telemetry Engine
* **Concurrent Ping Multiplexing:** Utilizes a non-blocking asynchronous worker pool (`Promise.allSettled`) inside the edge runtime to fetch statuses of all active monitors concurrently, preventing single-slow-endpoint delays from throttling other checks.
* **Defensive Abort Guards:** Enforces a strict 5-second connection abort timeout via `AbortController` to isolate hanging nodes and identify unresponsive target hosts.
* **Granular Log Archival:** Captures precise latency metrics via high-resolution timers (`performance.now()`) and stores HTTP resolution states directly in the datastore.

### 🔔 Non-Blocking Multi-Channel Alert Router Engine
When an endpoint failure state is detected (unhealthy HTTP status codes $< 200$, $\ge 300$, or connection/timeout errors), PulsePing evaluates the target configuration and fires alerts concurrently through independent micro-engines:
* **Discord Webhook Channel:** Dispatches rich markdown embed cards containing target URLs, HTTP resolution states, latency markers, and timestamps.
* **Slack Integration:** Posts clean, block-structured Slack JSON payloads to user-configured channel webhooks.
* **Telegram Bot Channel:** Sends text alert telemetry strings via the Telegram Bot API to defined chat IDs.
* **Resend Email Dispatcher:** Automatically sends responsive, dark-themed HTML/CSS email reports from `alerts@pulseping.subnetmask.tech` using the serverless-ready `resend` client library.

---

## ⚙️ Core Technical Stack

* **Frontend Framework:** Next.js 16.2.6 App Router running natively on the high-performance **Turbopack** compilation engine, featuring React 19 asynchronous layouts.
* **Styling & UI:** Tailwind CSS v4.0 for optimized component styling, container queries, and fast CSS transitions.
* **Database & ORM:** Prisma ORM v7.8.0 integrated with a global PostgreSQL database using the modernized, zero-pool abstraction contract from `@neondatabase/serverless` and `@prisma/adapter-neon` for execution inside V8 edge workers.
* **Authentication:** Clerk Global Identity Provider using edge-compatible middleware session control.
* **Payment Layer:** Razorpay checkout order generation and cryptographic HMAC-SHA256 signature verification supporting cross-currency multi-tier switches (INR/USD).

---

## 🛡️ Production Hardening & Security Release Policies

* **Server-Only Architectural Isolation:** Employs a strict compilation guard hook (`import 'server-only'`) inside the core datastore instance (`src/lib/db.ts`) to halt build trees immediately if core secrets or internal database modules leak into the browser bundle graph.
* **Interactive Client Component Decoupling:** Extracts interactive third-party provider hydration structures (e.g., Clerk's subcomponent submenus) into dedicated, hydrated client containers (`DashboardUserButton`), keeping critical data-fetching page views entirely server-native.
* **Turbopack Build Assembly Alignment:** Configured with an explicit empty `turbopack: {}` option mapping inside `next.config.ts` to satisfy Next.js 16's default production builder requirements during parallel OpenNext asset compilation pipelines.
* **Prisma WASM Optimization:** Configured with `compilerBuild = "small"` to shrink compiled WASM bundles from 3.67MB to 1.85MB, satisfying Cloudflare Pages memory constraints.
* **Global Scope Sanitization:** Integrates a custom build wrapper (`scripts/cloudflare-build.js`) that injects a global safety boundary (`globalThis.e = undefined;`) to block variable collisions during Next.js asset minification.
* **Cache Mesh Routing:** Maps static directories (`/_next/static/*`) and static files (`/logo.svg`, `/robots.txt`) directly to the CDN edge cache via `_routes.json` settings, decreasing First Contentful Paint times and conserving execution CPU cycles.

---

## 🚀 Local Development Setup

### 1. Installation
Clone the repository and install the development dependencies:
```bash
npm install
```

### 2. Database Generation
Generate the local Prisma Client typings and push the database schema:
```bash
npx prisma generate
npx prisma db push
```

### 3. Environment Configuration
Create a `.env` file at the root of the workspace directory. Populate it with the required structure:
```env
# Primary Serverless PostgreSQL Connection String
DATABASE_URL="postgresql://[user]:[password]@[host]/[database]?sslmode=require"

# Clerk Authentication Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."

# Razorpay API Credentials
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_..."
RAZORPAY_KEY_SECRET="secret_..."

# Telemetry Cron Validation Passphrase
CRON_SECRET="your-secure-cron-passphrase-here"

# Security Verification & Analytics
NEXT_PUBLIC_GA_ID="G-..."
NEXT_PUBLIC_TURNSTILE_SITE_KEY="0x..."

# Notification Channel APIs
TELEGRAM_BOT_TOKEN="bot_token_here"
RESEND_API_KEY="re_..."
```

### 4. Running the Development Server
Start the local hot-reloading server:
```bash
npm run dev
```

### 5. Production Compilation Test
Simulate Next.js compilation and bundle workers:
```bash
npx tsc --noEmit
```

---

## 📄 License

This project is open-source software licensed under the [MIT License](https://opensource.org/licenses/MIT).
