export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const PORT = process.env.PORT || 3000;
    const LOCAL_PING_URL = `http://127.0.0.1:${PORT}/api/cron/ping`;

    // Set ticker to 10 seconds (10000ms) to support Business Tier 10s resolution
    const TICKER_INTERVAL_MS = 10000;

    console.log("⚡ [PulsePing Engine] Initializing automated 10s background cron ticker...");

    const requestHeaders: RequestInit = {
      headers: {
        "x-internal-cron": "true",
        ...(process.env.CRON_SECRET ? { "x-cron-secret": process.env.CRON_SECRET } : {}),
      },
    };

    fetch(LOCAL_PING_URL, requestHeaders).catch(() => {});

    setInterval(async () => {
      try {
        await fetch(LOCAL_PING_URL, requestHeaders);
      } catch (err) {
        // Silently swallow transient loopback connection hiccups
      }
    }, TICKER_INTERVAL_MS); // 10s interval guarantees ticks fire for Business Tier 10s polling
  }
}