import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized invocation" }, { status: 401 });
  }

  try {
    const activeMonitors = await db.monitor.findMany({ where: { isActive: true } });

    if (activeMonitors.length === 0) {
      return NextResponse.json({ success: true, message: "No active monitors found." });
    }

    const results = await Promise.all(
      activeMonitors.map(async (monitor) => {
        const startTime = performance.now();
        let statusCode = 500;
        let latency = 0;

        try {
          const response = await fetch(monitor.url, {
            method: "GET",
            cache: "no-store",
            signal: AbortSignal.timeout(5000),
          });
          statusCode = response.status;
          latency = Math.round(performance.now() - startTime);
        } catch (fetchError) {
          statusCode = 0; // Set to 0 specifically for connection errors or timeouts
          latency = Math.round(performance.now() - startTime);
        }

        // Write telemetry packet to database
        await db.pingLog.create({
          data: { monitorId: monitor.id, statusCode, latency },
        });

        // DISCORD DISPATCH PIPELINE: Triggered if endpoint fails validation and webhook string is saved
        if ((statusCode >= 500 || statusCode === 0) && monitor.webhookUrl) {
          try {
            await fetch(monitor.webhookUrl, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                username: "PulsePing Bot",
                avatar_url: "https://pulseping.dev/logo.png",
                embeds: [{
                  title: "🚨 INCIDENT DETECTED: Endpoint Offline",
                  description: "The monitoring engine failed to receive a healthy validation handshake from your server node.",
                  color: 15548997, // Red color hex code
                  fields: [
                    { name: "Target URL Address", value: `\`${monitor.url}\``, inline: false },
                    { name: "HTTP Resolution State", value: `🔴 Error Code ${statusCode}`, inline: true },
                    { name: "Round-trip Latency Time", value: `⏱️ ${latency}ms`, inline: true }
                  ],
                  timestamp: new Date().toISOString(),
                  footer: { text: "PulsePing Automated Production Core Alerts Engine" }
                }]
              }),
            });
          } catch (discordWebhookError) {
            console.error(`Failed to dispatch alert payload to Discord for monitor ${monitor.id}:`, discordWebhookError);
          }
        }

        return { id: monitor.id, url: monitor.url, status: statusCode, latency };
      })
    );

    return NextResponse.json({ success: true, processed: results.length, data: results });
  } catch (error) {
    console.error("CRON_ENGINE_ERROR:", error);
    return NextResponse.json({ success: false, error: "Internal operation crash" }, { status: 500 });
  }
}
