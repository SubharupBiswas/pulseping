import { db } from "@/lib/db";

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

  if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
    const message = `🚨 <b>PulsePing Webhook Failure Alert</b>

<b>Guard:</b> ${guard.name}
<b>Target:</b> <code>${guard.targetUrl}</code>
<b>Status:</b> ${log.responseStatus}
<b>Latency:</b> ${log.executionTimeMs}ms

🤖 <b>AI Diagnosis:</b>
<i>${aiDiagnosis}</i>

💡 Log ID: <code>${log.id}</code>`;

    await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: "HTML",
      }),
    });
  }
}
