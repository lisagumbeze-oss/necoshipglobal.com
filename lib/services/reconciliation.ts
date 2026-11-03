import { memoryStore } from "@/lib/repository/memory-store";

export type ReconciliationResult = {
  invoiceId: string;
  carrier: string;
  invoiceNumber: string;
  amountCents: number;
  matchedShipmentIds: string[];
  expectedCents: number;
  varianceCents: number;
  matched: boolean;
  status: "MATCHED" | "VARIANCE" | "UNMATCHED";
};

/** Match carrier invoices to shipments by carrier + amount proximity / open costs. */
export function runCarrierInvoiceReconciliation(): ReconciliationResult[] {
  const results: ReconciliationResult[] = [];
  const invoices = memoryStore.carrierInvoices;

  for (const inv of invoices) {
    const carrier = String(inv.carrier ?? "");
    const amountCents = Number(inv.amountCents ?? 0);
    const candidates = memoryStore.shipments.filter(
      (s) => (s.carrier ?? "").toLowerCase().includes(carrier.toLowerCase()) || carrier.toLowerCase().includes((s.carrier ?? "").toLowerCase())
    );

    // Prefer unmatched shipment costs summing near invoice amount
    let remaining = amountCents;
    const matched: string[] = [];
    let expected = 0;
    for (const s of candidates) {
      if ((s as { reconInvoiceId?: string }).reconInvoiceId) continue;
      const cost = s.amountCents ?? 0;
      if (cost <= 0) continue;
      if (remaining - cost < -Math.max(500, amountCents * 0.05) && matched.length > 0) continue;
      matched.push(s.id);
      expected += cost;
      remaining -= cost;
      (s as { reconInvoiceId?: string }).reconInvoiceId = String(inv.id);
      if (remaining <= 250) break;
    }

    const varianceCents = amountCents - expected;
    const matchedFlag = Math.abs(varianceCents) <= Math.max(100, amountCents * 0.02);
    const status: ReconciliationResult["status"] =
      matched.length === 0 ? "UNMATCHED" : matchedFlag ? "MATCHED" : "VARIANCE";

    inv.matched = matchedFlag;
    inv.varianceCents = varianceCents;
    inv.reconciledAt = new Date().toISOString();
    inv.matchedShipmentIds = matched;
    inv.reconciliationStatus = status;

    results.push({
      invoiceId: String(inv.id),
      carrier,
      invoiceNumber: String(inv.invoiceNumber ?? inv.id),
      amountCents,
      matchedShipmentIds: matched,
      expectedCents: expected,
      varianceCents,
      matched: matchedFlag,
      status
    });
  }

  return results;
}
