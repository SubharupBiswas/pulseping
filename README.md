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
  <a href="https://neon.tech"><img src="https://img.shields.io/badge/Neon_DB-Serverless_Postgres-00E599?style=for-the-badge&logo=postgresql&logoColor=black" alt="Neon Database"></a>
  <a href="https://typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-5.8.2-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"></a>
</p>

<p align="center">
  <a href="https://pulseping.subharup.com"><b>Live Production Console 🚀</b></a>
</p>

---

## 📌 Executive Summary

**PulsePing** is an enterprise-ready, developer-first uptime and latency tracking SaaS built with **Next.js 16 (Turbopack)**, **Prisma ORM**, and **Neon Serverless PostgreSQL**.

It solves critical production engineering challenges: **monitoring API endpoints in real-time, tracking inverse background job heartbeats, automating failure root-cause analysis via AI without exploding API costs, and serving zero-downtime public status boards with sub-second response times.**

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
              [ Neon DB Datastore ]
                        │
              (HTTP Status != 200)
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                   AI Diagnostic Pipeline                    │
├─────────────────────────────────────────────────────────────┤
│ 1. Check DB Cache: Re-use diagnostic if present (0 calls)  │
│ 2. Enforce 15-Min Cooldown Guard per Endpoint               │
│ 3. Evaluate failure log via Google Gemini API               │
│ 4. Cache diagnostic text directly into Neon Postgres       │
└─────────────────────────────────────────────────────────────┘
                        │
  ┌─────────────────────┼───────────────────────────────┐
  ▼                     ▼                               ▼
