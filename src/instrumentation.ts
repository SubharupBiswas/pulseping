export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const PORT = process.env.PORT || 3000;
    const LOCAL_PING_URL = `http://127.0.0.1:${PORT}/api/cron/ping`;

    console.log("⚡ [PulsePing Engine] Initializing automated 30s background cron ticker...");

    // Initial ping check on boot
    fetch(LOCAL_PING_URL).catch(() => {});

    // Automated 30-second interval ticker
    setInterval(async () => {
      try {
        await fetch(LOCAL_PING_URL, {
          headers: { "x-internal-cron": "true" },
        });
      } catch (err) {
        // Silently swallow loopback connection hiccups
      }
    }, 30000);
  }
}
