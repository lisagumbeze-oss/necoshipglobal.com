export type ApiResult<T> = { ok: true; data: T } | { ok: false; error: string; details?: unknown };

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<ApiResult<T>> {
  const res = await fetch(path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {})
    }
  });
  const json = (await res.json().catch(() => null)) as ApiResult<T> | null;
  if (!json) return { ok: false, error: `Request failed (${res.status})` };
  return json;
}
