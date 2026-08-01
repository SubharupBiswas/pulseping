import { db } from "@/lib/db";
import { dispatchAlerts } from "@/lib/alerts/dispatcher";
import { AlertChannelConfig } from "@/types/alert";

export async function analyzeAndAlertFailure(guard: any, log: any) {
  let aiDiagnosis = "Unable to analyze error stack trace.";

  if (process.env.GROQ_API_KEY) {
    try {
      const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content:
                "You are an expert backend engineer. Analyze the webhook response error and describe why it failed in 2 concise sentences.",
            },
            {
              role: "user",
              content: `Target URL: ${guard.targetUrl}\nStatus: ${log.responseStatus}\nError: ${log.errorMessage}`,
            },
          ],
        }),
      });

      const aiData = await groqRes.json();
      aiDiagnosis = aiData.choices?.[0]?.message?.content || aiDiagnosis;

      await db.webhookLog.update({
        where: { id: log.id },
        data: { aiDiagnosis },
      });
    } catch (e) {
      console.error("Groq AI Analysis failed:", e);
    }
  }

  const incidentPayload = {
    guardName: guard.name,
    targetUrl: guard.targetUrl,
    responseStatus: log.responseStatus,
    executionTimeMs: log.executionTimeMs,
    errorMessage: log.errorMessage,
    aiDiagnosis: aiDiagnosis,
    logId: log.id,
  };

  const configuredChannels: AlertChannelConfig[] = [];

  if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
    configuredChannels.push({
      providerType: "TELEGRAM",
      destinationUrl: process.env.TELEGRAM_CHAT_ID,
    });
  }

  if (process.env.DISCORD_WEBHOOK_URL) {
    configuredChannels.push({
      providerType: "DISCORD",
      destinationUrl: process.env.DISCORD_WEBHOOK_URL,
    });
  }

  if (process.env.SLACK_WEBHOOK_URL) {
    configuredChannels.push({
      providerType: "SLACK",
      destinationUrl: process.env.SLACK_WEBHOOK_URL,
    });
  }

  if (configuredChannels.length > 0) {
    await dispatchAlerts(incidentPayload, configuredChannels);
  }
}
