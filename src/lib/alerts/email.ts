import { IncidentPayload } from "@/types/alert";
import { Resend } from "resend";

export async function sendEmailAlert(incident: IncidentPayload, emailAddress: string): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return false;
  }

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: "PulsePing Sentinel <alerts@pulseping.com>",
      to: emailAddress,
      subject: `🚨 [PulsePing Incident] Webhook Failure: ${incident.targetUrl}`,
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
    });
    return true;
  } catch (err) {
    console.error("Resend email dispatch failed:", err);
    return false;
  }
}
