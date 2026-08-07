import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Resend } from "resend";
import * as https from "https";
import { generateIncidentDiagnostic } from "@/lib/ai";

// Switch to Node.js runtime to enable TLS certificate introspection
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const getFrequencyMs = (plan?: string, configuredFrequency?: number) => {
  const tier = (plan || "FREE").toUpperCase();
  if (tier === "BUSINESS") return 25 * 1000; // 25s threshold (5s buffer for 30s stream polling)
  if (tier === "PRO") return 55 * 1000; // 55s threshold (5s buffer for 60s stream polling)
  return 9.5 * 60 * 1000; // 9.5 min threshold (30s buffer for 10-min free polling)
};

// ── SSL Certificate Expiry Probe ──────────────────────────────────────────────
// Uses Node.js native https module to extract TLS certificate validity date.
function getSslExpiry(url: string): Promise<Date | null> {
  return new Promise((resolve) => {
    try {
      const parsed = new URL(url);
      if (parsed.protocol !== "https:") return resolve(null);

      const req = https.request(
        {
          host: parsed.hostname,
          port: parsed.port ? parseInt(parsed.port) : 443,
          method: "HEAD",
          path: "/",
          rejectUnauthorized: false, // allow expired certs — we're just reading the date
        },
        (res) => {
          const cert = (res.socket as any).getPeerCertificate?.();
          if (cert?.valid_to) {
            resolve(new Date(cert.valid_to));
          } else {
            resolve(null);
          }
          res.resume(); // drain socket
        }
      );
      req.setTimeout(4000, () => { req.destroy(); resolve(null); });
      req.on("error", () => resolve(null));
      req.end();
    } catch {
      resolve(null);
    }
  });
}

// ── Safe Error String Parser ──────────────────────────────────────────────────
const parseErrorMessage = (err: unknown): string => {
  if (err instanceof Error) return err.message;
  if (typeof err === "object" && err !== null && "type" in err) {
    return `Network/Socket error event: ${String((err as any).type)}`;
  }
  return String(err);
};

