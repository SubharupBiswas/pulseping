import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Resend } from "resend";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized invocation" }, { status: 401 });
  }

  try {
    // Pull all monitors that are active
    const activeMonitors = await db.monitor.findMany({
      where: { isActive: true },
    });

    if (activeMonitors.length === 0) {
      return NextResponse.json({ success: true, message: "No active monitors found." });
    }

    // High-speed concurrent check of all endpoints using Promise.allSettled
    const checkResults = await Promise.allSettled(
      activeMonitors.map(async (monitor: any) => {
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

        const isFailure = statusCode < 200 || statusCode >= 300 || statusCode === 0;

        // If the endpoint check failed, trigger concurrent notification channels
        if (isFailure) {
          const alertPromises: Promise<any>[] = [];

          // 1. Telegram alert channel
          if (monitor.telegramChatId && process.env.TELEGRAM_BOT_TOKEN) {
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
              }).catch((e) => console.error("Telegram alert channel failure:", e))
            );
          }

          // 2. Slack Webhook channel
          if (monitor.slackWebhook) {
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
              }).catch((e) => console.error("Slack webhook channel failure:", e))
            );
          }

          // 3. Discord Webhook channel
          const targetDiscordWebhook = monitor.discordWebhook || monitor.webhookUrl;
          if (targetDiscordWebhook) {
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
              }).catch((e) => console.error("Discord webhook channel failure:", e))
            );
          }

          // 4. Resend Transactional Email alert
          if (monitor.alertEmail && process.env.RESEND_API_KEY) {
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
              }).catch((e) => console.error("Resend email channel failure:", e))
            );
          }

          // Trigger all alert dispatches concurrently without blocking the main cron execution path
          if (alertPromises.length > 0) {
            Promise.allSettled(alertPromises).then((results) => {
              results.forEach((res, i) => {
                if (res.status === "rejected") {
                  console.error(`Alert channel ${i} dispatch error:`, res.reason);
                }
              });
            });
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
    const results = checkResults.map((r) => {
      if (r.status === "fulfilled") {
        return r.value;
      } else {
        return { error: r.reason };
      }
    });

    return NextResponse.json({ success: true, processed: results.length, data: results });
  } catch (error) {
    console.error("CRON_ENGINE_ERROR:", error);
    return NextResponse.json({ success: false, error: "Internal operation crash" }, { status: 500 });
  }
}