import { generateAIDiagnostic, DiagnosticPayload } from "./ai-diagnostics";

export { generateAIDiagnostic, isThrottled, getCachedDiagnostic, cacheDiagnostic } from "./ai-diagnostics";

export async function generateIncidentDiagnostic(
  promptOrUrl: string,
  statusCode?: number,
  errorBody?: string | null
): Promise<string> {
  const payload: DiagnosticPayload = {
    monitorId: promptOrUrl,
    url: promptOrUrl,
    statusCode: statusCode ?? 500,
    errorBody: errorBody ?? null,
  };
  return generateAIDiagnostic(payload);
}

export async function generateIncidentDiagnosticWithCooldown(
  url: string,
  statusCode: number,
  errorBody: string | null
): Promise<string | null> {
  const payload: DiagnosticPayload = {
    monitorId: url,
    url,
    statusCode,
    errorBody,
  };
  return generateAIDiagnostic(payload);
}
