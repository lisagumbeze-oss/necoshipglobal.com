import { jsonOk, requireAdminSession } from "@/lib/api";
import { ensureGlobalDemoData } from "@/lib/repository/ensure-demo";
import { memoryStore } from "@/lib/repository/memory-store";

export async function GET(request: Request) {
  const { error } = await requireAdminSession();
  if (error) return error;
  ensureGlobalDemoData();

  const status = new URL(request.url).searchParams.get("status");
  const customers = memoryStore.customers ?? [];
  const usersById = new Map(memoryStore.users.map((u) => [u.id, u]));

  let invoices = memoryStore.invoices.map((i, idx) => {
    const user = usersById.get(i.userId);
    const customer =
      customers.find((c) => String(c.email ?? "") === (user?.email ?? "")) ??
      customers[idx % Math.max(customers.length, 1)];
    return {
      id: i.number,
      customer: customer ? String(customer.name) : user?.companyName || user?.name || user?.email || "Account",
      customerId: customer ? String(customer.id) : undefined,
      userId: i.userId,
      amount: i.amountCents / 100,
      status: i.status === "PAID" ? "Paid" : i.status === "OVERDUE" ? "Overdue" : i.status === "DUE" ? "Due" : i.status
    };
  });
  if (status && status !== "All") {
    invoices = invoices.filter((i) => i.status.toLowerCase().includes(status.toLowerCase()));
  }

  const carrierInvoices = memoryStore.carrierInvoices.map((c) => ({
    id: String(c.id),
    carrier: String(c.carrier),
    invoiceNumber: String(c.invoiceNumber),
    amountUsd: Number(c.amountCents ?? 0) / 100,
    matched: Boolean(c.matched),
    varianceUsd: Number(c.varianceCents ?? 0) / 100
  }));

  const refunds = memoryStore.refunds.map((r) => ({
    id: String(r.id),
    trackingNumber: String(r.trackingNumber ?? ""),
    amountUsd: Number(r.amountCents ?? 0) / 100,
    reason: String(r.reason ?? ""),
    status: String(r.status ?? ""),
    createdAt: String(r.createdAt ?? "")
  }));

  return jsonOk({ invoices, carrierInvoices, refunds });
}
