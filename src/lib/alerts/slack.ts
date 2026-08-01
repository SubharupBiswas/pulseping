import { IncidentPayload } from "@/types/alert";

export async function sendSlackAlert(incident: IncidentPayload, webhookUrl: string): Promise<boolean> {
  const payload = {
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: "🚨 PulsePing Webhook Failure Alert",
          emoji: true,
        },
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*Target URL:*\n\`${incident.targetUrl}\``,
          },
          {
            type: "mrkdwn",
            text: `*Status Code:*\n${incident.responseStatus}`,
          },
          {
            type: "mrkdwn",
            text: `*Latency:*\n${incident.executionTimeMs}ms`,
          },
          {
            type: "mrkdwn",
            text: `*HMAC Verified:*\n${incident.hmacVerified !== undefined ? (incident.hmacVerified ? "Verified ✅" : "Failed ❌") : "N/A ⚠️"}`,
          },
        ],
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `🤖 *Groq AI Root Cause Diagnosis:*\n>${incident.aiDiagnosis || "No AI diagnosis available."}`,
        },
      },
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: incident.logId ? `PulsePing Log ID: \`${incident.logId}\`` : "PulsePing Sentinel",
          },
        ],
      },
    ],
  };

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    return res.ok;
  } catch (err) {
    console.error("Slack webhook dispatch failed:", err);
    return false;
  }
}
