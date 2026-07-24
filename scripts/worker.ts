import { loadEnv, db } from "../src/lib/db";
import { generateIncidentDiagnostic } from "../src/lib/ai";
import { Resend } from "resend";
import * as https from "https";

// Explicitly ensure environment variables are loaded prior to any database queries or network requests
loadEnv();

let isRunning = true;
const CHECK_INTERVAL_MS = 10000; // 10-second master check loop

const getFrequencyMs = (freq: number) => {
  if (freq === 30) return 30 * 1000;
  return freq * 60 * 1000;
};

// ── SSL Certificate Expiry Probe ──────────────────────────────────────────────
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
          rejectUnauthorized: false,
        },
        (res) => {
          const cert = (res.socket as any).getPeerCertificate?.();
          if (cert?.valid_to) {
            resolve(new Date(cert.valid_to));
          } else {
            resolve(null);
          }
          res.resume();
        }
      );
      req.setTimeout(4000, () => {
        req.destroy();
        resolve(null);
      });
      req.on("error", () => resolve(null));
      req.end();
    } catch {
      resolve(null);
    }
  });
}

// ── Check Individual Target Monitor ──────────────────────────────────────────
async function processSingleMonitor(monitor: any) {
  const startTime = performance.now();
  let statusCode = 500;
  let latency = 0;
  let connectionError = false;
  let errorBody: string | null = null;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  const builtHeaders: Record<string, string> = {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  };

  if (monitor.customHeaders && typeof monitor.customHeaders === "object") {
    for (const [k, v] of Object.entries(monitor.customHeaders)) {
      if (typeof k === "string" && typeof v === "string") {
        builtHeaders[k] = v;
      }
    }
  }

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

    if (httpMethod !== "HEAD") {
      try {
        responseText = await response.text();
      } catch {
        responseText = null;
      }
    }

    if (
      monitor.expectedBodyText &&
      typeof monitor.expectedBodyText === "string" &&
      monitor.expectedBodyText.trim() !== ""
    ) {
      if (!responseText || !responseText.includes(monitor.expectedBodyText)) {
        statusCode = 0;
        connectionError = true;
        errorBody = `Content Mismatch Failure: Expected "${monitor.expectedBodyText}" not found in response body.`;
      }
    }

    if (!connectionError && (statusCode < 200 || statusCode >= 300)) {
      errorBody = responseText ? responseText.slice(0, 500) : null;
    }
  } catch (fetchError: any) {
    connectionError = true;
    statusCode = 0;
    latency = Math.round(performance.now() - startTime);
    errorBody = fetchError?.message ? fetchError.message.slice(0, 500) : "Network connection failure";
  } finally {
    clearTimeout(timeoutId);
  }

  let sslExpiresAt: Date | null = null;
  if (monitor.url.startsWith("https://")) {
    sslExpiresAt = await getSslExpiry(monitor.url);
  }

  const isFailure = statusCode < 200 || statusCode >= 300 || statusCode === 0;

  let aiDiagnostic: string | null = null;
  if (isFailure && errorBody) {
    aiDiagnostic = await generateIncidentDiagnostic(monitor.url, statusCode, errorBody);
  }

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
    console.error(`[WORKER] Database write error for monitor ${monitor.id}:`, dbError);
  }

  if (isFailure && monitor.alertOnFailure !== false) {
    let alertChannels: any[] = [];
    try {
      alertChannels = await (db as any).alertChannel.findMany({
        where: { userId: monitor.userId },
      });
    } catch (dbErr) {
      console.error("[WORKER] Failed to fetch alert channels:", dbErr);
    }

    for (const channel of alertChannels) {
      try {
        const type = (channel.providerType || "").toUpperCase();
        const dest = channel.destinationUrl;
        if (!dest) continue;

        if (type === "DISCORD") {
          const diagnosticField = aiDiagnostic
            ? [{ name: "AI Root-Cause Diagnosis", value: aiDiagnostic, inline: false }]
            : [];
          await fetch(dest, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              username: "PulsePing Bot",
              embeds: [
                {
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
                  footer: { text: "PulsePing Background Worker Dispatcher" },
                },
              ],
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
                {
                  type: "section",
                  text: {
                    type: "mrkdwn",
                    text: `*Target URL:* \`${monitor.url}\`\n*HTTP Code:* 🔴 ${statusCode}\n*Latency:* ${latency}ms${diagnosticText}`,
                  },
                },
                { type: "context", elements: [{ type: "mrkdwn", text: "PulsePing Background Worker Dispatcher" }] },
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
            const htmlContent = `<!DOCTYPE html><html><body style="background:#0a0a0a;color:#fff;padding:24px;">
              <h1 style="color:#f43f5e;">🚨 Incident Detected</h1>
              <p>Target: <code>${monitor.url}</code></p>
              <p>Status: ${statusCode} | Latency: ${latency}ms</p>
              ${aiDiagnostic ? `<p><strong>AI Diagnosis:</strong> ${aiDiagnostic}</p>` : ""}
            </body></html>`;

            await resend.emails.send({
              from: "PulsePing Alerts <alerts@pulseping.dev>",
              to: [dest],
              subject: `🚨 INCIDENT: ${monitor.url} is DOWN`,
              html: htmlContent,
            });
          }
        }
      } catch (alertErr) {
        console.error(`[WORKER] Alert dispatch error for monitor ${monitor.id}:`, alertErr);
      }
    }
  }
}

