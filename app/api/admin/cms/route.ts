import { jsonOk, requireAdminSession } from "@/lib/api";
import { ensureGlobalDemoData } from "@/lib/repository/ensure-demo";
import { memoryStore } from "@/lib/repository/memory-store";

export async function GET(request: Request) {
  const { error } = await requireAdminSession();
  if (error) return error;
  ensureGlobalDemoData();

  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") ?? "").toLowerCase();
  const status = searchParams.get("status");

  let promos = memoryStore.promos.map((p) => ({
    id: String(p.id),
    code: String(p.code),
    kind: (p.percentOff != null ? "% Off" : "$ Off") as "% Off" | "$ Off" | "Free Service",
    value: Number(p.percentOff ?? Number(p.amountOffCents ?? 0) / 100),
    expiry: String(p.expiresAt ?? "2026-12-31"),
    usageLimit: Number(p.maxUses ?? 0),
    used: Number(p.usedCount ?? 0),
    status: (p.active ? "Active" : "Draft") as "Draft" | "Active" | "Expired"
  }));

  if (q) promos = promos.filter((p) => `${p.code} ${p.kind}`.toLowerCase().includes(q));
  if (status && status !== "All") promos = promos.filter((p) => p.status === status);

  const posts = memoryStore.blogPosts.map((p) => ({
    id: String(p.id),
    slug: String(p.slug ?? ""),
    title: String(p.title ?? ""),
    excerpt: String(p.excerpt ?? ""),
    category: String(p.category ?? ""),
    status: String(p.status ?? "draft"),
    publishedAt: p.publishedAt != null ? String(p.publishedAt) : null
  }));

  return jsonOk({ promos, posts });
}
