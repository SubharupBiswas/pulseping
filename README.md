<p align="center">
  <img src="/public/logo.svg" alt="PulsePing Logo" width="80" height="80" />
  <h1 align="center">PulsePing</h1>
  <p align="center"><b>Production-Grade Serverless Operational Monitoring, AI Root Cause Analysis & Public Status Boards</b></p>
</p>

<p align="center">
  <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js-16.3.0-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js"></a>
  <a href="https://react.dev"><img src="https://img.shields.io/badge/React-19.2.8-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19"></a>
  <a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS"></a>
  <a href="https://prisma.io"><img src="https://img.shields.io/badge/Prisma-7.9.1-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma"></a>
  <a href="https://postgresql.org"><img src="https://img.shields.io/badge/PostgreSQL-Local_TCP-336791?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL"></a>
  <a href="https://typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-5.8.2-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"></a>
</p>

<p align="center">
  <a href="https://pulseping.subharup.com"><b>Live Production Console 🚀</b></a>
</p>

---

## 📌 Executive Summary

**PulsePing** is an enterprise-ready, developer-first uptime and latency tracking SaaS built with **Next.js 16 (Turbopack)**, **Prisma ORM**, and **PostgreSQL (Local TCP Connection Pool)**.

It solves critical production engineering challenges: **monitoring API endpoints in real-time, tracking inverse background job heartbeats, automating multi-provider failure root-cause analysis via AI (Gemini → OmniRoute → Groq waterfall) without exploding API costs, and serving zero-downtime public status boards with sub-second response times.**

---

## 🏛️ System Architecture & Data Flow

```
[ Scheduled Cron / Manual Ping / Inbound Heartbeat ]
                        │
                        ▼
[ Concurrent Worker Pool ] ───(AbortController 10s Guard)───► [ Target Endpoint ]
                        │                                                        │
                        ├─────────────── HTTP Status & Latency Metric ───────────┘
                        ▼
               [ PostgreSQL Datastore ]
                        │
              (HTTP Status != 200)
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
##           3-Tier AI Diagnostic Fallback Waterfall          │
├─────────────────────────────────────────────────────────────┤
│ 1. Check DB Cache: Re-use diagnostic if present (0 calls)  │
│ 2. Enforce 15-Min Cooldown Guard per Endpoint               │
│ 3. Priority 1: Google Gemini API (gemini-2.5-flash)         │
│ 4. Priority 2: OmniRoute AI Gateway                         │
│ 5. Priority 3: Groq API (llama-3.3-70b-versatile)           │
│ 6. Cache diagnostic text directly into Postgres Datastore   │
└─────────────────────────────────────────────────────────────┘
                        │
  ┌─────────────────────┼───────────────────────────────┐
  ▼                     ▼                               ▼
[ Discord / Slack ]    [ Telegram Bot API ]          [ Resend Email API ]
```

---

## 🎯 Key Engineering Highlights & Technical Trade-offs

### 1. 🤖 3-Tier AI Diagnostic Waterfall & Cooldown Engine (Cost & Resilience Optimization)
* **Problem:** Relying on a single LLM provider risks service disruption when API rate limits are hit or unexpected outages occur.
* **Solution:** Engineered a 3-tier resilient AI fallback engine (`Gemini` → `OmniRoute` → `Groq`). If the primary provider fails or rate limits, execution gracefully falls over to secondary and tertiary providers. Diagnostics are cached directly into `pingLog.aiDiagnostic` in PostgreSQL. Subsequent views render cached summaries (**0 extra API calls**). A strict **15-minute per-monitor cooldown guard** prevents redundant LLM evaluations during sustained outages.

### 2. 🛡️ Silent Offline Database Fault Tolerance
* **Problem:** In local development or during transient DB connection blinks, cron ping tickers dump massive error stacktraces into console logs every cycle.
* **Solution:** Implemented explicit connection error catching (`P1001` / `DatabaseNotReachable`) in `/api/cron/ping` and homepage telemetry queries, logging a single clean status line (`⚠️ [PulsePing Cron] Database unreachable (127.0.0.1:5432). Skipping 25s ping cycle.`) and returning HTTP 503 without crashing or polluting logs.

### 3. 📦 Standalone Production Asset Bundling
* **Problem:** Next.js `output: 'standalone'` bundles `.next/standalone` without copying static chunks (`.next/static`) or `public/` assets, leading to unstyled raw HTML and missing 404 assets in isolated container runtimes.
* **Solution:** Engineered `run-standalone.js`, an automated production bootstrapper that syncs `.next/static` and `public/` into `.next/standalone/` before launching `server.js`, guaranteeing 100% styled assets across standalone deployments.

### 4. 💰 Dynamic Pricing, Annual Savings Engine & Promo Codes (`LAUNCH50`)
* **Problem:** Complex billing math across multiple currencies (INR ₹ / USD $) and annual discount calculations can cause discrepancies between frontend pricing tables and checkout orders.
* **Solution:** Synchronized billing calculations across `/pricing` (`PricingClient.tsx`), `/dashboard/billing` (`BillingUpgradeCard.tsx`), and `/api/razorpay/order`. Displays exact monthly rates, calculated total annual charges (Pro: ₹6,708/yr / $84/yr; Business: ₹21,108/yr / $276/yr), and supports real-time promo code validation (`LAUNCH50` for 50% off).