[ Discord / Slack ]    [ Telegram Bot API ]          [ Resend Email API ]
```

---

## 🎯 Key Engineering Highlights & Technical Trade-offs

### 1. 🤖 AI Quota Guard & DB Caching (Cost Optimization)
* **Problem:** Triggering an LLM (Google Gemini) on every failed ping log rapidly exhausts API rate limits and creates unsustainable operational costs.
* **Solution:** Built a multi-layered caching and cooldown system. Diagnostic evaluations are written directly to `pingLog.aiDiagnostic` in Neon DB. Subsequent page views render cached diagnostics instantly (**0 additional API calls**). A strict **15-minute cooldown guard** per monitor prevents duplicate AI evaluations during sustained outages.

### 2. 📦 Standalone Production Asset Bundling
* **Problem:** Next.js `output: 'standalone'` bundles `.next/standalone` without copying static chunks (`.next/static`) or `public/` assets, leading to unstyled raw HTML and missing 404 assets in isolated container runtimes.
* **Solution:** Engineered `run-standalone.js`, an automated production bootstrapper that syncs `.next/static` and `public/` into `.next/standalone/` before launching `server.js`, guaranteeing 100% styled assets across standalone deployments.

### 3. 🛡️ Collision-Proof Auto-Uniquifying Slug Engine
* **Problem:** Allowing users to create custom status board slugs risks database unique constraint violations (`P2002`) and system crashes on duplicate claims.
* **Solution:** Implemented `getUniqueSlug(baseInput, currentId)`. It converts titles to URL-safe strings and queries Neon DB recursively. On collision, it dynamically appends a 4-character cryptographic hex suffix (e.g. `status-a9f2`), ensuring zero-downtime collision resolution across all user accounts.

### 4. 📄 Client-Side PDF Payment Receipt Engine
* **Problem:** Generating PDF billing receipts on the server consumes heavy Node CPU cycles and adds heavy dependencies like Puppeteer.
* **Solution:** Developed `DownloadInvoiceButton.tsx`, an isolated client component that generates an HTML printable document window pre-configured with vector SVG branding (matching the site's favicon) and triggers `window.print()`, letting the browser natively compile crisp, vector-accurate PDFs.

### 5. 💓 Inverse Heartbeat Monitoring (Dead-Man's Switch)
* **Problem:** Traditional active pings check inbound endpoints, but background cron jobs, backup workers, and database sync scripts require reverse monitoring (alerting when a script *fails to run*).
* **Solution:** Built a tokenized heartbeat mechanism (`/api/heartbeat/[token]`). External jobs ping their assigned token endpoint periodically. PulsePing evaluates `frequencySeconds + gracePeriodSeconds`; if an expected ping is missed, an incident alert is dispatched automatically.

### 6. 🌐 Automatic Client-Side Currency & Localization
* **Problem:** Serving global users requires multi-currency pricing (INR ₹ vs USD $), but static server-rendering IP lookups fail behind CDN caches or load balancers.
* **Solution:** Implemented client-side timezone and locale auto-detection using `Intl.DateTimeFormat().resolvedOptions().timeZone` (`Asia/Kolkata`, `Asia/Calcutta`) and `navigator.language` (`en-IN`), persisted seamlessly in `localStorage` (`pulseping_currency`).

---

## 🔌 Operational API Endpoints

The system exposes high-performance REST endpoints under `/api`:

* **`GET /api/cron/ping`**: Executes concurrent endpoint telemetry checks across all active user monitors (supports `x-internal-cron: true` and `x-cron-secret` authorization headers).
* **`GET /api/health`**: Database connection health check and status reporting.
* **`POST /api/status-pages`**: Creates a new public status board using `getUniqueSlug` for guaranteed collision-free URLs.
* **`PATCH /api/status-pages/[id]`**: Updates status page metadata, visibility, and linked monitor streams.
* **`DELETE /api/status-pages/[id]`**: Removes a public status board.
* **`POST /api/razorpay/order` & `POST /api/create-order`**: Generates signed Razorpay payment orders for PRO/BUSINESS plan upgrades.
* **`POST /api/verify-payment`**: Validates payment HMAC signatures and logs billing `Invoice` records.
* **`POST /api/webhooks/razorpay`**: Asynchronous Razorpay event webhook handler.
* **`POST /api/subscription/cancel`**: Handles subscription tier downgrades back to `FREE`.
* **`GET/POST /api/heartbeat/[token]`**: Inbound ping tracking for cron job and background script heartbeats ("dead-man's switch").
* **`GET/POST /api/relay/[id]` & `/api/relay/replay`**: Inbound webhook payload inspection, validation, and manual replay.
* **`GET/POST /api/alert-channels`**: Manages user notification channels (Discord, Slack, Telegram, Webhook).
* **`GET /api/telemetry`**: Retrieves monitor latency history and uptime availability percentages.

---

## 🛠️ Tech Stack & Key Technologies

| Layer | Technology | Version | Engineering Rationale |
| :--- | :--- | :--- | :--- |
| **Framework** | **Next.js** | `16.3.0` | React 19 async rendering, App Router, Server Components & Turbopack. |
| **Language** | **TypeScript** | `5.8.2` | End-to-end static type safety across API routes, Prisma schemas & UI components. |
| **Styling** | **Tailwind CSS** | `v4.0` | Zero runtime CSS injection overhead, container queries, dark/light theme switching. |
| **Database** | **Neon Postgres** | `1.1.0` | Serverless PostgreSQL with instant autoscaling and connection pooling. |
| **ORM & Driver** | **Prisma & Adapter** | `7.9.1` | Type-safe queries using `@prisma/adapter-neon` and `@prisma/adapter-pg`. |
| **Auth** | **Clerk Identity** | `7.6.4` | Edge-compatible middleware session control and OAuth management. |
| **AI Engine** | **Google Gemini** | REST API | Automated root cause analysis for 4xx/5xx HTTP errors & connection timeouts. |
| **Payments** | **Razorpay** | REST API | Multi-tier subscription billing with cryptographic HMAC-SHA256 signature verification. |
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
  id                        String         @id @default(uuid())
  email                     String         @unique
  plan                      String         @default("FREE") // FREE, HOBBY, DEVELOPER
  alertThreshold            Int            @default(3)
  emailNotificationsEnabled Boolean        @default(true)
  telegramNotificationsEnabled Boolean     @default(false)
  monitors                  Monitor[]
  heartbeats                Heartbeat[]
  statusPages               StatusPage[]
  alertChannels             AlertChannel[]
  invoices                  Invoice[]
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
  webhookUrl       String? // Optional field to store Discord/Slack target endpoints
  discordWebhook   String?
  slackWebhook     String?
  telegramChatId   String?
  alertEmail       String?
  alertOnFailure   Boolean             @default(true)
  frequency        Int                 @default(10)
  isActive         Boolean             @default(true)
  lastChecked      DateTime?
  // Advanced Telemetry (Pillar 1)
  httpMethod       String              @default("GET")
  customHeaders    Json?
  expectedBodyText String?
  sslExpiresAt     DateTime?

  // Expanded Advanced monitoring configurations
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

  // 🟢 Performance Indexes
  @@index([userId])
  @@index([userId, isActive])
}

model PingLog {
  id           String   @id @default(uuid())
  statusCode   Int
  latency      Int // in milliseconds
  errorBody    String? // First 500 chars of error response body (Pillar 4)
  aiDiagnostic String? // AI-generated root-cause summary (Pillar 4)
  checkedAt    DateTime @default(now())
  monitorId    String
  monitor      Monitor  @relation(fields: [monitorId], references: [id])

  // 🟢 Critical Index for Telemetry Graphs
  @@index([monitorId, checkedAt])
}

// Pillar 2: Inverse Heartbeat & Cron Job Tracking
model Heartbeat {
  id                 String    @id @default(uuid())
  token              String    @unique @default(uuid())
  name               String
  frequencySeconds   Int       @default(3600) // Expected ping interval in seconds
  gracePeriodSeconds Int       @default(300) // Extra window before flagging as missed
  lastPingedAt       DateTime?
  isActive           Boolean   @default(true)
  createdAt          DateTime  @default(now())
  userId             String
  user               User      @relation(fields: [userId], references: [id])

  @@index([userId])
}

// Pillar 3: Public Status Pages
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
  providerType     String // e.g. DISCORD, SLACK, WEBHOOK
  destinationUrl   String
  userFriendlyName String?
  createdAt        DateTime  @default(now())
  monitors         Monitor[]

  @@index([userId])
}

model WebhookGuard {
  id         String       @id @default(cuid())
  userId     String
  name       String
  targetUrl  String
  secretHMAC String?
  timeoutMs  Int          @default(4500)
  createdAt  DateTime     @default(now())
  logs       WebhookLog[]

  @@index([userId])
}

model WebhookLog {
  id              String       @id @default(cuid())
  guardId         String
  guard           WebhookGuard @relation(fields: [guardId], references: [id], onDelete: Cascade)
  requestHeaders  Json
  rawBody         Json
  responseStatus  Int
  executionTimeMs Int
  errorMessage    String?
  aiDiagnosis     String?
  isFailure       Boolean      @default(false)
  createdAt       DateTime     @default(now())

  // 🟢 Index for Webhook Diagnostic Logs
  @@index([guardId, createdAt])
}
```

