"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { Badge, Button, Card, Input } from "@/components/design-system/ui";
import { apiQuery } from "@/lib/query-api";
import { Bell, CheckCheck, Filter, Mail, MessageSquareText, Moon, Smartphone, Zap } from "lucide-react";

type NotificationCategory = "Shipment Updates" | "Billing" | "System" | "Promotions";
type NotificationRecord = {
  id: string;
  category: NotificationCategory | string;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  href?: string;
};

const categories: Array<{ label: string; value: "All" | NotificationCategory }> = [
  { label: "All", value: "All" },
  { label: "Shipment", value: "Shipment Updates" },
  { label: "Billing", value: "Billing" },
  { label: "System", value: "System" },
  { label: "Promotions", value: "Promotions" }
];

function categoryTone(cat: string) {
  if (cat === "Billing") return "warning";
  if (cat === "System") return "default";
  if (cat === "Promotions") return "success";
  return "default";
}

export default function NotificationsPage() {
  const [category, setCategory] = useState<(typeof categories)[number]["value"]>("All");
  const [q, setQ] = useState("");

  const [prefEmail, setPrefEmail] = useState(true);
  const [prefSms, setPrefSms] = useState(false);
  const [prefPush, setPrefPush] = useState(true);
  const [dndEnabled, setDndEnabled] = useState(false);
  const [dndFrom, setDndFrom] = useState("22:00");
  const [dndTo, setDndTo] = useState("07:00");

  const feedQuery = useQuery(["notifications", category], () => {
    const qs = category === "All" ? "" : `?category=${encodeURIComponent(category)}`;
    return apiQuery<NotificationRecord[]>(`/api/notifications${qs}`);
  });

  const markAll = useMutation(
    () => apiQuery("/api/notifications", { method: "PATCH", body: JSON.stringify({ markAllRead: true }) }),
    {
      onSuccess: async () => {
        await feedQuery.refetch();
      }
    }
  );

  const items = useMemo(() => {
    const list = feedQuery.data ?? [];
    if (!q.trim()) return list;
    const s = q.trim().toLowerCase();
    return list.filter((n) => `${n.title} ${n.message} ${n.category}`.toLowerCase().includes(s));
  }, [feedQuery.data, q]);

  const unreadCount = items.filter((n) => !n.read).length;

  return (
    <main className="min-h-screen bg-brand-surface p-4 md:p-8">
      <section className="mx-auto max-w-7xl space-y-4">
        <header className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-display text-3xl font-bold text-brand-navy">Notifications Center</h1>
            <p className="text-sm text-slate-600">Shipment, billing, system, and promotional alerts—one feed.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="secondary"
              type="button"
              onClick={() => markAll.mutate()}
              disabled={markAll.isLoading || feedQuery.isLoading || unreadCount === 0}
            >
              <CheckCheck size={16} aria-hidden /> Mark all read
            </Button>
          </div>
        </header>

        <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
          <div className="space-y-3">
            <Card className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <Input placeholder="Search notifications…" value={q} onChange={(e) => setQ(e.target.value)} />
                <select
                  className="rounded-input border border-slate-200 bg-white px-3 py-2 text-sm focus-ring"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as never)}
                  aria-label="Filter by category"
                >
                  {categories.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <Badge tone={unreadCount > 0 ? "warning" : "success"}>{unreadCount} unread</Badge>
                <Badge tone="default">{items.length} total</Badge>
              </div>
            </Card>

            <Card className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-brand-navy">
                  <Bell size={16} aria-hidden /> Activity feed
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Filter size={14} aria-hidden />
                  Sorted by latest
                </div>
              </div>

              {feedQuery.isLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-16 animate-pulse rounded-input bg-slate-100" />
                  ))}
                </div>
              ) : feedQuery.isError ? (
                <div className="text-sm text-red-700">Failed to load notifications. Please try again.</div>
              ) : items.length === 0 ? (
                <div className="rounded-card border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-600">
                  No notifications match your filters.
                </div>
              ) : (
                <div className="divide-y divide-slate-200 overflow-hidden rounded-card border border-slate-200 bg-white">
                  {items.map((n) => (
                    <div key={n.id} className="flex items-start justify-between gap-3 px-4 py-3">
                      <div className="flex min-w-0 gap-3">
                        <div
                          className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${
                            n.read ? "bg-slate-300" : "bg-emerald-500"
                          }`}
                          aria-label={n.read ? "Read" : "Unread"}
                        />
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="truncate font-semibold text-brand-navy">{n.title}</p>
                            <Badge tone={categoryTone(n.category)}>{n.category}</Badge>
                          </div>
                          <p className="mt-1 line-clamp-2 text-sm text-slate-600">{n.message}</p>
                          <p className="mt-2 text-xs text-slate-500">{n.createdAt}</p>
                        </div>
                      </div>
                      <div className="shrink-0">
                        {n.href ? (
                          <Link
                            href={n.href as never}
                            className="focus-ring rounded-button bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200"
                          >
                            Open
                          </Link>
                        ) : (
                          <span className="text-xs text-slate-400">—</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="space-y-3">
              <p className="font-semibold text-brand-navy">Channel preferences</p>
              <p className="text-sm text-slate-600">Pick how you’d like to receive important updates (prototype).</p>

              <div className="grid gap-2">
                <button
                  type="button"
                  className={`focus-ring flex items-center justify-between rounded-input border px-3 py-3 text-left text-sm ${
                    prefEmail ? "border-brand-navy bg-white" : "border-slate-200 bg-white"
                  }`}
                  onClick={() => setPrefEmail((v) => !v)}
                  aria-pressed={prefEmail}
                >
                  <span className="flex items-center gap-2 font-semibold text-brand-navy">
                    <Mail size={16} aria-hidden /> Email
                  </span>
                  <Badge tone={prefEmail ? "success" : "default"}>{prefEmail ? "On" : "Off"}</Badge>
                </button>

                <button
                  type="button"
                  className={`focus-ring flex items-center justify-between rounded-input border px-3 py-3 text-left text-sm ${
                    prefSms ? "border-brand-navy bg-white" : "border-slate-200 bg-white"
                  }`}
                  onClick={() => setPrefSms((v) => !v)}
                  aria-pressed={prefSms}
                >
                  <span className="flex items-center gap-2 font-semibold text-brand-navy">
                    <MessageSquareText size={16} aria-hidden /> SMS
                  </span>
                  <Badge tone={prefSms ? "success" : "default"}>{prefSms ? "On" : "Off"}</Badge>
                </button>

                <button
                  type="button"
                  className={`focus-ring flex items-center justify-between rounded-input border px-3 py-3 text-left text-sm ${
                    prefPush ? "border-brand-navy bg-white" : "border-slate-200 bg-white"
                  }`}
                  onClick={() => setPrefPush((v) => !v)}
                  aria-pressed={prefPush}
                >
                  <span className="flex items-center gap-2 font-semibold text-brand-navy">
                    <Smartphone size={16} aria-hidden /> Push
                  </span>
                  <Badge tone={prefPush ? "success" : "default"}>{prefPush ? "On" : "Off"}</Badge>
                </button>
              </div>

              <div className="rounded-input border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
                <span className="inline-flex items-center gap-1 font-semibold text-slate-700">
                  <Zap size={14} aria-hidden /> Tip:
                </span>{" "}
                Enable SMS for delivery exceptions and customs holds.
              </div>
            </Card>

            <Card className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-brand-navy">Do not disturb</p>
                  <p className="text-sm text-slate-600">Silence non-critical notifications during quiet hours.</p>
                </div>
                <button
                  type="button"
                  className={`focus-ring rounded-full px-3 py-2 text-xs font-semibold ${
                    dndEnabled ? "bg-brand-navy text-white" : "bg-slate-200 text-slate-800"
                  }`}
                  onClick={() => setDndEnabled((v) => !v)}
                  aria-pressed={dndEnabled}
                >
                  {dndEnabled ? "Enabled" : "Off"}
                </button>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <label className="text-xs font-semibold text-slate-600">
                  From
                  <Input value={dndFrom} onChange={(e) => setDndFrom(e.target.value)} />
                </label>
                <label className="text-xs font-semibold text-slate-600">
                  To
                  <Input value={dndTo} onChange={(e) => setDndTo(e.target.value)} />
                </label>
              </div>

              <div className="rounded-input border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
                <span className="inline-flex items-center gap-1 font-semibold text-slate-700">
                  <Moon size={14} aria-hidden /> Note:
                </span>{" "}
                Critical shipment exceptions still alert immediately (prototype).
              </div>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
