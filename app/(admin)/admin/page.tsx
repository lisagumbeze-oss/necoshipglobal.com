"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useQuery } from "react-query";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { Badge, Button } from "@/components/design-system/ui";
import { useToast } from "@/components/feedback/toast-provider";
import { apiQuery } from "@/lib/query-api";
import { AlertTriangle, ArrowRight, Radio, ShieldCheck, Ticket, TrendingUp } from "lucide-react";

type AdminShipmentRow = {
  id: string;
  origin: string;
  destination: string;
  status: string;
  updatedAt: string;
  customer: string;
  carrier: string;
  exceptionFlag: boolean;
  destinationCountry: string;
};

type AdminKpiSnapshot = {
  createdToday: number;
  inTransit: number;
  deliveredToday: number;
  exceptions: number;
  activeTickets: number;
  revenueTodayUsd: number;
};

type ExceptionRecord = {
  id: string;
  type: string;
  priority: string;
  assignee: string;
  raisedAt: string;
};

type TicketRecord = { id: string; subject: string; lastReplyAt: string };
type StaffActivityRecord = { id: string; staffName: string; action: string; createdAt: string };

function money(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}

function statusColor(status: string) {
  if (status === "In Transit") return "#1E6BFF";
  if (status === "Delivered") return "#10B981";
  if (status === "Exception") return "#EF4444";
  if (status === "Customs Hold") return "#F59E0B";
  return "#64748B";
}

const panel = "rounded-xl border border-slate-200 bg-white p-4 shadow-sm";
const muted = "text-xs uppercase tracking-[0.12em] text-slate-500";