---

## 🛡️ Security, Isolation & Performance Policies

* **Resource-Based & Middleware Auth Protection:** Enforces explicit route protection (`await auth.protect()`) for `/dashboard` paths in both Edge middleware (`src/proxy.ts`) and layout boundaries (`src/app/dashboard/layout.tsx`), while ensuring public marketing pages, health checks (`/api/health`), and automated cron ping probes (`/api/cron/ping`) remain accessible.
* **Server-Only Isolation (`import 'server-only'`):** Datastore modules enforce compilation boundaries to ensure database credentials never leak into client browser JS bundles.
* **Decoupled Client Containers:** Interactive third-party UI primitives are wrapped in hydrated client containers (e.g. `DashboardUserButton`), preserving server-native page-rendering speeds.
* **Type Safety Guarantee:** Enforces zero compilation or lint errors via strict TypeScript checks (`npx tsc --noEmit`).

---

## 🔑 Environment Variables

Create a `.env.local` file in the root directory:

```env
# Datastore (Neon PostgreSQL)
DATABASE_URL="postgresql://user:password@ep-cool-host.neon.tech/neondb?sslmode=require"

# Authentication (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."

# AI Root Cause Analysis (Google Gemini)
GEMINI_API_KEY="AIzaSy..."

# Payment Layer (Razorpay)
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_..."
RAZORPAY_KEY_SECRET="your_razorpay_secret"

# Application Base URL
NEXT_PUBLIC_APP_URL="https://pulseping.subharup.com"
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