// ── Core Monitor Check ────────────────────────────────────────────────────────
async function checkMonitor(monitor: any) {
  try {
    const startTime = performance.now();
    let statusCode = 500;
    let latency = 0;
    let connectionError = false;
    let errorBody: string | null = null;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    // Build full browser-like headers to bypass Cloudflare WAF / Super Bot Fight Mode
    const defaultHeaders: Record<string, string> = {
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 PulsePingBot/1.0",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
      "Cache-Control": "no-cache",
      "Pragma": "no-cache",
      "Sec-Ch-Ua": '"Not-A.Brand";v="99", "Chromium";v="124", "Google Chrome";v="124"',
      "Sec-Ch-Ua-Mobile": "?0",
      "Sec-Ch-Ua-Platform": '"macOS"',
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "none",
      "Sec-Fetch-User": "?1",
      "Upgrade-Insecure-Requests": "1",
    };

    // Merge user-defined custom headers on top of defaults
    const parsedCustomHeaders: Record<string, string> = {};
    if (monitor.customHeaders && typeof monitor.customHeaders === "object") {
      for (const [k, v] of Object.entries(monitor.customHeaders)) {
        if (typeof k === "string" && typeof v === "string") {
          parsedCustomHeaders[k] = v;
        }
      }
    }
    const builtHeaders = { ...defaultHeaders, ...parsedCustomHeaders };

    const httpMethod: string = (monitor.httpMethod || "GET").toUpperCase();
    let responseText: string | null = null;

    try {
      const response = await fetch(monitor.url, {
        method: httpMethod,
        cache: "no-store",
        signal: controller.signal,
        headers: builtHeaders,
      });
      statusCode = response.status;
      latency = Math.round(performance.now() - startTime);

      // Content matching — only read body for non-HEAD requests
      if (httpMethod !== "HEAD") {
        try {
          responseText = await response.text();
        } catch {
          responseText = null;
        }
      }

      // Content match validation
      if (
        monitor.expectedBodyText &&
        typeof monitor.expectedBodyText === "string" &&
        monitor.expectedBodyText.trim() !== ""
      ) {
        if (!responseText || !responseText.includes(monitor.expectedBodyText)) {
          // Content mismatch: override status to 0 to trigger alert
          statusCode = 0;
          connectionError = true;
          errorBody = `Content Mismatch Failure: Expected "${monitor.expectedBodyText}" not found in response body.`;
        }
      }

      // Capture error body when status is not 2xx
      if (!connectionError && (statusCode < 200 || statusCode >= 300)) {
        errorBody = responseText ? responseText.slice(0, 500) : null;
      }
    } catch (fetchError: unknown) {
      connectionError = true;
      statusCode = 0;
      latency = Math.round(performance.now() - startTime);
      const parsedErr = parseErrorMessage(fetchError);
      errorBody = parsedErr ? parsedErr.slice(0, 500) : "Network connection failure";
    } finally {
      clearTimeout(timeoutId);
    }

  // ── SSL Expiry Probe (async, non-blocking) ────────────────────────────────
  let sslExpiresAt: Date | null = null;
  if (monitor.url.startsWith("https://")) {
    sslExpiresAt = await getSslExpiry(monitor.url);
  }

  const isFailure = statusCode < 200 || statusCode >= 300 || statusCode === 0;

  // ── AI Credit Protection Guard (Skip 403 WAF blocks & only trigger on UP -> DOWN transition) ──
  let aiDiagnostic: string | null = null;
  const isWafBlock = statusCode === 403;

  if (isFailure && errorBody && !isWafBlock) {
    let wasPreviousPingHealthy = true;
    if (Array.isArray(monitor.logs) && monitor.logs.length > 0) {
      const prevStatusCode = monitor.logs[0].statusCode;
      wasPreviousPingHealthy = prevStatusCode >= 200 && prevStatusCode < 300;
    } else {
      try {
        const lastLog = await db.pingLog.findFirst({
          where: { monitorId: monitor.id },
          orderBy: { checkedAt: "desc" },
          select: { statusCode: true },
        });
        if (lastLog) {
          wasPreviousPingHealthy = lastLog.statusCode >= 200 && lastLog.statusCode < 300;
        }
      } catch (err) {
        wasPreviousPingHealthy = true;
      }
    }

    if (wasPreviousPingHealthy) {
      aiDiagnostic = await generateIncidentDiagnostic(monitor.url, statusCode, errorBody);
    }
  }

  // ── Database Writes ───────────────────────────────────────────────────────
  try {
    await db.pingLog.create({
      data: {
        monitorId: monitor.id,
        statusCode,
        latency,
        errorBody: errorBody ?? null,
        aiDiagnostic: aiDiagnostic ?? null,
      } as any,
    });

    const updateData: any = { lastChecked: new Date() };
    if (sslExpiresAt) updateData.sslExpiresAt = sslExpiresAt;

    await db.monitor.update({
      where: { id: monitor.id },
      data: updateData,
    });
  } catch (dbError) {
    console.error(`Database log/update failed for monitor ${monitor.id}:`, dbError);
  }

  // ── Alert Dispatch ────────────────────────────────────────────────────────
  if (isFailure && monitor.alertOnFailure !== false) {
    const alertPromises: Promise<any>[] = [];

    // Query user's relational alert channels
    let alertChannels: any[] = [];
    try {
      alertChannels = await (db as any).alertChannel.findMany({
        where: { userId: monitor.userId },
      });
    } catch (dbErr) {
      console.error("Failed to query relational alert channels:", dbErr);
    }

    // Dynamic relational dispatcher loop
    alertChannels.forEach((channel) => {
      const p = (async () => {
        try {
          const type = (channel.providerType || "").toUpperCase();
          const dest = channel.destinationUrl;
          if (!dest) return;

          if (type === "DISCORD") {
            const diagnosticField = aiDiagnostic
              ? [{ name: "AI Root-Cause Diagnosis", value: aiDiagnostic, inline: false }]
              : [];
            await fetch(dest, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                username: "PulsePing Bot",
                embeds: [{
                  title: "🚨 INCIDENT DETECTED: Endpoint Offline",
                  description: "The monitoring engine failed to receive a healthy response.",
                  color: 15548997,
                  fields: [
                    { name: "Target URL", value: `\`${monitor.url}\``, inline: false },
                    { name: "HTTP Code", value: `🔴 ${statusCode}`, inline: true },
                    { name: "Latency", value: `${latency}ms`, inline: true },
                    ...diagnosticField,
                  ],
                  timestamp: new Date().toISOString(),
                  footer: { text: "PulsePing Automated AlertChannel Dispatcher" },
                }],
              }),
            });
          } else if (type === "SLACK") {
            const diagnosticText = aiDiagnostic ? `\n*AI Diagnosis:* ${aiDiagnostic}` : "";
            await fetch(dest, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                blocks: [
                  { type: "header", text: { type: "plain_text", text: "🚨 PulsePing Incident Detected", emoji: true } },
                  { type: "section", text: { type: "mrkdwn", text: `*Target URL:* \`${monitor.url}\`\n*HTTP Code:* 🔴 ${statusCode}\n*Latency:* ${latency}ms${diagnosticText}` } },
                  { type: "context", elements: [{ type: "mrkdwn", text: "PulsePing Automated AlertChannel Dispatcher" }] },
                ],
              }),
            });
          } else if (type === "WEBHOOK") {
            await fetch(dest, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                event: "monitor.failure",
                monitorId: monitor.id,
                url: monitor.url,
                statusCode,
                latency,
                checkedAt: new Date().toISOString(),
                aiDiagnostic,
                errorBody,
              }),
            });
          } else if (type === "EMAIL") {
            if (process.env.RESEND_API_KEY) {
              const resend = new Resend(process.env.RESEND_API_KEY);
              const diagnosticRow = aiDiagnostic
                ? `<div><div class="stat-label">AI Diagnosis</div><div class="stat-value" style="color:#f59e0b;font-size:14px;">${aiDiagnostic}</div></div>`
                : "";
              const htmlContent = `<!DOCTYPE html><html><head><style>
                body{background:#0a0a0a;color:#fff;font-family:sans-serif;padding:24px;margin:0}
                .container{max-width:600px;margin:0 auto;background:#121212;border:1px solid #222;border-radius:12px;padding:32px}
                h1{color:#f43f5e;font-size:24px;margin-top:0}
                p{color:#a3a3a3;font-size:16px;line-height:1.5}
                .stat-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin:24px 0;border-top:1px solid #222;border-bottom:1px solid #222;padding:16px 0}
                .stat-label{font-size:12px;text-transform:uppercase;color:#737373;font-weight:bold}
                .stat-value{font-size:18px;color:#f5f5f5;font-weight:600;margin-top:4px;word-break:break-all}
                .footer{font-size:12px;color:#525252;margin-top:32px;border-top:1px solid #222;padding-top:16px;text-align:center}
              </style></head><body><div class="container">
                <h1>🚨 Incident Detected</h1>
                <p>Your target endpoint is offline.</p>
                <div class="stat-grid">
                  <div><div class="stat-label">Target URL</div><div class="stat-value">${monitor.url}</div></div>
                  <div><div class="stat-label">Resolution Code</div><div class="stat-value" style="color:#f43f5e">${statusCode}</div></div>
                  <div><div class="stat-label">Response Latency</div><div class="stat-value">${latency}ms</div></div>
                  <div><div class="stat-label">Timestamp (UTC)</div><div class="stat-value">${new Date().toISOString()}</div></div>
                  ${diagnosticRow}
                </div>
                <p class="footer">PulsePing Automated AlertChannel Dispatcher</p>
              </div></body></html>`;

              await resend.emails.send({
                from: "PulsePing Alerts <alerts@subharup.com>",
                to: dest,
                subject: `[PulsePing] Target Offline: ${monitor.url}`,
                html: htmlContent,
              });
            }
          }
        } catch (dispatchErr) {
          console.error(`AlertChannel dispatch error for channel ${channel.id}:`, dispatchErr);
        }
      })();
      alertPromises.push(p);
    });

    // 1. Telegram
    if (monitor.telegramChatId) {
      if (!process.env.TELEGRAM_BOT_TOKEN) {
        console.warn(`Telegram alert skipped for monitor ${monitor.id}: TELEGRAM_BOT_TOKEN missing.`);
      } else {
        const diagnosticLine = aiDiagnostic ? `\n\n🤖 AI Diagnosis: ${aiDiagnostic}` : "";
        const text = `🚨 PulsePing Alert: Target Endpoint Offline\n\nTarget URL: ${monitor.url}\nHTTP Code: ${statusCode}\nLatency: ${latency}ms\nChecked At: ${new Date().toISOString()}${diagnosticLine}`;
        alertPromises.push(
          fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chat_id: monitor.telegramChatId, text }),
          }).catch((e) => console.error("Telegram alert failure:", e))
        );
      }
    }

    // 2. Slack
    if (monitor.slackWebhook) {
      const diagnosticText = aiDiagnostic ? `\n*AI Diagnosis:* ${aiDiagnostic}` : "";
      alertPromises.push(
        fetch(monitor.slackWebhook, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            blocks: [
              { type: "header", text: { type: "plain_text", text: "🚨 PulsePing Incident Detected", emoji: true } },
              { type: "section", text: { type: "mrkdwn", text: `*Target URL:* \`${monitor.url}\`\n*HTTP Code:* 🔴 ${statusCode}\n*Latency:* ${latency}ms${diagnosticText}` } },
              { type: "context", elements: [{ type: "mrkdwn", text: "PulsePing Automated Production Core Alerts Engine" }] },
            ],
          }),
        }).catch((e) => console.error("Slack alert failure:", e))
      );
    }

    // 3. Discord
    const targetDiscordWebhook = monitor.discordWebhook || monitor.webhookUrl;
    if (targetDiscordWebhook) {
      const diagnosticField = aiDiagnostic
        ? [{ name: "AI Root-Cause Diagnosis", value: aiDiagnostic, inline: false }]
        : [];
      alertPromises.push(
        fetch(targetDiscordWebhook, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: "PulsePing Bot",
            embeds: [{
              title: "🚨 INCIDENT DETECTED: Endpoint Offline",
              description: "The monitoring engine failed to receive a healthy response.",
              color: 15548997,
              fields: [
                { name: "Target URL", value: `\`${monitor.url}\``, inline: false },
                { name: "HTTP Code", value: `🔴 ${statusCode}`, inline: true },
                { name: "Latency", value: `${latency}ms`, inline: true },
                ...diagnosticField,
              ],
              timestamp: new Date().toISOString(),
              footer: { text: "PulsePing Automated Production Core Alerts Engine" },
            }],
          }),
        }).catch((e) => console.error("Discord alert failure:", e))
      );
    }

    // 4. Resend Email
    if (monitor.alertEmail) {
      if (!process.env.RESEND_API_KEY) {
        console.warn(`Resend email skipped for monitor ${monitor.id}: RESEND_API_KEY missing.`);
      } else {
        const resend = new Resend(process.env.RESEND_API_KEY);
        const diagnosticRow = aiDiagnostic
          ? `<div><div class="stat-label">AI Diagnosis</div><div class="stat-value" style="color:#f59e0b;font-size:14px;">${aiDiagnostic}</div></div>`
          : "";
        const htmlContent = `<!DOCTYPE html><html><head><style>
          body{background:#0a0a0a;color:#fff;font-family:sans-serif;padding:24px;margin:0}
          .container{max-width:600px;margin:0 auto;background:#121212;border:1px solid #222;border-radius:12px;padding:32px}
          h1{color:#f43f5e;font-size:24px;margin-top:0}
          p{color:#a3a3a3;font-size:16px;line-height:1.5}
          .stat-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin:24px 0;border-top:1px solid #222;border-bottom:1px solid #222;padding:16px 0}
          .stat-label{font-size:12px;text-transform:uppercase;color:#737373;font-weight:bold}
          .stat-value{font-size:18px;color:#f5f5f5;font-weight:600;margin-top:4px;word-break:break-all}
          .footer{font-size:12px;color:#525252;margin-top:32px;border-top:1px solid #222;padding-top:16px;text-align:center}
        </style></head><body><div class="container">
          <h1>🚨 Incident Detected</h1>
          <p>Our automated monitoring system detected that your target endpoint is offline or returning an unhealthy status code.</p>
          <div class="stat-grid">
            <div><div class="stat-label">Target URL</div><div class="stat-value">${monitor.url}</div></div>
            <div><div class="stat-label">Resolution Code</div><div class="stat-value" style="color:#f43f5e">${statusCode}</div></div>
            <div><div class="stat-label">Response Latency</div><div class="stat-value">${latency}ms</div></div>
            <div><div class="stat-label">Timestamp (UTC)</div><div class="stat-value">${new Date().toISOString()}</div></div>
            ${diagnosticRow}
          </div>
          <p class="footer">PulsePing Automated Production Core Alerts Engine</p>
        </div></body></html>`;

        alertPromises.push(
          resend.emails.send({
            from: "PulsePing Alerts <alerts@subharup.com>",
            to: monitor.alertEmail,
            subject: `[PulsePing] Target Offline: ${monitor.url}`,
            html: htmlContent,
          }).catch((e) => console.error("Resend email alert failure:", e))
        );
      }
    }

    if (alertPromises.length > 0) {
      await Promise.allSettled(alertPromises);
    }
  }

  return { id: monitor.id, url: monitor.url, status: statusCode, latency, connectionError };
} catch (monitorErr: unknown) {
    const errMessage = parseErrorMessage(monitorErr);
    console.error(`Check monitor failed for ${monitor?.id || "unknown"}:`, errMessage);
    return { id: monitor?.id, status: 0, latency: 0, error: errMessage };
  }
}

