import { jsonOk, requireAdminSession } from "@/lib/api";
import { memoryStore } from "@/lib/repository/memory-store";

export async function GET() {
  const { error } = await requireAdminSession();
  if (error) return error;
  return jsonOk(memoryStore.carriers);
}
