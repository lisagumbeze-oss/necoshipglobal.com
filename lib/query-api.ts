import { apiFetch } from "@/lib/client-api";

/** Unwrap apiFetch for react-query (throws on error). */
export async function apiQuery<T>(path: string, init?: RequestInit): Promise<T> {
  const result = await apiFetch<T>(path, init);
  if (!result.ok) throw new Error(result.error);
  return result.data;
}

export function titleStatus(status: string) {
  return status
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
