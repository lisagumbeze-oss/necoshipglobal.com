"use client";

import Link from "next/link";
import { useQuery } from "react-query";
import { Badge, Button } from "@/components/design-system/ui";
import { BRAND } from "@/lib/brand";
import { apiQuery } from "@/lib/query-api";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import {
  ArrowRight,
  Bell,
  FileText,
  PackagePlus,
  Search,
  Truck
} from "lucide-react";

type DashboardSummary = {
  activeShipments: number;
  deliveredThisMonth: number;
  pendingClearance: number;
  totalSpentMtdUsd: number;
  recentShipments: Array<{
    id: string;
    origin: string;
    destination: string;
    status: string;
    eta: string;
  }>;
};

type NotificationItem = { id: string; title: string; message: string; read: boolean };
type SpendPoint = { month: string; spendUsd: number };

function money(n: number) {
  return n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function UserDashboardHomePage() {
  const summary = useQuery(["dashboard-summary"], () => apiQuery<DashboardSummary>("/api/dashboard/summary"));
  const notifications = useQuery(["dashboard-notifications"], () => apiQuery<NotificationItem[]>("/api/notifications"));
  const spend = useQuery(["dashboard-spend"], () => apiQuery<SpendPoint[]>("/api/dashboard/spend"));

  return (
    <section className="mx-auto max-w-6xl space-y-6">
      <header className="overflow-hidden rounded-2xl bg-gradient-to-br from-brand-navy via-[#0A3A6B] to-[#0A3A6B] p-6 text-white shadow-lg shadow-yellow-900/10 md:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-xl space-y-2">
            <p className="text-sm font-medium text-yellow-100">{BRAND.name} shipper</p>
            <h1 className="font-display text-3xl font-bold md:text-4xl">{greeting()}</h1>
            <p className="text-sm text-yellow-100/90">
              Create labels, track deliveries, and manage billing from one place.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href={"/create-shipment" as never}>
              <Button className="bg-white text-brand-navy hover:bg-yellow-50">
                <PackagePlus size={16} aria-hidden /> Ship now
              </Button>
            </Link>
            <Link href={"/quote" as never}>
              <Button variant="secondary" className="border-white/20 bg-white/10 text-white hover:bg-white/20">
                Get a quote
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {summary.isLoading
          ? [1, 2, 3, 4].map((i) => <div key={i} className="h-24 animate-pulse rounded-2xl bg-white" />)
          : summary.isError
            ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 sm:col-span-2 xl:col-span-4">
                Failed to load summary.
              </div>
              )
            : (
              <>
                {[
                  { label: "Active shipments", value: summary.data!.activeShipments },
                  { label: "Delivered this month", value: summary.data!.deliveredThisMonth },
                  { label: "Pending clearance", value: summary.data!.pendingClearance },
                  { label: "Spent MTD", value: money(summary.data!.totalSpentMtdUsd) }
                ].map((kpi) => (
                  <div key={kpi.label} className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{kpi.label}</p>
                    <p className="mt-2 font-display text-3xl font-bold text-brand-navy">{kpi.value}</p>
                  </div>
                ))}
              </>
              )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { href: "/create-shipment", label: "Ship now", icon: Truck, hint: "Book a label" },
          { href: "/tracking", label: "Track", icon: Search, hint: "Live status" },
          { href: "/documents", label: "Documents", icon: FileText, hint: "Invoices & BOL" },
          { href: "/notifications", label: "Alerts", icon: Bell, hint: "Needs attention" }
        ].map((action) => (
          <Link
            key={action.href}
            href={action.href as never}
            className="group rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-yellow/40 hover:shadow-md"
          >
            <action.icon size={18} className="text-brand-yellow" aria-hidden />
            <p className="mt-3 font-semibold text-brand-navy">{action.label}</p>
            <p className="text-xs text-slate-500">{action.hint}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.5fr_0.9fr]">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm md:p-5">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-display text-lg font-semibold text-brand-navy">Your recent shipments</h2>
            <Link href={"/shipments" as never} className="inline-flex items-center gap-1 text-sm font-semibold text-brand-navy">
              View all <ArrowRight size={14} aria-hidden />
            </Link>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-slate-400">
                <tr>
                  <th className="pb-2 pr-3 font-medium">Tracking</th>
                  <th className="pb-2 pr-3 font-medium">Route</th>
                  <th className="pb-2 pr-3 font-medium">Status</th>
                  <th className="pb-2 pr-3 font-medium">ETA</th>
                  <th className="pb-2 font-medium"> </th>
                </tr>
              </thead>
              <tbody>
                {summary.data?.recentShipments?.map((s) => (
                  <tr key={s.id} className="border-t border-slate-100">
                    <td className="py-3 pr-3 font-mono text-xs font-semibold text-brand-navy">{s.id}</td>
                    <td className="py-3 pr-3 text-slate-600">
                      {s.origin} → {s.destination}
                    </td>
                    <td className="py-3 pr-3">
                      <Badge
                        tone={
                          s.status === "Delivered"
                            ? "success"
                            : s.status === "Exception"
                              ? "danger"
                              : s.status === "Customs Hold"
                                ? "warning"
                                : "default"
                        }
                      >
                        {s.status}
                      </Badge>
                    </td>
                    <td className="py-3 pr-3 text-slate-600">{s.eta}</td>
                    <td className="py-3">
                      <Link href={`/shipments/${s.id}` as never} className="font-semibold text-brand-navy">
                        Open
                      </Link>
                    </td>
                  </tr>
                ))}
                {!summary.isLoading && !summary.data?.recentShipments?.length ? (
                  <tr>
                    <td colSpan={5} className="py-6 text-slate-500">
                      No shipments yet. Create your first label to get started.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-brand-navy">Needs attention</h2>
              <Link href={"/notifications" as never} className="text-sm font-semibold text-brand-navy">
                All
              </Link>
            </div>
            <div className="mt-3 space-y-2">
              {(notifications.data ?? [])
                .filter((n) => !n.read)
                .slice(0, 3)
                .map((n) => (
                  <div key={n.id} className="rounded-xl bg-slate-50 p-3">
                    <p className="text-sm font-semibold text-brand-navy">{n.title}</p>
                    <p className="mt-1 text-xs text-slate-500">{n.message}</p>
                  </div>
                ))}
              {(notifications.data ?? []).filter((n) => !n.read).length === 0 ? (
                <p className="text-sm text-slate-500">You’re all caught up.</p>
              ) : null}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
            <h2 className="font-semibold text-brand-navy">Spending (6 months)</h2>
            <div className="mt-3 h-48">
              {spend.isLoading ? (
                <div className="h-full animate-pulse rounded-xl bg-slate-100" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={spend.data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} width={40} />
                    <Tooltip />
                    <Bar dataKey="spendUsd" fill="#F8E000" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
