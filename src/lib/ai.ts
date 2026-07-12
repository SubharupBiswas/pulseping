/**
 * AI Incident Root-Cause Diagnostic Utility (Pillar 4)
 *
 * Uses the Gemini REST API directly via fetch — no SDK required.
 * All errors are caught internally; this function never throws.
 * Requires GEMINI_API_KEY env variable.
 */

const GEMINI_REST_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

export async function generateIncidentDiagnostic(
  url: string,
  statusCode: number,
  errorBody: string | null
): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  try {
    const prompt = `You are a site reliability engineering assistant. A monitoring system just detected a failure.

Target URL: ${url}
HTTP Status Code: ${statusCode === 0 ? "Connection Timeout / Network Failure" : statusCode}
Error Response Body (first 500 chars): ${errorBody ?? "No response body captured"}

Produce a single concise sentence (max 20 words) summarizing the most likely root cause of this incident for a developer. Be technical but direct. Do not start with "The" or repeat the URL.`;

    const response = await fetch(`${GEMINI_REST_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 80, temperature: 0.3 },
      }),
    });

    if (!response.ok) return null;

    const data = await response.json();
    const text: string | undefined =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) return null;
    return text.trim().slice(0, 280);
  } catch (err) {
    console.warn("AI diagnostic generation failed (non-blocking):", err);
    return null;
  }
}
