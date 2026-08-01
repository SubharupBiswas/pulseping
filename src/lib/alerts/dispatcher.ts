import { IncidentPayload, AlertChannelConfig } from "@/types/alert";
import { sendDiscordAlert } from "./discord";
import { sendSlackAlert } from "./slack";
import { sendTelegramAlert } from "./telegram";
import { sendEmailAlert } from "./email";

export async function dispatchAlerts(incident: IncidentPayload, channels: AlertChannelConfig[]): Promise<PromiseSettledResult<boolean>[]> {
  const tasks = channels.map(async (channel) => {
    switch (channel.providerType.toUpperCase()) {
      case "DISCORD":
        return sendDiscordAlert(incident, channel.destinationUrl);
      case "SLACK":
        return sendSlackAlert(incident, channel.destinationUrl);
      case "TELEGRAM":
        return sendTelegramAlert(incident, channel.destinationUrl);
      case "EMAIL":
        return sendEmailAlert(incident, channel.destinationUrl);
      case "CUSTOM_WEBHOOK":
        try {
          const res = await fetch(channel.destinationUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(incident),
          });
          return res.ok;
        } catch {
          return false;
        }
      default:
        return false;
    }
  });

  return Promise.allSettled(tasks);
}
