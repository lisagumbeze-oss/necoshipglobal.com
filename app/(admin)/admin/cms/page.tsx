"use client";

import { useMemo, useState } from "react";
import { useQuery } from "react-query";
import { Badge, Button, Card, Input } from "@/components/design-system/ui";
import { blogPosts, type BlogPost } from "@/lib/blog-posts";
import { apiQuery } from "@/lib/query-api";
import { CalendarClock, Image as ImageIcon, Plus, Search, Sparkles, Tag, Upload } from "lucide-react";
import { useToast } from "@/components/feedback/toast-provider";

type PromoCodeRecord = {
  id: string;
  code: string;
  kind: "% Off" | "$ Off" | "Free Service";
  value: number;
  expiry: string;
  usageLimit: number;
  used: number;
  status: "Draft" | "Active" | "Expired";
};

type Tab = "Blog" | "Promotions";

export default function CmsPage() {
  const { pushToast } = useToast();
  const [tab, setTab] = useState<Tab>("Blog");

  // Blog editor state (prototype)
  const [q, setQ] = useState("");
  const [activeSlug, setActiveSlug] = useState(blogPosts[0]!.slug);
  const activePost = useMemo(() => blogPosts.find((p) => p.slug === activeSlug) ?? blogPosts[0]!, [activeSlug]);

  const [title, setTitle] = useState(activePost.title);
  const [excerpt, setExcerpt] = useState(activePost.excerpt);
  const [seoTitle, setSeoTitle] = useState(activePost.title);
  const [seoDesc, setSeoDesc] = useState(activePost.excerpt);
  const [body, setBody] = useState(activePost.body.join("\n\n"));
  const [status, setStatus] = useState<"Draft" | "Published" | "Scheduled">("Draft");
  const [scheduleAt, setScheduleAt] = useState("2026-05-01 09:00 UTC");

  const filteredPosts = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return blogPosts;
    return blogPosts.filter((p) => `${p.title} ${p.category} ${p.author.name}`.toLowerCase().includes(s));
  }, [q]);

  // Promo codes
  const [promoQ, setPromoQ] = useState("");
  const [promoStatus, setPromoStatus] = useState<"All" | "Draft" | "Active" | "Expired">("All");
  const promoQuery = useQuery(["admin-promos", promoQ, promoStatus], async () => {
    const params = new URLSearchParams();
    if (promoQ) params.set("q", promoQ);
    if (promoStatus !== "All") params.set("status", promoStatus);
    const qs = params.toString();
    const data = await apiQuery<{ promos: PromoCodeRecord[] }>(`/api/admin/cms${qs ? `?${qs}` : ""}`);
    return data.promos;
  });

  const onSelectPost = (p: BlogPost) => {
    setActiveSlug(p.slug);
    setTitle(p.title);
    setExcerpt(p.excerpt);
    setSeoTitle(p.title);
    setSeoDesc(p.excerpt);
    setBody(p.body.join("\n\n"));
    setStatus("Draft");
  };

  return (
    <main className="min-h-screen bg-brand-surface p-4 md:p-8">
      <section className="mx-auto max-w-7xl space-y-4">
        <header className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-display text-3xl font-bold text-brand-navy">CMS: Blog & Promotions</h1>
            <p className="text-sm text-slate-600">Create, publish, schedule content and manage promo codes (prototype).</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" type="button" onClick={() => pushToast({ tone: "info", title: "Media uploader opened" })}>
              <Upload size={16} aria-hidden /> Media
            </Button>
            <Button
              type="button"
              onClick={() =>
                pushToast({ tone: "info", title: tab === "Blog" ? "Blog post creator opened" : "Promotion creator opened" })
              }
            >
              <Plus size={16} aria-hidden /> Create {tab === "Blog" ? "Post" : "Promotion"}
            </Button>
          </div>
        </header>

        <Card className="flex flex-wrap gap-2">
          {(["Blog", "Promotions"] as const).map((t) => (
            <button
              key={t}
              type="button"
              className={`focus-ring rounded-button px-3 py-2 text-sm font-semibold ${
                tab === t ? "bg-brand-navy text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
              onClick={() => setTab(t)}
              aria-pressed={tab === t}
            >
              {t}
            </button>
          ))}
        </Card>

        {tab === "Blog" ? (
          <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
            <div className="space-y-3">
              <Card className="space-y-2">
                <div className="flex items-center gap-2 font-semibold text-brand-navy">
                  <Search size={16} aria-hidden /> Posts
                </div>
                <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search title, category, author…" />
                <Badge tone="default">{filteredPosts.length} posts</Badge>
              </Card>

              <Card className="overflow-hidden p-0">
                <div className="divide-y divide-slate-200">
                  {filteredPosts.map((p) => (
                    <button
                      key={p.slug}
                      type="button"
                      className={`w-full px-4 py-3 text-left text-sm hover:bg-slate-50 focus-ring ${p.slug === activeSlug ? "bg-slate-50" : ""}`}
                      onClick={() => onSelectPost(p)}
                    >
                      <p className="font-semibold text-brand-navy">{p.title}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        <span className="inline-flex items-center gap-1">
                          <Tag size={12} aria-hidden /> {p.category}
                        </span>{" "}
                        · {p.publishedAt} · {p.author.name}
                      </p>
                    </button>
                  ))}
                </div>
              </Card>
            </div>

            <div className="space-y-4">
              <Card className="space-y-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs text-slate-500">Editor</p>
                    <p className="font-semibold text-brand-navy">{activePost.slug}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone={status === "Published" ? "success" : status === "Scheduled" ? "warning" : "default"}>{status}</Badge>
                    <Button variant="secondary" type="button" onClick={() => pushToast({ tone: "info", title: "Post preview opened" })}>
                      Preview
                    </Button>
                    <Button type="button" onClick={() => pushToast({ tone: "success", title: "Draft saved" })}>
                      Save draft
                    </Button>
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <label className="text-xs font-semibold text-slate-600 md:col-span-2">
                    Title
                    <Input value={title} onChange={(e) => setTitle(e.target.value)} />
                  </label>
                  <label className="text-xs font-semibold text-slate-600 md:col-span-2">
                    Excerpt
                    <Input value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />
                  </label>
                  <label className="text-xs font-semibold text-slate-600">
                    SEO title
                    <Input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} />
                  </label>
                  <label className="text-xs font-semibold text-slate-600">
                    SEO description
                    <Input value={seoDesc} onChange={(e) => setSeoDesc(e.target.value)} />
                  </label>
                </div>

                <label className="text-xs font-semibold text-slate-600">
                  Body (rich text prototype)
                  <textarea
                    className="mt-1 min-h-[220px] w-full rounded-input border border-slate-300 bg-white p-3 text-sm focus-ring"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                  />
                </label>

                <div className="grid gap-3 md:grid-cols-2">
                  <Button variant="secondary" type="button" onClick={() => pushToast({ tone: "info", title: "Image uploader opened" })}>
                    <ImageIcon size={16} aria-hidden /> Add image
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      setStatus("Published");
                      pushToast({ tone: "success", title: "Post published" });
                    }}
                  >
                    Publish now
                  </Button>
                </div>

                <div className="rounded-input border border-slate-200 bg-slate-50 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-brand-navy">
                      <CalendarClock size={16} aria-hidden className="mr-2 inline-block" />
                      Schedule publishing
                    </p>
                    <Badge tone="default">Optional</Badge>
                  </div>
                  <div className="mt-2 grid gap-2 md:grid-cols-2">
                    <Input value={scheduleAt} onChange={(e) => setScheduleAt(e.target.value)} />
                    <Button
                      variant="secondary"
                      type="button"
                      onClick={() => {
                        setStatus("Scheduled");
                        pushToast({ tone: "success", title: "Post scheduled", message: scheduleAt });
                      }}
                    >
                      Schedule
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
            <div className="space-y-3">
              <Card className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Input value={promoQ} onChange={(e) => setPromoQ(e.target.value)} placeholder="Search code or kind…" />
                  <select
                    className="rounded-input border border-slate-200 bg-white px-3 py-2 text-sm focus-ring"
                    value={promoStatus}
                    onChange={(e) => setPromoStatus(e.target.value as never)}
                    aria-label="Promo status"
                  >
                    <option value="All">All</option>
                    <option value="Draft">Draft</option>
                    <option value="Active">Active</option>
                    <option value="Expired">Expired</option>
                  </select>
                </div>
                <Badge tone="default">{(promoQuery.data ?? []).length} codes</Badge>
              </Card>

              <Card className="overflow-hidden p-0">
                <div className="grid grid-cols-12 gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-600">
                  <div className="col-span-3">Code</div>
                  <div className="col-span-3">Type</div>
                  <div className="col-span-2">Expiry</div>
                  <div className="col-span-2 text-right">Usage</div>
                  <div className="col-span-2 text-right">Status</div>
                </div>
                {promoQuery.isLoading ? (
                  <div className="space-y-2 p-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-10 animate-pulse rounded-input bg-slate-100" />
                    ))}
                  </div>
                ) : promoQuery.isError ? (
                  <div className="p-4 text-sm text-red-700">Failed to load promo codes.</div>
                ) : (promoQuery.data ?? []).length === 0 ? (
                  <div className="p-6 text-sm text-slate-600">No promo codes match your filters.</div>
                ) : (
                  <div className="divide-y divide-slate-200">
                    {(promoQuery.data ?? []).map((p) => (
                      <div key={p.id} className="grid grid-cols-12 items-center gap-2 px-4 py-3 text-sm">
                        <div className="col-span-3 font-mono font-semibold text-brand-navy">{p.code}</div>
                        <div className="col-span-3 text-slate-700">
                          {p.kind} {p.kind === "Free Service" ? "" : p.kind === "% Off" ? `${p.value}%` : `$${p.value}`}
                        </div>
                        <div className="col-span-2 text-xs text-slate-500">{p.expiry}</div>
                        <div className="col-span-2 text-right text-slate-700">
                          {p.used}/{p.usageLimit}
                        </div>
                        <div className="col-span-2 flex justify-end">
                          <Badge tone={p.status === "Active" ? "success" : p.status === "Expired" ? "default" : "warning"}>{p.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>

            <div className="space-y-4">
              <Card className="space-y-2">
                <div className="flex items-center gap-2 font-semibold text-brand-navy">
                  <Sparkles size={16} aria-hidden /> Promotion builder
                </div>
                <div className="rounded-card border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-600">
                  Configure eligibility (services, regions), usage limits, and expiry. Reporting shows usage over time (prototype).
                </div>
                <Button type="button" onClick={() => pushToast({ tone: "info", title: "Promotion wizard opened" })}>
                  Create promotion
                </Button>
              </Card>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
