'use client'

import useSWR from "swr";

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error("Failed to fetch telemetry");
    return res.json();
  });

export function TelemetryMetrics() {
  const { data, error, isLoading } = useSWR("/api/telemetry", fetcher, {
    refreshInterval: 30000, // Polls every 30s instead of rapid loops
    revalidateOnFocus: false, // Prevents request spikes on tab switching
  });

  if (isLoading) {
    return (
      <div className="p-4 rounded-lg bg-zinc-900/50 animate-pulse text-sm text-zinc-400">
        Loading telemetry data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-lg bg-red-950/30 border border-red-500/20 text-sm text-red-400">
        Unable to load telemetry metrics.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-zinc-300">Live Telemetry Feed</h3>
      <div className="grid gap-2">
        {data?.map(
          (item: {
            id: string;
            statusCode: number;
            latency: number;
            checkedAt: string;
          }) => (
            <div
              key={item.id}
              className="flex justify-between p-2 rounded bg-zinc-900 border border-zinc-800 text-xs"
            >
              <span
                className={
                  item.statusCode === 200 ? "text-emerald-400" : "text-rose-400"
                }
              >
                Status: {item.statusCode}
              </span>
              <span className="text-zinc-400">{item.latency}ms</span>
            </div>
          )
        )}
      </div>
    </div>
  );
}