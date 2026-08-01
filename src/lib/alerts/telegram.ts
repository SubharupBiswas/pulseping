import { IncidentPayload } from "@/types/alert";

export async function sendTelegramAlert(incident: IncidentPayload, destination: string): Promise<boolean> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = destination || process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    return false;
  }

  const message = `🚨 <b>PulsePing Webhook Failure Alert</b>

${incident.guardName ? `<b>Guard:</b> ${incident.guardName}\n` : ""}${incident.monitorName ? `<b>Monitor:</b> ${incident.monitorName}\n` : ""}<b>Target:</b> <code>${incident.targetUrl}</code>
<b>Status:</b> ${incident.responseStatus}
<b>Latency:</b> ${incident.executionTimeMs}ms

🤖 <b>AI Diagnosis:</b>
<i>${incident.aiDiagnosis || "No AI diagnosis available."}</i>

${incident.logId ? `💡 Log ID: <code>${incident.logId}</code>` : ""}`;

  try {
    const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "HTML",
      }),
    });

    return res.ok;
  } catch (err) {
    console.error("Telegram alert dispatch failed:", err);
    return false;
  }
}
