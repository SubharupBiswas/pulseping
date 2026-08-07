/**
 * 3-Tier AI Provider Waterfall Engine + 15-Minute Cooldown Throttling
 *
 * Priority 1: Google Gemini API (gemini-2.5-flash)
 * Priority 2: OmniRoute AI Gateway (https://api.omniroute.ai/v1/chat/completions or custom OMNIROUTE_BASE_URL)
 * Priority 3: Groq API (llama-3.3-70b-versatile)
 * Priority 4: Graceful Fallback string
 */

export interface DiagnosticPayload {
  monitorId: string;
  url: string;
  statusCode: number;
  errorBody?: string | null;
}

const GEMINI_REST_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";
const GROQ_REST_URL = "https://api.groq.com/openai/v1/chat/completions";

function getOmniRouteUrl(): string {
  const baseUrl = process.env.OMNIROUTE_BASE_URL?.trim();
  if (baseUrl) {
    const cleanBase = baseUrl.replace(/\/$/, "");
    return cleanBase.endsWith("/chat/completions") ? cleanBase : `${cleanBase}/chat/completions`;
  }
  return "https://api.omniroute.ai/v1/chat/completions";
}

// 15-Minute Cooldown Cache per monitorId
const diagnosticCooldownCache = new Map<string, { diagnostic: string; timestamp: number }>();
const COOLDOWN_MS = 15 * 60 * 1000; // 15 minutes

export function isThrottled(monitorId: string): boolean {
  const cached = diagnosticCooldownCache.get(monitorId);
  if (!cached) return false;
  return Date.now() - cached.timestamp < COOLDOWN_MS;
}

export function getCachedDiagnostic(monitorId: string): string | null {
  const cached = diagnosticCooldownCache.get(monitorId);
  if (cached && Date.now() - cached.timestamp < COOLDOWN_MS) {
    return cached.diagnostic;
  }
  return null;
}

export function cacheDiagnostic(monitorId: string, diagnostic: string) {
  diagnosticCooldownCache.set(monitorId, {
    diagnostic,
    timestamp: Date.now(),
  });
}

function buildPrompt(url: string, statusCode: number, errorBody?: string | null): string {
  const statusStr = statusCode === 0 ? "Connection Timeout / Network Failure" : `HTTP ${statusCode}`;
  return `You are a site reliability engineering assistant. An uptime monitor just detected an outage.

Target URL: ${url}
HTTP Status Code: ${statusStr}
Error Response Body: ${errorBody ?? "No response body captured"}

Provide a concise single-sentence (max 25 words) root-cause summary of this incident for a developer. Be technical, direct, and practical. Do not start with "The" or repeat the URL.`;
}

// Priority 1: Gemini
async function callGemini(payload: DiagnosticPayload): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) throw new Error("GEMINI_API_KEY missing");

  const prompt = buildPrompt(payload.url, payload.statusCode, payload.errorBody);
  const res = await fetch(`${GEMINI_REST_URL}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { maxOutputTokens: 100, temperature: 0.3 },
    }),
  });

  if (!res.ok) {
    throw new Error(`Gemini HTTP ${res.status}`);
  }

  const data = await res.json();
  const text: string | undefined = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text || !text.trim()) {
    throw new Error("Gemini returned empty response");
  }
  return text.trim().slice(0, 280);
}

// Priority 2: OmniRoute AI Gateway
async function callOmniRoute(payload: DiagnosticPayload): Promise<string> {
  const apiKey = process.env.OMNIROUTE_API_KEY?.trim();
  if (!apiKey) throw new Error("OMNIROUTE_API_KEY missing");

  const prompt = buildPrompt(payload.url, payload.statusCode, payload.errorBody);
  const omniUrl = getOmniRouteUrl();
  const res = await fetch(omniUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gemini-1.5-flash",
      messages: [
        {
          role: "system",
          content: "You are a DevOps engineer providing 1-sentence incident root cause diagnostics.",
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 100,
      temperature: 0.3,
    }),
  });

  if (!res.ok) {
    throw new Error(`OmniRoute HTTP ${res.status}`);
  }

  const data = await res.json();
  const content: string | undefined = data?.choices?.[0]?.message?.content;
  if (!content || !content.trim()) {
    throw new Error("OmniRoute returned empty response");
  }
  return content.trim().slice(0, 280);
}

// Priority 3: Groq API
async function callGroq(payload: DiagnosticPayload): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY?.trim();
  if (!apiKey) throw new Error("GROQ_API_KEY missing");

  const prompt = buildPrompt(payload.url, payload.statusCode, payload.errorBody);
  const res = await fetch(GROQ_REST_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are an expert DevOps engineer providing 1-sentence root-cause diagnostics for API outages.",
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 120,
      temperature: 0.3,
    }),
  });

  if (!res.ok) {
    throw new Error(`Groq HTTP ${res.status}`);
  }

  const data = await res.json();
  const content: string | undefined = data?.choices?.[0]?.message?.content;
  if (!content || !content.trim()) {
    throw new Error("Groq returned empty response");
  }
  return content.trim().slice(0, 280);
}

export async function generateAIDiagnostic(payload: DiagnosticPayload): Promise<string> {
  const key = payload.monitorId || payload.url;

  // 1. Check 15-minute cooldown cache
  const cached = getCachedDiagnostic(key);
  if (cached) {
    console.log(`[AI_THROTTLE] 15-min cooldown active for ${key}. Returning cached diagnostic.`);
    return cached;
  }

  // 2. Priority 1: Gemini
  if (process.env.GEMINI_API_KEY?.trim()) {
    try {
      const result = await callGemini(payload);
      cacheDiagnostic(key, result);
      return result;
    } catch (err: any) {
      console.warn("[AI_WATERFALL] Gemini primary rate limited or failed, attempting OmniRoute...", err?.message || err);
    }
  } else {
    console.warn("⚠️ [AI Diagnostics] Gemini API key unconfigured. Attempting Tier 2 (OmniRoute)...");
  }

  // 3. Priority 2: OmniRoute
  const omniRouteKey = process.env.OMNIROUTE_API_KEY?.trim();
  if (omniRouteKey) {
    try {
      const result = await callOmniRoute(payload);
      cacheDiagnostic(key, result);
      return result;
    } catch (err: any) {
      console.warn("[AI_WATERFALL] OmniRoute failed, attempting Groq...", err?.message || err);
    }
  } else {
    console.warn("⚠️ [AI Diagnostics] OmniRoute API key unconfigured. Routing to Tier 3 (Groq)...");
  }

  // 4. Priority 3: Groq
  if (process.env.GROQ_API_KEY?.trim()) {
    try {
      const result = await callGroq(payload);
      cacheDiagnostic(key, result);
      return result;
    } catch (err: any) {
      console.error("[AI_WATERFALL] All AI providers failed or rate-limited:", err?.message || err);
    }
  } else {
    console.warn("⚠️ [AI Diagnostics] Groq API key unconfigured. Falling back to default incident message.");
  }

  // 5. Priority 4: Graceful Fallback
  const codeStr = payload.statusCode === 0 ? "TIMEOUT" : `${payload.statusCode}`;
  const fallback = `Incident detected (HTTP ${codeStr}). AI diagnostics throttled — next automated evaluation queued.`;
  cacheDiagnostic(key, fallback);
  return fallback;
}