### 5. ⚡ Admin Safe Tier Switcher
* **Problem:** Dev testing requires instantly switching account subscription tiers without creating mock Razorpay orders, but hardcoding admin emails leaks sensitive addresses into git repositories.
* **Solution:** Created `isAdminUser(email)` helper reading strictly from `process.env.ADMIN_EMAILS` (comma-separated). Authorized superusers get an instant `⚡ Dev Switch (Instant)` button on pricing tables to toggle tiers with immediate database sync and toast feedback.

### 6. 💓 Inverse Heartbeat Monitoring (Dead-Man's Switch)
* **Problem:** Traditional active pings check inbound endpoints, but background cron jobs, backup workers, and database sync scripts require reverse monitoring (alerting when a script *fails to run*).
* **Solution:** Built a tokenized heartbeat mechanism (`/api/heartbeat/[token]`). External jobs ping their assigned token endpoint periodically. PulsePing evaluates `frequencySeconds + gracePeriodSeconds`; if an expected ping is missed, an incident alert is dispatched automatically.

### 7. 🌐 Automatic Client-Side Currency & Localization
* **Problem:** Serving global users requires multi-currency pricing (INR ₹ vs USD $), but static server-rendering IP lookups fail behind CDN caches or load balancers.
* **Solution:** Implemented client-side timezone and locale auto-detection using `Intl.DateTimeFormat().resolvedOptions().timeZone` (`Asia/Kolkata`, `Asia/Calcutta`) and `navigator.language` (`en-IN`), persisted seamlessly in `localStorage` (`pulseping_currency`).

---

## 🔌 Operational API Endpoints

The system exposes high-performance REST endpoints under `/api`:

* **`GET /api/cron/ping`**: Executes concurrent endpoint telemetry checks across all active user monitors (supports `x-internal-cron: true` and `x-cron-secret` authorization headers). Probes use browser-like HTTP headers to bypass Cloudflare WAF Super Bot Fight Mode. Automatically logs clean 503 warnings when local DB is offline.
* **`GET /api/health`**: Database connection health check and status reporting.
* **`POST /api/status-pages`**: Creates a new public status board using `getUniqueSlug` for guaranteed collision-free URLs.
* **`PATCH /api/status-pages/[id]`**: Updates status page metadata, visibility, and linked monitor streams.
* **`DELETE /api/status-pages/[id]`**: Removes a public status board.
* **`POST /api/razorpay/order`**: Generates signed Razorpay payment orders for PRO/BUSINESS plan upgrades. Supports promo codes (`LAUNCH50` — 50% off) and resolves amounts from central tier definitions.
* **`POST /api/verify-payment`**: Validates payment HMAC signatures and logs billing `Invoice` records.
* **`POST /api/webhooks/razorpay`**: Asynchronous Razorpay event webhook handler.
* **`POST /api/subscription/cancel`**: Handles subscription tier downgrades back to `FREE`.
* **`GET/POST /api/heartbeat/[token]`**: Inbound ping tracking for cron job and background script heartbeats ("dead-man's switch").
* **`GET/POST /api/relay/[id]` & `/api/relay/replay`**: Inbound webhook payload inspection, validation, and manual replay.
* **`GET/POST /api/alert-channels`**: Manages user notification channels (Discord, Slack, Telegram, Webhook, SMS). Channel availability is enforced per-tier via `TIER_LIMITS.allowedAlertChannels`.
* **`GET /api/telemetry`**: Retrieves monitor latency history and uptime availability percentages.
* **`POST /api/admin/switch-plan`**: Superuser instant plan override endpoint (strictly authorized by `ADMIN_EMAILS` env var).

---

## 🛠️ Tech Stack & Key Technologies

| Layer | Technology | Version | Engineering Rationale |
| :--- | :--- | :--- | :--- |
| **Framework** | **Next.js** | `16.3.0` | React 19 async rendering, App Router, Server Components & Turbopack. |
| **Language** | **TypeScript** | `5.8.2` | End-to-end static type safety across API routes, Prisma schemas & UI components. |
| **Styling** | **Tailwind CSS** | `v4.0` | Zero runtime CSS injection overhead, container queries, dark/light theme switching. |
| **Database** | **PostgreSQL (TCP)** | `pg@latest` | Local TCP PostgreSQL via `pg.Pool` + `@prisma/adapter-pg`. |
| **ORM & Driver** | **Prisma + PrismaPg** | `7.9.1` | Type-safe queries using `@prisma/adapter-pg` over standard TCP connection pool. |
| **Auth** | **Clerk Identity** | `7.6.4` | Edge-compatible middleware session control and OAuth management. |
| **AI Waterfall** | **Gemini → OmniRoute → Groq** | REST API | 3-tier resilient root cause analysis for 4xx/5xx HTTP errors & connection timeouts. |
| **Payments** | **Razorpay** | REST API | Multi-tier subscription billing with promo code support (`LAUNCH50`) and HMAC-SHA256 signature verification. |
| **Deployment** | **Node.js Standalone** | `v24 LTS` | Native standalone process runner with automated static asset syncing. |