export default function AdminDashboardPage() {
  const { pushToast } = useToast();
  const kpisQuery = useQuery(["admin-kpis"], () => apiQuery<AdminKpiSnapshot>("/api/admin/kpis"), {
    refetchInterval: 30_000
  });
  const shipmentsQuery = useQuery(
    ["admin-shipments-sample"],
    () => apiQuery<AdminShipmentRow[]>("/api/admin/shipments"),
    { refetchInterval: 30_000 }
  );
  const exceptionsQuery = useQuery(
    ["admin-exceptions"],
    () => apiQuery<ExceptionRecord[]>("/api/admin/exceptions"),
    { refetchInterval: 30_000 }
  );
  const ticketsQuery = useQuery(
    ["admin-tickets"],
    () => apiQuery<TicketRecord[]>("/api/tickets?status=Open"),
    { refetchInterval: 30_000 }
  );
  const activityQuery = useQuery(
    ["admin-staff-activity"],
    async () => {
      const data = await apiQuery<{ activity: StaffActivityRecord[] }>("/api/admin/staff");
      return data.activity;
    },
    { refetchInterval: 30_000 }
  );

  const charts = useMemo(() => {
    const rows = shipmentsQuery.data ?? [];
    const statusMix = ["In Transit", "Delivered", "Exception", "Customs Hold", "Out for Delivery"].map((name) => ({
      name,
      value: rows.filter((r) => r.status === (name as never)).length
    }));
    const carrierMix = Array.from(
      rows.reduce((m, r) => m.set(r.carrier, (m.get(r.carrier) ?? 0) + 1), new Map<string, number>())
    ).map(([name, value]) => ({ name, value }));
    const topDestinations = Array.from(
      rows.reduce((m, r) => m.set(r.destinationCountry, (m.get(r.destinationCountry) ?? 0) + 1), new Map<string, number>())
    )
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
    const revenueTrend = Array.from({ length: 30 }).map((_, i) => {
      const day = 30 - i;
      const base = 420_000 + i * 1800;
      const noise = ((i * 73) % 9000) - 4500;
      return { day: `D-${day}`, revenueUsd: Math.max(260_000, base + noise) };
    });
    return { statusMix, carrierMix, topDestinations, revenueTrend };
  }, [shipmentsQuery.data]);

  const recentExceptions = useMemo(() => {
    const rows = shipmentsQuery.data ?? [];
    return rows
      .filter((r) => r.exceptionFlag)
      .slice()
      .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
      .slice(0, 5);
  }, [shipmentsQuery.data]);

  const unassignedExceptions = useMemo(
    () => (exceptionsQuery.data ?? []).filter((e: ExceptionRecord) => e.assignee === "Unassigned").slice(0, 4),
    [exceptionsQuery.data]
  );

  return (
    <section className="mx-auto max-w-[1400px] space-y-4">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className={muted}>Network operations</p>
          <h1 className="mt-1 font-display text-2xl font-bold text-brand-navy md:text-3xl">Command center</h1>
          <p className="mt-1 text-sm text-slate-600">Exception-first view across carriers, customs, and support SLAs.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="success">
            <Radio size={12} aria-hidden /> Refresh 30s
          </Badge>
          <Link
            href={"/admin/live-operations" as never}
            className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            Open live map <ArrowRight size={12} aria-hidden />
          </Link>
        </div>
      </header>

      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {kpisQuery.isLoading
          ? Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-20 animate-pulse rounded-xl bg-slate-100" />)
          : kpisQuery.isError
            ? <div className={`${panel} text-sm text-red-700 xl:col-span-6`}>Failed to load KPI snapshot.</div>
            : [
                { label: "Created today", value: kpisQuery.data!.createdToday },
                { label: "In transit", value: kpisQuery.data!.inTransit },
                { label: "Delivered today", value: kpisQuery.data!.deliveredToday },
                { label: "Exceptions", value: kpisQuery.data!.exceptions, alert: true },
                { label: "Open tickets", value: kpisQuery.data!.activeTickets },
                { label: "Revenue today", value: money(kpisQuery.data!.revenueTodayUsd) }
              ].map((kpi) => (
                <div key={kpi.label} className={`${panel} ${kpi.alert ? "border-red-200 bg-red-50" : ""}`}>
                  <p className={muted}>{kpi.label}</p>
                  <p className={`mt-2 font-mono text-2xl font-semibold ${kpi.alert ? "text-red-700" : "text-brand-navy"}`}>
                    {kpi.value}
                  </p>
                </div>
              ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className={`${panel} space-y-3`}>
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="font-semibold text-brand-navy">Priority queue</p>
              <p className="text-xs text-slate-500">Unassigned exceptions requiring staff action</p>
            </div>
            <Link href={"/admin/exceptions" as never} className="text-xs font-semibold text-brand-blue">
              Exceptions console
            </Link>
          </div>
          <div className="space-y-2">
            {unassignedExceptions.length === 0 ? (
              <div className="rounded-md border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
                Queue clear — no unassigned exceptions.
              </div>
            ) : (
              unassignedExceptions.map((e) => (
                <div key={e.id} className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5">
                  <div>
                    <p className="text-sm font-semibold text-brand-navy">{e.type}</p>
                    <p className="font-mono text-[11px] text-slate-500">
                      {e.id} · raised {e.raisedAt}
                    </p>
                  </div>
                  <Badge tone={e.priority === "Critical" ? "danger" : e.priority === "High" ? "warning" : "default"}>
                    {e.priority}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </div>

        <div className={`${panel} space-y-3`}>
          <div className="flex items-center justify-between">
            <p className="font-semibold text-brand-navy">Status mix</p>
            <Badge>Network</Badge>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={charts.statusMix} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70}>
                  {charts.statusMix.map((entry) => (
                    <Cell key={entry.name} fill={statusColor(entry.name as never)} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        <div className={`${panel} space-y-3 lg:col-span-2`}>
          <div className="flex items-center gap-2 font-semibold text-brand-navy">
            <TrendingUp size={15} aria-hidden /> Revenue (30d)
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={charts.revenueTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" hide />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenueUsd" stroke="#0B1F3A" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className={`${panel} space-y-3`}>
          <p className="font-semibold text-brand-navy">Top destinations</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.topDestinations} layout="vertical" margin={{ left: 8, right: 8 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="country" width={70} />
                <Tooltip />
                <Bar dataKey="count" fill="#1E6BFF" radius={[4, 4, 4, 4]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className={`${panel} space-y-3`}>
          <p className="font-semibold text-brand-navy">Carrier mix</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={charts.carrierMix} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70}>
                  {charts.carrierMix.map((entry, i) => (
                    <Cell key={entry.name} fill={["#0B1F3A", "#1E6BFF", "#10B981", "#F59E0B", "#EF4444"][i % 5]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className={`${panel} space-y-3 lg:col-span-2`}>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 font-semibold text-brand-navy">
              <AlertTriangle size={15} className="text-amber-500" aria-hidden /> Flagged shipments
            </div>
            <Link href={"/admin/shipments" as never} className="text-xs font-semibold text-brand-blue">
              All shipments
            </Link>
          </div>
          <div className="divide-y divide-slate-100 overflow-hidden rounded-md border border-slate-200">
            {recentExceptions.length === 0 ? (
              <div className="p-3 text-sm text-slate-600">No flagged shipments.</div>
            ) : (
              recentExceptions.map((s) => (
                <div key={s.id} className="flex flex-wrap items-center justify-between gap-3 px-3 py-2.5 text-sm">
                  <div>
                    <p className="font-mono text-xs font-semibold text-brand-navy">{s.id}</p>
                    <p className="text-xs text-slate-500">
                      {s.origin} → {s.destination} · {s.customer}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge tone={s.status === "Exception" ? "danger" : "warning"}>{s.status}</Badge>
                    <Link href={`/admin/shipments/${s.id}` as never} className="text-xs font-semibold text-brand-blue">
                      Open
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className={`${panel} space-y-3`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-semibold text-brand-navy">
                <Ticket size={15} aria-hidden /> Support queue
              </div>
              <Link href={"/admin/support" as never} className="text-xs font-semibold text-brand-blue">
                Desk
              </Link>
            </div>
            <div className="space-y-2">
              {(ticketsQuery.data ?? []).slice(0, 3).map((t) => (
                <div key={t.id} className="rounded-md border border-slate-200 bg-slate-50 p-2.5 text-sm">
                  <p className="font-semibold text-brand-navy">{t.subject}</p>
                  <p className="mt-1 font-mono text-[11px] text-slate-500">
                    {t.id} · {t.lastReplyAt}
                  </p>
                </div>
              ))}
            </div>
            <Button
              variant="secondary"
              type="button"
              className="w-full"
              onClick={() => pushToast({ tone: "info", title: "Assigned unowned tickets" })}
            >
              Assign unowned
            </Button>
          </div>

          <div className={`${panel} space-y-3`}>
            <div className="flex items-center gap-2 font-semibold text-brand-navy">
              <ShieldCheck size={15} className="text-emerald-600" aria-hidden /> Staff activity
            </div>
            <div className="space-y-2">
              {(activityQuery.data ?? []).slice(0, 4).map((a) => (
                <div key={a.id} className="rounded-md border border-slate-200 bg-slate-50 p-2.5 text-sm">
                  <p className="font-semibold text-brand-navy">{a.staffName}</p>
                  <p className="mt-1 text-xs text-slate-600">{a.action}</p>
                  <p className="mt-1 font-mono text-[11px] text-slate-500">{a.createdAt}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
