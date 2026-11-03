import { env } from "@/lib/env";
import { logger } from "@/lib/logger";

export async function sendSms(input: { to: string; body: string }) {
  if (!env.twilioAccountSid || !env.twilioAuthToken || !env.twilioFromNumber) {
    logger.info("sms.dev_mode", { to: input.to, body: input.body });
    return { sid: `dev_sms_${Date.now()}`, provider: "dev" as const };
  }

  const auth = Buffer.from(`${env.twilioAccountSid}:${env.twilioAuthToken}`).toString("base64");
  const params = new URLSearchParams({
    To: input.to,
    From: env.twilioFromNumber,
    Body: input.body
  });
  const res = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${env.twilioAccountSid}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: params
    }
  );
  const json = (await res.json()) as { sid?: string; message?: string };
  if (!res.ok) {
    throw new Error(json.message ?? "Twilio SMS failed");
  }
  return { sid: json.sid ?? "unknown", provider: "twilio" as const };
}