function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

const BATCH_SIZE = 10; // Batch limit for low-RAM AWS Lightsail instances

// ── Master Execution Loop ──────────────────────────────────────────────────
async function runMonitoringCycle() {
  const cycleStart = Date.now();
  console.log(`[WORKER] [${new Date().toISOString()}] Starting background health check iteration...`);

  try {
    const activeMonitors = await db.monitor.findMany({
      where: { isActive: true },
    });

    const now = Date.now();
    const monitorsDue = activeMonitors.filter((m: any) => {
      if (!m.lastChecked) return true;
      const elapsed = now - new Date(m.lastChecked).getTime();
      return elapsed >= getFrequencyMs(m.frequency || 10);
    });

    console.log(`[WORKER] Found ${monitorsDue.length}/${activeMonitors.length} monitors due for check.`);

    // Controlled batch execution to prevent CPU spikes and socket exhaustion on AWS Lightsail
    const batches = chunkArray(monitorsDue, BATCH_SIZE);

    for (const batch of batches) {
      await Promise.allSettled(
        batch.map(async (monitor: any) => {
          try {
            await processSingleMonitor(monitor);
          } catch (singleErr) {
            // Isolated error handler — single target failure never interrupts master loop
            console.error(`[WORKER] Isolated error processing monitor ${monitor.id} (${monitor.url}):`, singleErr);
          }
        })
      );

      if (batches.length > 1) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }
  } catch (cycleErr) {
    console.error("[WORKER] Master monitoring cycle error:", cycleErr);
  }

  const duration = Date.now() - cycleStart;
  console.log(`[WORKER] Iteration finished in ${duration}ms.`);
}

async function startWorkerLoop() {
  console.log("🚀 PulsePing Background Health Check Worker initialized.");

  while (isRunning) {
    await runMonitoringCycle();
    await new Promise((resolve) => setTimeout(resolve, CHECK_INTERVAL_MS));
  }

  console.log("🛑 PulsePing Background Worker shut down cleanly.");
}

// Signal handling
process.on("SIGINT", () => {
  console.log("\nReceived SIGINT. Shutting down worker loop...");
  isRunning = false;
});

process.on("SIGTERM", () => {
  console.log("\nReceived SIGTERM. Shutting down worker loop...");
  isRunning = false;
});

// Launch master loop
startWorkerLoop().catch((fatalErr) => {
  console.error("FATAL: Unhandled worker loop crash:", fatalErr);
  process.exit(1);
});
