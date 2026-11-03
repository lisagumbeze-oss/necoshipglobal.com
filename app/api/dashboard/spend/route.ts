import { jsonOk, requireSession } from "@/lib/api";
import { ensureUserDemoData, ensureGlobalDemoData } from "@/lib/repository/ensure-demo";
import { memoryStore } from "@/lib/repository/memory-store";

export async function GET() {
  const { session, error } = await requireSession();
  if (error || !session?.user.id) return error!;
  ensureUserDemoData(session.user.id);
  ensureGlobalDemoData();
  const series =
    (memoryStore as { spendSeries?: Array<{ month: string; spendUsd: number }> }).spendSeries ?? [];
  return jsonOk(series);
}
