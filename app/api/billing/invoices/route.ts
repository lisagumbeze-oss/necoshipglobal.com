import { jsonOk, requireSession } from "@/lib/api";
import { ensureUserDemoData } from "@/lib/repository/ensure-demo";
import { memoryStore } from "@/lib/repository/memory-store";

function invoiceStatusLabel(status: string) {
  if (status === "PAID") return "Paid";
  if (status === "OVERDUE") return "Overdue";
  if (status === "DUE") return "Due";
  return status;
}

export async function GET(request: Request) {
  const { session, error } = await requireSession();
  if (error || !session?.user.id) return error!;
  ensureUserDemoData(session.user.id);

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const customerId = searchParams.get("customerId");
  const customerName = (searchParams.get("customer") ?? "").toLowerCase();
  const isAdmin = session.user.role === "admin";

  const customers = memoryStore.customers ?? [];
  const usersById = new Map(memoryStore.users.map((u) => [u.id, u]));

  let invoices = isAdmin
    ? memoryStore.invoices.slice()
    : memoryStore.invoices.filter((i) => i.userId === session.user.id);

  if (status && status !== "All") {
    invoices = invoices.filter(
      (i) => i.status.toUpperCase() === status.toUpperCase() || invoiceStatusLabel(i.status) === status
    );
  }

  const rows = invoices.map((i, idx) => {
    const user = usersById.get(i.userId);
    const customer =
      customers.find((c) => String(c.email ?? "") === (user?.email ?? "")) ??
      (isAdmin ? customers[idx % Math.max(customers.length, 1)] : undefined);

    return {
      id: i.number,
      customer: isAdmin
        ? customer
          ? String(customer.name)
          : user?.companyName || user?.name || user?.email || "Account"
        : "Your account",
      customerId: customer ? String(customer.id) : undefined,
      userId: i.userId,
      amount: i.amountCents / 100,
      status: invoiceStatusLabel(i.status),
      dueAt: i.dueAt,
      paidAt: i.paidAt,
      createdAt: i.createdAt
    };
  });

  let filtered = rows;
  if (isAdmin && customerId) {
    filtered = filtered.filter((r) => r.customerId === customerId);
  }
  if (isAdmin && customerName) {
    filtered = filtered.filter((r) => r.customer.toLowerCase().includes(customerName));
  }

  return jsonOk(filtered);
}
