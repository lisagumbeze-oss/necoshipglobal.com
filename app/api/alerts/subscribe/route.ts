import { z } from "zod";
import { jsonError, jsonOk } from "@/lib/api";
import { sendEmail } from "@/lib/services/email";
import { sendSms } from "@/lib/services/sms";
import { memoryStore } from "@/lib/repository/memory-store";

const schema = z.object({
  trackingNumber: z.string().min(3),
  email: z.string().email().optional(),
  phone: z.string().optional()
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return jsonError("Invalid alert subscription", 400);
  if (!parsed.data.email && !parsed.data.phone) {
    return jsonError("Provide email and/or phone", 400);
  }

  memoryStore.notificationPrefs.push({
    userId: parsed.data.email ?? parsed.data.phone ?? "anonymous",
    eventType: `tracking:${parsed.data.trackingNumber}`,
    email: Boolean(parsed.data.email),
    sms: Boolean(parsed.data.phone),
    push: false
  });

  if (parsed.data.email) {
    await sendEmail({
      to: parsed.data.email,
      subject: `Tracking alerts enabled for ${parsed.data.trackingNumber}`,
      html: `<p>You will receive email updates for ${parsed.data.trackingNumber}.</p>`
    });
  }
  if (parsed.data.phone) {
    await sendSms({
      to: parsed.data.phone,
      body: `NecoShip alerts enabled for ${parsed.data.trackingNumber}`
    });
  }

  return jsonOk({ subscribed: true });
}
