import { z } from "zod";
import { jsonError, jsonOk, requireSession } from "@/lib/api";
import { ensureUserDemoData } from "@/lib/repository/ensure-demo";
import { memoryStore } from "@/lib/repository/memory-store";
import { generateTicketNumber } from "@/lib/tracking-number";

const schema = z.object({
  subject: z.string().min(3),
  shipmentId: z.string().optional(),
  body: z.string().min(3),
  priority: z.union([z.number().int().min(1).max(3), z.enum(["Low", "Normal", "High"])]).optional()
});

function priorityToNumber(p: number | "Low" | "Normal" | "High" | undefined) {
  if (p == null) return 2;
  if (typeof p === "number") return p;
  if (p === "High") return 1;
  if (p === "Low") return 3;
  return 2;
}

export async function GET(request: Request) {
  const { session, error } = await requireSession();
  if (error || !session?.user.id) return error!;
  ensureUserDemoData(session.user.id);
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const q = (searchParams.get("q") ?? "").toLowerCase();
  let tickets =
    session.user.role === "admin"
      ? memoryStore.tickets.slice()
      : memoryStore.tickets.filter((t) => t.userId === session.user.id);
  if (status && status !== "All") tickets = tickets.filter((t) => t.status === status);
  if (q) {
    tickets = tickets.filter((t) => `${t.number} ${t.subject} ${t.shipmentId ?? ""}`.toLowerCase().includes(q));
  }
  return jsonOk(
    tickets.map((t) => ({
      id: t.number,
      subject: t.subject,
      shipmentId: memoryStore.shipments.find((s) => s.id === t.shipmentId)?.trackingNumber ?? t.shipmentId,
      status: t.status,
      createdAt: t.createdAt,
      lastReplyAt: t.messages[t.messages.length - 1]?.createdAt ?? t.updatedAt,
      priority: t.priority,
      messages: t.messages
    }))
  );
}

export async function POST(request: Request) {
  const { session, error } = await requireSession();
  if (error || !session?.user.id) return error!;
  ensureUserDemoData(session.user.id);
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return jsonError("Invalid ticket", 400, parsed.error.flatten());

  const now = new Date().toISOString();
  const ticket = {
    id: `tkt_${Date.now()}`,
    number: generateTicketNumber(),
    userId: session.user.id,
    assigneeId: null,
    shipmentId: parsed.data.shipmentId ?? null,
    subject: parsed.data.subject,
    status: "Open",
    priority: priorityToNumber(parsed.data.priority),
    createdAt: now,
    updatedAt: now,
    messages: [
      {
        id: `msg_${Date.now()}`,
        authorId: session.user.id,
        body: parsed.data.body,
        isInternal: false,
        createdAt: now
      }
    ]
  };
  memoryStore.tickets.unshift(ticket);
  return jsonOk(ticket, { status: 201 });
}