---

## 🗄️ Datastore Schema (`prisma/schema.prisma`)

```prisma
datasource db {
  provider = "postgresql"
}

generator client {
  provider      = "prisma-client-js"
  compilerBuild = "small"
}

model User {
  id                           String         @id @default(uuid())
  email                        String         @unique
  plan                         String         @default("FREE") // FREE, PRO, BUSINESS
  alertThreshold               Int            @default(3)
  emailNotificationsEnabled    Boolean        @default(true)
  telegramNotificationsEnabled Boolean        @default(false)
  monitors                     Monitor[]
  heartbeats                   Heartbeat[]
  statusPages                  StatusPage[]
  alertChannels                AlertChannel[]
  invoices                     Invoice[]
}

model Invoice {
  id     String   @id @default(uuid())
  userId String
  date   DateTime @default(now())
  amount String
  status String
  user   User     @relation(fields: [userId], references: [id])

  @@index([userId])
}

model Monitor {
  id               String              @id @default(uuid())
  url              String
  webhookUrl       String?
  discordWebhook   String?
  slackWebhook     String?
  telegramChatId   String?
  alertEmail       String?
  alertOnFailure   Boolean             @default(true)
  frequency        Int                 @default(10)
  isActive         Boolean             @default(true)
  lastChecked      DateTime?
  httpMethod       String              @default("GET")
  customHeaders    Json?
  expectedBodyText String?
  sslExpiresAt     DateTime?

  method           String              @default("GET")
  headers          String?
  body             String?
  keywordCheck     String?
  sslTrack         Boolean             @default(false)
  isHeartbeat      Boolean             @default(false)

  userId          String
  user            User                @relation(fields: [userId], references: [id])
  logs            PingLog[]
  statusPageLinks StatusPageMonitor[]
  alertChannels   AlertChannel[]

  @@index([userId])
  @@index([userId, isActive])
}

model PingLog {
  id           String   @id @default(uuid())
  statusCode   Int
  latency      Int // in milliseconds
  errorBody    String?
  aiDiagnostic String?
  checkedAt    DateTime @default(now())
  monitorId    String
  monitor      Monitor  @relation(fields: [monitorId], references: [id])

  @@index([monitorId, checkedAt])
}

model Heartbeat {
  id                 String    @id @default(uuid())
  token              String    @unique @default(uuid())
  name               String
  frequencySeconds   Int       @default(3600)
  gracePeriodSeconds Int       @default(300)
  lastPingedAt       DateTime?
  isActive           Boolean   @default(true)
  createdAt          DateTime  @default(now())
  userId             String
  user               User      @relation(fields: [userId], references: [id])

  @@index([userId])
}

model StatusPage {
  id        String              @id @default(uuid())
  slug      String              @unique
  title     String
  isPublic  Boolean             @default(true)
  createdAt DateTime            @default(now())
  userId    String
  user      User                @relation(fields: [userId], references: [id])
  monitors  StatusPageMonitor[]

  @@index([userId])
}

model StatusPageMonitor {
  statusPageId String
  monitorId    String
  statusPage   StatusPage @relation(fields: [statusPageId], references: [id], onDelete: Cascade)
  monitor      Monitor    @relation(fields: [monitorId], references: [id], onDelete: Cascade)

  @@id([statusPageId, monitorId])
}

model AlertChannel {
  id               String    @id @default(uuid())
  userId           String
  user             User      @relation(fields: [userId], references: [id])
  providerType     String
  destinationUrl   String
  userFriendlyName String?
  createdAt        DateTime  @default(now())
  monitors         Monitor[]

  @@index([userId])
}
```

---

## 🔑 Environment Variables

Create a `.env.local` file in the root directory:

```env
# Datastore (PostgreSQL via TCP)
DATABASE_URL="postgresql://user:password@127.0.0.1:5432/pulseping"

# Authentication (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."

# AI Diagnostics (3-Tier Waterfall)
GEMINI_API_KEY="AIzaSy..."
OMNIROUTE_API_KEY="or_..."
GROQ_API_KEY="gsk_..."

# Payment Layer (Razorpay)
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_..."
RAZORPAY_KEY_SECRET="your_razorpay_secret"

# Application Base URL
NEXT_PUBLIC_APP_URL="https://pulseping.subharup.com"

# Admin Superuser Privileges
ADMIN_EMAILS="admin@example.com,subharup@example.com"
```

---

## 🚀 Running Locally & Standalone Production Server

### 1. Local Development Setup
```bash
# Install dependencies
npm install

# Generate Prisma client & sync schema
npx prisma generate
npx prisma db push

# Launch hot-reloading dev server
npm run dev
```

### 2. Standalone Production Deployment
```bash
# Build production bundle
npm run build

# Launch standalone server (with auto-synced static assets)
node run-standalone.js
```

### 3. Verification
```bash
npx tsc --noEmit
```

---

## 📄 License

This project is open-source software licensed under the [MIT License](https://opensource.org/licenses/MIT).