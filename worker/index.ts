export interface Env {
  CRON_SECRET: string;
  APP_URL?: string;
}

export interface ScheduledEventLike {
  cron: string;
  type: string;
  scheduledTime: number;
}

export interface ExecutionContextLike {
  waitUntil(promise: Promise<any>): void;
  passThroughOnException(): void;
}

export default {
  async scheduled(event: ScheduledEventLike, env: Env, ctx: ExecutionContextLike): Promise<void> {
    const appUrl = env.APP_URL || "https://pulseping.subharup.com";
    const targetEndpoint = `${appUrl}/api/cron/ping`;

    console.log(`⏰ [PulsePing Cron Worker] Triggered scheduled event: ${event.cron} at ${new Date().toISOString()}`);

    try {
      const response = await fetch(targetEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${env.CRON_SECRET}`,
        },
      });

      const data = await response.text();
      console.log(`✅ [PulsePing Cron Worker] Endpoint response status: ${response.status}`);
      console.log(`📊 [PulsePing Cron Worker] Payload: ${data}`);
    } catch (error: any) {
      console.error(`❌ [PulsePing Cron Worker] Failed to invoke cron ping API: ${error?.message || String(error)}`);
    }
  },

  async fetch(request: Request, env: Env, ctx: ExecutionContextLike): Promise<Response> {
    return new Response(
      JSON.stringify({
        name: "pulseping-cron-worker",
        status: "active",
        timestamp: new Date().toISOString(),
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  },
};