// ── Heartbeat Watchdog ────────────────────────────────────────────────────────
async function runHeartbeatWatchdog() {
  try {
    const heartbeats = await (db as any).heartbeat.findMany({
      where: { isActive: true },
      include: { user: true },
    });

    const now = new Date();

    for (const hb of heartbeats) {
      if (!hb.lastPingedAt) continue;

      const elapsedSec = (now.getTime() - new Date(hb.lastPingedAt).getTime()) / 1000;
      const windowSec = hb.frequencySeconds + hb.gracePeriodSeconds;

      if (elapsedSec > windowSec) {
        console.warn(`Heartbeat MISSED: "${hb.name}" (token: ${hb.token}). Elapsed: ${Math.round(elapsedSec)}s, window: ${windowSec}s`);

        // Alert via Resend if user has email set
        if (hb.user?.email && process.env.RESEND_API_KEY) {
          try {
            const resend = new Resend(process.env.RESEND_API_KEY);
            await resend.emails.send({
              from: "PulsePing Alerts <alerts@subharup.com>",
              to: hb.user.email,
              subject: `[PulsePing] Heartbeat Missed: ${hb.name}`,
              html: `<p>Your heartbeat monitor <strong>${hb.name}</strong> has not checked in for ${Math.round(elapsedSec)} seconds (expected every ${hb.frequencySeconds}s + ${hb.gracePeriodSeconds}s grace).</p>`,
            });
          } catch (e) {
            console.error("Heartbeat alert email failed:", e);
          }
        }
      }
    }
  } catch (err) {
    console.error("Heartbeat watchdog scan failed:", err);
  }
}

