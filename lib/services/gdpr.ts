import { isDatabaseConfigured, prisma } from "@/lib/db";
import { memoryStore } from "@/lib/repository/memory-store";
import { writeAuditLog } from "@/lib/services/audit";
import { logger } from "@/lib/logger";

export type PurgeSummary = {
  userId: string;
  purged: Record<string, number>;
  status: "purged";
  purgedAt: string;
};

/** Irreversible purge of user PII and related operational records from memory (+ Prisma when configured). */
export async function purgeUserData(userId: string, email?: string | null): Promise<PurgeSummary> {
  const purged: Record<string, number> = {};

  const take = <T>(arr: T[], pred: (x: T) => boolean) => {
    const before = arr.length;
    for (let i = arr.length - 1; i >= 0; i--) {
      if (pred(arr[i]!)) arr.splice(i, 1);
    }
    return before - arr.length;
  };

  purged.shipments = take(memoryStore.shipments, (s) => s.userId === userId);
  purged.invoices = take(memoryStore.invoices, (i) => i.userId === userId);
  purged.tickets = take(memoryStore.tickets, (t) => t.userId === userId);
  purged.claims = take(memoryStore.claims, (c) => c.userId === userId);
  purged.notifications = take(memoryStore.notifications, (n) => n.userId === userId);
  purged.addresses = take(memoryStore.addresses, (a) => a.userId === userId);
  purged.documents = take(memoryStore.documents, (d) => d.userId === userId);
  purged.apiKeys = take(memoryStore.apiKeys, (k) => k.userId === userId);
  purged.webhooks = take(memoryStore.webhookEndpoints, (w) => w.userId === userId);
  purged.templates = take(memoryStore.templates, (t) => String((t as { userId?: string }).userId) === userId);
  purged.quotes = take(memoryStore.quotes, (q) => String((q as { userId?: string }).userId) === userId);
  purged.recurring = take(memoryStore.recurringSchedules ?? [], (r) => String(r.userId) === userId);

  if (memoryStore.accountSettings?.[userId]) {
    delete memoryStore.accountSettings[userId];
    purged.settings = 1;
  }
  if (memoryStore.wallets?.[userId] != null) {
    delete memoryStore.wallets[userId];
    purged.wallet = 1;
  }

  purged.users = take(memoryStore.users, (u) => u.id === userId || (email ? u.email === email : false));

  memoryStore.complianceRequests.push({
    id: `cmp_${Date.now()}`,
    userId,
    type: "DELETE",
    status: "COMPLETED",
    summary: purged,
    completedAt: new Date().toISOString()
  });

  if (isDatabaseConfigured()) {
    try {
      await prisma.document.deleteMany({ where: { userId } });
      await prisma.claim.deleteMany({ where: { userId } });
      await prisma.ticket.deleteMany({ where: { userId } });
      await prisma.notification.deleteMany({ where: { userId } });
      await prisma.address.deleteMany({ where: { userId } });
      await prisma.apiKey.deleteMany({ where: { userId } });
      await prisma.webhookEndpoint.deleteMany({ where: { userId } });
      await prisma.invoice.deleteMany({ where: { userId } });
      await prisma.quote.deleteMany({ where: { userId } });
      await prisma.shipment.updateMany({
        where: { userId },
        data: {
          userId: null,
          recipientEmail: null,
          recipientPhone: null,
          recipientName: "REDACTED"
        }
      });
      await prisma.user.deleteMany({ where: { id: userId } });
      purged.prisma = 1;
    } catch (error) {
      logger.error("GDPR prisma purge partial failure", {
        error: error instanceof Error ? error.message : String(error)
      });
      purged.prisma = 0;
    }
  }

  await writeAuditLog({
    userId,
    action: "compliance.delete_purged",
    entityType: "User",
    entityId: userId,
    meta: purged
  });

  return {
    userId,
    purged,
    status: "purged",
    purgedAt: new Date().toISOString()
  };
}
