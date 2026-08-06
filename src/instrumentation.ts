export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const PORT = process.env.PORT || 3000;
    const LOCAL_PING_URL = `http://127.0.0.1:${PORT}/api/cron/ping`;

    console.log("⚡ [PulsePing Engine] Initializing automated 30s background cron ticker...");

    const requestHeaders: RequestInit = {
      headers: {
        "x-internal-cron": "true",
        ...(process.env.CRON_SECRET ? { "Authorization": `Bearer ${process.env.CRON_SECRET}` } : {}),
      },
    };

    // 1. Initial boot ping (with headers)
    fetch(LOCAL_PING_URL, requestHeaders).catch(() => {});

    // 2. Automated 30-second interval ticker
    setInterval(async () => {
      try {
        await fetch(LOCAL_PING_URL, requestHeaders);
      } catch (err) {
        // Silently swallow loopback connection hiccups
      }
    }, 30000);
  }
}