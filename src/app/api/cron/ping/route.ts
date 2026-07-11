import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Resend } from "resend";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Configuration Error: CRON_SECRET is not defined." }, { status: 500 });
  }

  const authHeader = req.headers.get("authorization");
  if (!authHeader || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized invocation" }, { status: 401 });
  }

  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ 
      success: false, 
      error: "Service Unavailable", 
      details: "DATABASE_URL environment variable is missing." 
    }, { status: 503 });
  }

  try {
    // Pull all monitors that are active
    const activeMonitors = await db.monitor.findMany({
      where: { isActive: true },
    });

    const now = new Date();
    const monitorsToPing = activeMonitors.filter((monitor: any) => {
      if (!monitor.lastChecked) {
        return true; // Immediately due if never checked
      }
      const elapsedMinutes = (now.getTime() - new Date(monitor.lastChecked).getTime()) / (1000 * 60);
      return elapsedMinutes >= monitor.frequency;
    });

    if (monitorsToPing.length === 0) {
      return NextResponse.json({ success: true, message: "No active monitors are due for polling at this time." });
    }

    // High-speed concurrent check of all endpoints using Promise.allSettled
    const checkResults = await Promise.allSettled(
      monitorsToPing.map(async (monitor: any) => {
        const startTime = performance.now();
        let statusCode = 500;
        let latency = 0;
        let connectionError = false;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        try {
          const response = await fetch(monitor.url, {
            method: "GET",
            cache: "no-store",
            signal: controller.signal,
            headers: {
              "User-Agent": "PulsePing-Edge-Telemetry-Engine/1.0"
            }
          });
          statusCode = response.status;
          latency = Math.round(performance.now() - startTime);
        } catch (fetchError: any) {
          connectionError = true;
          statusCode = 0; // 0 indicates timeout or network resolve failure
          latency = Math.round(performance.now() - startTime);
        } finally {
          clearTimeout(timeoutId);
        }

        // Save log to the database via our lazy client proxy
        await db.pingLog.create({
          data: {
            monitorId: monitor.id,
            statusCode,
            latency,
          },
        });

        // Update the lastChecked field on the monitor record
        await db.monitor.update({
          where: { id: monitor.id },
          data: { lastChecked: new Date() },
        });

        const isFailure = statusCode < 200 || statusCode >= 300 || statusCode === 0;

        // If the endpoint check failed, trigger concurrent notification channels
        if (isFailure) {
          const alertPromises: Promise<any>[] = [];

          // 1. Telegram alert channel
          if (monitor.telegramChatId) {
            if (!process.env.TELEGRAM_BOT_TOKEN) {
              console.warn(`Telegram alert dispatch skipped for monitor ${monitor.id}: TELEGRAM_BOT_TOKEN is not configured in the environment.`);
            } else {
              try {
                const telegramUrl = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;
                const text = `🚨 PulsePing Alert: Target Endpoint Offline\n\nTarget URL: ${monitor.url}\nHTTP Code: ${statusCode}\nLatency: ${latency}ms\nChecked At: ${new Date().toISOString()}`;

                alertPromises.push(
                  fetch(telegramUrl, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      chat_id: monitor.telegramChatId,
                      text: text,
                    }),
                  }).then(async (res) => {
                    if (!res.ok) {
                      const errText = await res.text();
                      console.error(`Telegram API responded with status ${res.status}: ${errText}`);
                    }
                  }).catch((e) => console.error("Telegram alert channel network failure:", e))
                );
              } catch (constructError) {
                console.error("Failed to construct Telegram notification payload:", constructError);
              }
            }
          }

          // 2. Slack Webhook channel
          if (monitor.slackWebhook) {
            try {
              const slackBody = {
                blocks: [
                  {
                    type: "header",
                    text: {
                      type: "plain_text",
                      text: "🚨 PulsePing Incident Detected",
                      emoji: true,
                    },
                  },
                  {
                    type: "section",
                    text: {
                      type: "mrkdwn",
                      text: `*Target URL:* \`${monitor.url}\`\n*HTTP Resolution State:* 🔴 Error Code ${statusCode}\n*Round-trip Latency:* ⏱️ ${latency}ms`,
                    },
                  },
                  {
                    type: "context",
                    elements: [
                      {
                        type: "mrkdwn",
                        text: "PulsePing Automated Production Core Alerts Engine",
                      },
                    ],
                  },
                ],
              };

              alertPromises.push(
                fetch(monitor.slackWebhook, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(slackBody),
                }).then(async (res) => {
                  if (!res.ok) {
                    const errText = await res.text();
                    console.error(`Slack API responded with status ${res.status}: ${errText}`);
                  }
                }).catch((e) => console.error("Slack webhook channel network failure:", e))
              );
            } catch (constructError) {
              console.error("Failed to construct Slack notification payload:", constructError);
            }
          }

          // 3. Discord Webhook channel
          const targetDiscordWebhook = monitor.discordWebhook || monitor.webhookUrl;
          if (targetDiscordWebhook) {
            try {
              const discordBody = {
                username: "PulsePing Bot",
                avatar_url: "https://pulseping.dev/logo.png",
                embeds: [
                  {
                    title: "🚨 INCIDENT DETECTED: Endpoint Offline",
                    description: "The monitoring engine failed to receive a healthy validation response from your server node.",
                    color: 15548997,
                    fields: [
                      { name: "Target URL Address", value: `\`${monitor.url}\``, inline: false },
                      { name: "HTTP Resolution State", value: `🔴 Error Code ${statusCode}`, inline: true },
                      { name: "Round-trip Latency Time", value: `⏱️ ${latency}ms`, inline: true },
                    ],
                    timestamp: new Date().toISOString(),
                    footer: { text: "PulsePing Automated Production Core Alerts Engine" },
                  },
                ],
              };

              alertPromises.push(
                fetch(targetDiscordWebhook, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(discordBody),
                }).then(async (res) => {
                  if (!res.ok) {
                    const errText = await res.text();
                    console.error(`Discord API responded with status ${res.status}: ${errText}`);
                  }
                }).catch((e) => console.error("Discord webhook channel network failure:", e))
              );
            } catch (constructError) {
              console.error("Failed to construct Discord notification payload:", constructError);
            }
          }

          // 4. Resend Transactional Email alert
          if (monitor.alertEmail) {
            if (!process.env.RESEND_API_KEY) {
              console.warn(`Resend email dispatch skipped for monitor ${monitor.id}: RESEND_API_KEY is not configured in the environment.`);
            } else {
              try {
                const resend = new Resend(process.env.RESEND_API_KEY);
                const htmlContent = `
                  <!DOCTYPE html>
                  <html>
                    <head>
                      <style>
                        body { background-color: #0a0a0a; color: #ffffff; font-family: sans-serif; padding: 24px; margin: 0; }
                        .container { max-width: 600px; margin: 0 auto; background-color: #121212; border: 1px solid #222; border-radius: 12px; padding: 32px; }
                        h1 { color: #f43f5e; font-size: 24px; margin-top: 0; margin-bottom: 16px; font-weight: bold; }
                        p { color: #a3a3a3; font-size: 16px; line-height: 1.5; }
                        .stat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 24px 0; border-top: 1px solid #222; border-bottom: 1px solid #222; padding: 16px 0; }
                        .stat-label { font-size: 12px; text-transform: uppercase; color: #737373; font-weight: bold; }
                        .stat-value { font-size: 18px; color: #f5f5f5; font-weight: 600; margin-top: 4px; word-break: break-all; }
                        .footer { font-size: 12px; color: #525252; margin-top: 32px; border-top: 1px solid #222; padding-top: 16px; text-align: center; }
                      </style>
                    </head>
                    <body>
                      <div class="container">
                        <h1>🚨 Incident Detected</h1>
                        <p>Our automated monitoring system detected that your target endpoint is offline or returning an unhealthy status code.</p>
                        <div class="stat-grid">
                          <div>
                            <div class="stat-label">Target URL</div>
                            <div class="stat-value">${monitor.url}</div>
                          </div>
                          <div>
                            <div class="stat-label">Resolution Code</div>
                            <div class="stat-value" style="color: #f43f5e;">${statusCode}</div>
                          </div>
                          <div>
                            <div class="stat-label">Response Latency</div>
                            <div class="stat-value">${latency}ms</div>
                          </div>
                          <div>
                            <div class="stat-label">Timestamp (UTC)</div>
                            <div class="stat-value">${new Date().toISOString()}</div>
                          </div>
                        </div>
                        <p class="footer">PulsePing Automated Production Core Alerts Engine</p>
                      </div>
                    </body>
                  </html>
                `;

                alertPromises.push(
                  resend.emails.send({
                    from: "PulsePing Alerts <alerts@pulseping.subnetmask.tech>",
                    to: monitor.alertEmail,
                    subject: `[PulsePing] Target Offline: ${monitor.url}`,
                    html: htmlContent,
                  }).then((res) => {
                    if (res.error) {
                      console.error("Resend API returned sending error:", res.error);
                    }
                  }).catch((e) => console.error("Resend email channel network failure:", e))
                );
              } catch (constructError) {
                console.error("Failed to construct Resend email notification payload:", constructError);
              }
            }
          }

          // Trigger all alert dispatches concurrently and explicitly await them to guarantee
          // the Cloudflare V8 isolate cannot prematurely kill the CPU thread before completion
          if (alertPromises.length > 0) {
            await Promise.allSettled(alertPromises);
          }
        }

        return {
          id: monitor.id,
          url: monitor.url,
          status: statusCode,
          latency,
          connectionError,
        };
      })
    );

    // Map checked results to success objects
    const results = checkResults.map((r: any) => {
      if (r.status === "fulfilled") {
        return r.value;
      } else {
        return { error: r.reason };
      }
    });

    return NextResponse.json({ success: true, processed: results.length, data: results });
  } catch (error: any) {
    console.error("CRON_ENGINE_ERROR:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Internal operation crash", 
      details: error?.message || String(error)
    }, { status: 500 });
  }
}