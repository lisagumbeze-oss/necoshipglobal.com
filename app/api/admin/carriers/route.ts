import { jsonOk, requirePermission } from "@/lib/api";
import { memoryStore } from "@/lib/repository/memory-store";

export async function GET() {
  const { error } = await requirePermission("fleet.view");
  if (error) return error;
  return jsonOk(memoryStore.carriers);
}
