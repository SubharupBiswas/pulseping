/**
 * AI Incident Root-Cause Diagnostic Pipeline
 *
 * Dual-Provider Engine:
 * Primary: Google Gemini API (gemini-2.5-flash)
 * Fallback: Groq AI API (llama-3.3-70b-versatile)
 *
 * Catches all errors internally; never throws.
 */

const GEMINI_REST_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";
const GROQ_REST_URL = "https://api.groq.com/openai/v1/chat/completions";

const diagnosticCooldowns = new Map<string, number>();
const COOLDOWN_MS = 15 * 60 * 1000; // 15 minutes

export async function generateIncidentDiagnostic(
  promptOrUrl: string,
  statusCode?: number,
  errorBody?: string | null
): Promise<string> {
  const geminiKey = process.env.GEMINI_API_KEY;
  const groqKey = process.env.GROQ_API_KEY;

  let prompt = promptOrUrl;
  if (typeof statusCode === "number") {
    prompt = `You are a site reliability engineering assistant. A monitoring system just detected a failure.

Target URL: ${promptOrUrl}
HTTP Status Code: ${statusCode === 0 ? "Connection Timeout / Network Failure" : statusCode}
Error Response Body (first 500 chars): ${errorBody ?? "No response body captured"}

Produce a concise single-sentence (max 25 words) root-cause summary of this incident for a developer. Be technical, direct, and practical. Do not start with "The" or repeat the URL.`;
  }

  // ── Primary Provider: Google Gemini ──
  if (geminiKey) {
    try {
      const response = await fetch(`${GEMINI_REST_URL}?key=${geminiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 100, temperature: 0.3 },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const text: string | undefined =
          data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text && text.trim()) {
          return text.trim().slice(0, 280);
        }
      } else {
        console.warn(
          "[AI Diagnostics] Gemini primary returned HTTP " + response.status + ". Triggering Groq fallback..."
        );
      }
    } catch (err: any) {
      console.warn(
        "[AI Diagnostics] Gemini primary failed or rate-limited. Triggering Groq fallback...",
        err?.message || err
      );
    }
  }

  // ── Fallback Provider: Groq AI ──
  if (groqKey) {
    try {
      const response = await fetch(GROQ_REST_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${groqKey}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content:
                "You are an expert DevOps engineer providing concise 2-sentence root-cause diagnostics for API outages.",
            },
            { role: "user", content: prompt },
          ],
          max_tokens: 120,
          temperature: 0.3,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const content: string | undefined = data?.choices?.[0]?.message?.content;
        if (content && content.trim()) {
          return content.trim().slice(0, 280);
        }
      } else {
        console.error(
          "[AI Diagnostics] Groq fallback returned HTTP " + response.status
        );
      }
    } catch (groqErr: any) {
      console.error(
        "[AI Diagnostics] Groq fallback also failed:",
        groqErr?.message || groqErr
      );
    }
  }

  return "HTTP check failed. Unable to generate AI diagnostic summary due to temporary provider rate limits.";
}

export async function generateIncidentDiagnosticWithCooldown(
  url: string,
  statusCode: number,
  errorBody: string | null
): Promise<string | null> {
  const lastRun = diagnosticCooldowns.get(url) || 0;
  const now = Date.now();

  if (now - lastRun < COOLDOWN_MS) {
    console.log(`[AI_GUARD] Cooldown active for ${url}. Skipping AI evaluation.`);
    return "Incident ongoing — AI diagnostic cached from recent failure evaluation.";
  }

  const diagnostic = await generateIncidentDiagnostic(url, statusCode, errorBody);
  if (diagnostic) {
    diagnosticCooldowns.set(url, now);
  }
  return diagnostic;
}
