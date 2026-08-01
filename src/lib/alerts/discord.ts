import { IncidentPayload } from "@/types/alert";

export async function sendDiscordAlert(incident: IncidentPayload, webhookUrl: string): Promise<boolean> {
  const isTimeoutOr5xx = incident.responseStatus >= 500 || incident.executionTimeMs >= 4500;
  const embedColor = isTimeoutOr5xx ? 16711680 : 16753920; // Red (#FF0000) or Orange (#FFA500)

  const embed = {
    title: "🚨 Webhook Failure / Timeout Detected",
    color: embedColor,
    fields: [
      {
        name: "Target Endpoint URL",
        value: `\`${incident.targetUrl}\``,
        inline: false,
      },
      {
        name: "HTTP Status",
        value: `${incident.responseStatus}`,
        inline: true,
      },
      {
        name: "Latency",
        value: `${incident.executionTimeMs} ms`,
        inline: true,
      },
      {
        name: "HMAC Verification",
        value: incident.hmacVerified !== undefined ? (incident.hmacVerified ? "Verified ✅" : "Failed ❌") : "N/A ⚠️",
        inline: true,
      },
      {
        name: "🤖 Groq AI Root Cause Diagnosis",
        value: `\`\`\`\n${incident.aiDiagnosis || "No AI diagnosis available."}\n\`\`\``,
        inline: false,
      },
    ],
    footer: {
      text: incident.logId ? `PulsePing Log ID: ${incident.logId}` : "PulsePing AI Sentinel",
    },
    timestamp: new Date().toISOString(),
  };

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "PulsePing Sentinel",
        embeds: [embed],
      }),
    });

    return res.ok;
  } catch (err) {
    console.error("Discord webhook dispatch failed:", err);
    return false;
  }
}
