import { IncidentPayload } from "@/types/alert";

export async function sendEmailAlert(incident: IncidentPayload, toEmail: string): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL || "PulsePing AI <alerts@subharup.com>",
        to: [toEmail],
        subject: `🚨 PulsePing Alert: Webhook Failure`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
            <h2 style="color: #dc2626;">🚨 PulsePing Webhook Failure Alert</h2>
            <p><strong>Target URL:</strong> <code>${incident.targetUrl}</code></p>
            <p><strong>Status Code:</strong> ${incident.responseStatus}</p>
            <p><strong>Latency:</strong> ${incident.executionTimeMs} ms</p>
            <div style="background-color: #f3f4f6; padding: 15px; border-left: 4px solid #3b82f6; border-radius: 4px; margin: 20px 0;">
              <h4 style="margin-top: 0;">🤖 Groq AI Root Cause Diagnosis</h4>
              <p style="font-style: italic; color: #374151;">${incident.aiDiagnosis || "No AI diagnosis available."}</p>
            </div>
            ${incident.logId ? `<p style="font-size: 12px; color: #6b7280;">Log ID: ${incident.logId}</p>` : ""}
          </div>
        `,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
