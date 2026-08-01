export interface IncidentPayload {
  guardName?: string;
  monitorName?: string;
  targetUrl: string;
  responseStatus: number;
  executionTimeMs: number;
  errorMessage?: string | null;
  aiDiagnosis?: string | null;
  logId?: string;
  hmacVerified?: boolean;
}

export interface AlertChannelConfig {
  id?: string;
  providerType: "TELEGRAM" | "DISCORD" | "SLACK" | "EMAIL" | "CUSTOM_WEBHOOK" | string;
  destinationUrl: string;
  userFriendlyName?: string | null;
}
