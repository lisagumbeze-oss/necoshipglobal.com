import { env } from "@/lib/env";
import { logger } from "@/lib/logger";

export async function publishEvent(channel: string, event: string, data: unknown) {
  if (!env.pusherAppId || !env.pusherKey || !env.pusherSecret) {
    logger.info("realtime.dev_mode", { channel, event });
    return { provider: "dev" as const };
  }

  try {
    const mod = await import("pusher" as string).catch(() => null);
    if (!mod) {
      logger.info("realtime.pusher_sdk_missing", { channel, event });
      return { provider: "dev" as const };
    }
    const Pusher = mod.default ?? mod;
    const pusher = new Pusher({
      appId: env.pusherAppId,
      key: env.pusherKey,
      secret: env.pusherSecret,
      cluster: env.pusherCluster,
      useTLS: true
    });
    await pusher.trigger(channel, event, data);
    return { provider: "pusher" as const };
  } catch (error) {
    logger.warn("realtime.pusher_failed", {
      error: error instanceof Error ? error.message : String(error)
    });
    return { provider: "dev" as const };
  }
}

export function trackingChannel(trackingNumber: string) {
  return `tracking-${trackingNumber}`;
}

export function adminOpsChannel() {
  return "admin-ops";
}
