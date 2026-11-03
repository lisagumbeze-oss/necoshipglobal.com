import { jsonOk, requireSession } from "@/lib/api";
import { ensureGlobalDemoData, ensureUserDemoData } from "@/lib/repository/ensure-demo";
import { memoryStore } from "@/lib/repository/memory-store";

export async function GET() {
  const { session, error } = await requireSession();
  if (error || !session?.user.id) return error!;
  ensureUserDemoData(session.user.id);
  ensureGlobalDemoData();
  return jsonOk((memoryStore as { apiUsage?: Array<{ day: string; calls: number }> }).apiUsage ?? []);
}
