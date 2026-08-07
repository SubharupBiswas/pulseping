export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const PORT = process.env.PORT || 3000;
    const LOCAL_PING_URL = `http://127.0.0.1:${PORT}/api/cron/ping`;

    console.log("⚡ [PulsePing Engine] Initializing automated 25s background cron ticker...");

    const requestHeaders: RequestInit = {
      headers: {
        "x-internal-cron": "true",
        ...(process.env.CRON_SECRET ? { Authorization: `Bearer ${process.env.CRON_SECRET}` } : {}),
      },
    };

    fetch(LOCAL_PING_URL, requestHeaders).catch(() => {});

    setInterval(async () => {
      try {
        await fetch(LOCAL_PING_URL, requestHeaders);
      } catch (err) {
        // Silently swallow transient loopback connection hiccups
      }
    }, 25000); // 25s interval guarantees ticks fire before 30s threshold
  }
}