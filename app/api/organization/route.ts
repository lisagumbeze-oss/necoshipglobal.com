import { z } from "zod";
import { jsonError, jsonOk, requireSession } from "@/lib/api";
import { memoryStore } from "@/lib/repository/memory-store";

const createSchema = z.object({
  name: z.string().min(2),
  accountType: z.enum(["BUSINESS", "ENTERPRISE"]).default("BUSINESS")
});

const memberSchema = z.object({
  organizationId: z.string(),
  email: z.string().email(),
  role: z.enum(["ORG_ADMIN", "SHIPPER", "BILLING", "VIEWER"]).default("SHIPPER")
});

const costCenterSchema = z.object({
  organizationId: z.string(),
  code: z.string().min(1),
  name: z.string().min(1)
});

export async function GET() {
  const { session, error } = await requireSession();
  if (error || !session?.user.id) return error!;
  const orgs = memoryStore.organizations.filter((o) => o.members.some((m) => m.userId === session.user.id));
  return jsonOk(orgs);
}

export async function POST(request: Request) {
  const { session, error } = await requireSession();
  if (error || !session?.user.id) return error!;
  const body = await request.json().catch(() => null);
  const action = (body as { action?: string } | null)?.action ?? "create";

  if (action === "create") {
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) return jsonError("Invalid org", 400);
    const org = {
      id: `org_${Date.now()}`,
      name: parsed.data.name,
      accountType: parsed.data.accountType,
      creditLimitCents: parsed.data.accountType === "ENTERPRISE" ? 10000000 : 500000,
      members: [{ userId: session.user.id, role: "ORG_ADMIN" }],
      costCenters: [] as Array<{ id: string; code: string; name: string }>
    };
    memoryStore.organizations.push(org);
    return jsonOk(org, { status: 201 });
  }

  if (action === "add_member") {
    const parsed = memberSchema.safeParse(body);
    if (!parsed.success) return jsonError("Invalid member", 400);
    const org = memoryStore.organizations.find((o) => o.id === parsed.data.organizationId);
    if (!org) return jsonError("Org not found", 404);
    org.members.push({ userId: parsed.data.email, role: parsed.data.role });
    return jsonOk(org);
  }

  if (action === "add_cost_center") {
    const parsed = costCenterSchema.safeParse(body);
    if (!parsed.success) return jsonError("Invalid cost center", 400);
    const org = memoryStore.organizations.find((o) => o.id === parsed.data.organizationId);
    if (!org) return jsonError("Org not found", 404);
    org.costCenters.push({ id: `cc_${Date.now()}`, code: parsed.data.code, name: parsed.data.name });
    return jsonOk(org);
  }

  return jsonError("Unknown action", 400);
}
