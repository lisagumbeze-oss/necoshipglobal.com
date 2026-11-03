import { env } from "@/lib/env";
import { logger } from "@/lib/logger";

export async function sendEmail(input: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}) {
  if (!env.resendApiKey) {
    logger.info("email.dev_mode", { to: input.to, subject: input.subject });
    return { id: `dev_email_${Date.now()}`, provider: "dev" as const };
  }

  const { Resend } = await import("resend");
  const resend = new Resend(env.resendApiKey);
  const result = await resend.emails.send({
    from: env.emailFrom,
    to: input.to,
    subject: input.subject,
    html: input.html,
    text: input.text
  });
  return { id: result.data?.id ?? "unknown", provider: "resend" as const };
}