// ── Main Handler ──────────────────────────────────────────────────────────────
async function handleCronRequest(req: NextRequest) {
  const isInternalCron = req.headers.get("x-internal-cron") === "true";
  const cronSecretHeader = req.headers.get("x-cron-secret");
  const authHeader = req.headers.get("authorization");
  const expectedSecret = process.env.CRON_SECRET;

  const isAuthorized =
    isInternalCron ||
    (cronSecretHeader && expectedSecret && cronSecretHeader === expectedSecret) ||
    (authHeader && expectedSecret && authHeader === `Bearer ${expectedSecret}`);

  if (!isAuthorized) {
    return NextResponse.json({ error: "Unauthorized invocation" }, { status: 401 });
  }

  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ success: false, error: "DATABASE_URL missing" }, { status: 503 });
  }

  const allProcessedResults: any[] = [];

  try {
    // === WAVE 1: 0-Second Mark ===
    const activeMonitors = await db.monitor.findMany({
      where: { isActive: true },
      include: { user: true },
    });

    const now = new Date();
    const wave1Monitors = activeMonitors.filter((monitor: any) => {
      if (!monitor.lastChecked) return true;
      const elapsedMs = now.getTime() - new Date(monitor.lastChecked).getTime();
      const userPlan = monitor.user?.plan || "FREE";
      return elapsedMs >= getFrequencyMs(userPlan, monitor.frequency);
    });

    if (wave1Monitors.length > 0) {
      const wave1Settled = await Promise.allSettled(wave1Monitors.map((m) => checkMonitor(m)));
      wave1Settled.forEach((r) => {
        if (r.status === "fulfilled") allProcessedResults.push(r.value);
        else allProcessedResults.push({ error: parseErrorMessage(r.reason) });
      });
    }

    // === HEARTBEAT WATCHDOG ===
    await runHeartbeatWatchdog();

    // === PRUNE HISTORICAL LOGS (> 30 days old) ===
    (async () => {
      try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        await db.pingLog.deleteMany({
          where: {
            checkedAt: {
              lt: thirtyDaysAgo,
            },
          },
        });
      } catch (pruneError) {
        console.error("Non-blocking historical logs pruning failed:", pruneError);
      }
    })();

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      activeMonitorsChecked: wave1Monitors.length,
      processed: allProcessedResults.length,
      data: allProcessedResults,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("CRON_ROUTE_ERROR:", error);
    return NextResponse.json({ success: false, error: "Internal crash", details: errorMessage }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  return handleCronRequest(req);
}

export async function POST(req: NextRequest) {
  return handleCronRequest(req);
}