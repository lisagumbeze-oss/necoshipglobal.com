import { jsonOk, requireAdminSession } from "@/lib/api";
import { ensureGlobalDemoData } from "@/lib/repository/ensure-demo";
import { runCarrierInvoiceReconciliation } from "@/lib/services/reconciliation";

export async function POST() {
  const { error } = await requireAdminSession();
  if (error) return error;
  ensureGlobalDemoData();
  const results = runCarrierInvoiceReconciliation();
  return jsonOk({
    ranAt: new Date().toISOString(),
    matched: results.filter((r) => r.status === "MATCHED").length,
    variance: results.filter((r) => r.status === "VARIANCE").length,
    unmatched: results.filter((r) => r.status === "UNMATCHED").length,
    results
  });
}
