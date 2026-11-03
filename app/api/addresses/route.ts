import { z } from "zod";
import { jsonError, jsonOk, requireSession } from "@/lib/api";
import { ensureUserDemoData } from "@/lib/repository/ensure-demo";
import { memoryStore } from "@/lib/repository/memory-store";

const schema = z.object({
  name: z.string().min(1),
  company: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  line1: z.string().min(1),
  line2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().optional(),
  postalCode: z.string().min(1),
  country: z.string().min(2),
  isDefault: z.boolean().optional()
});

export async function GET() {
  const { session, error } = await requireSession();
  if (error || !session?.user.id) return error!;
  ensureUserDemoData(session.user.id);
  const addresses = memoryStore.addresses.filter((a) => a.userId === session.user.id);
  return jsonOk(
    addresses.map((a) => ({
      id: a.id,
      name: a.name,
      company: a.company,
      country: a.country,
      city: a.city,
      address: [a.line1, a.line2].filter(Boolean).join(", "),
      phone: a.phone,
      isDefault: a.isDefault
    }))
  );
}

export async function POST(request: Request) {
  const { session, error } = await requireSession();
  if (error || !session?.user.id) return error!;
  ensureUserDemoData(session.user.id);
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return jsonError("Invalid address", 400, parsed.error.flatten());

  if (parsed.data.isDefault) {
    memoryStore.addresses.forEach((a) => {
      if (a.userId === session.user.id) a.isDefault = false;
    });
  }

  const address = {
    id: `addr_${Date.now()}`,
    userId: session.user.id,
    ...parsed.data,
    isDefault: Boolean(parsed.data.isDefault)
  };
  memoryStore.addresses.push(address);
  return jsonOk(
    {
      id: address.id,
      name: address.name,
      company: address.company,
      country: address.country,
      city: address.city,
      address: [address.line1, address.line2].filter(Boolean).join(", "),
      phone: address.phone,
      isDefault: address.isDefault
    },
    { status: 201 }
  );
}

export async function DELETE(request: Request) {
  const { session, error } = await requireSession();
  if (error || !session?.user.id) return error!;
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return jsonError("Missing id", 400);
  const idx = memoryStore.addresses.findIndex((a) => a.id === id && a.userId === session.user.id);
  if (idx < 0) return jsonError("Not found", 404);
  memoryStore.addresses.splice(idx, 1);
  return jsonOk({ deleted: true });
}
