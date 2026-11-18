"use client";

import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import {
  Badge,
  Card,
  DataTable,
  EmptyState,
  FilterBar,
  Input,
  KpiCard,
  type DataTableColumn
} from "@/components/design-system";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { AdminUiNote } from "@/components/admin/admin-ui-note";
import { demoAdminInvoices, type DemoAdminInvoice } from "@/lib/demo/admin-fixtures";
import { hasPermission } from "@/lib/rbac";

type AgingBucket = "Current" | "1–30" | "31–60" | "61–90" | "90+" | "Paid / Void";

/** Reference “today” aligned with fixture calendar (project date context). */
const AR_AS_OF = new Date("2026-11-18T12:00:00Z");

function daysBetween(dueIso: string): number {
  const due = new Date(`${dueIso}T12:00:00Z`);
  return Math.floor((AR_AS_OF.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));
}

function agingBucket(invoice: DemoAdminInvoice): AgingBucket {
  if (invoice.status === "Paid" || invoice.status === "Void") return "Paid / Void";
  const days = daysBetween(invoice.dueDate);
  if (days <= 0) return "Current";
  if (days <= 30) return "1–30";
  if (days <= 60) return "31–60";
  if (days <= 90) return "61–90";
  return "90+";
}

function agingTone(bucket: AgingBucket): "success" | "warning" | "danger" | "info" | "default" {
  if (bucket === "Paid / Void") return "success";
  if (bucket === "Current") return "info";
  if (bucket === "1–30") return "warning";
  return "danger";
}

export default function AdminInvoicesPage() {
  const { data: session } = useSession();
  const role = session?.user?.staffRole ?? null;
  const canView = !role || hasPermission(role, "finance.view");
  const canManage = role ? hasPermission(role, "finance.manage") : false;

  const [q, setQ] = useState("");
  const [status, setStatus] = useState("All");
  const [aging, setAging] = useState("All");
  const [selected, setSelected] = useState(demoAdminInvoices[0]?.id ?? "");

  const enriched = useMemo(
    () =>
      demoAdminInvoices.map((invoice) => ({
        ...invoice,
        aging: agingBucket(invoice),
        daysPastDue: Math.max(0, daysBetween(invoice.dueDate))
      })),
    []
  );

  const rows = useMemo(() => {
    return enriched.filter((i) => {
      if (status !== "All" && i.status !== status) return false;
      if (aging !== "All" && i.aging !== aging) return false;
      const query = q.trim().toLowerCase();
      if (!query) return true;
      return [i.reference, i.billingParty, i.customerRef].some((v) => v.toLowerCase().includes(query));
    });
  }, [q, status, aging, enriched]);

  const detail = enriched.find((i) => i.id === selected) ?? rows[0];

  const agingCounts = useMemo(() => {
    const buckets: AgingBucket[] = ["Current", "1–30", "31–60", "61–90", "90+", "Paid / Void"];
    return buckets.map((b) => ({
      bucket: b,
      count: enriched.filter((i) => i.aging === b).length
    }));
  }, [enriched]);

  const outstandingRows = enriched.filter((i) => i.status === "Due" || i.status === "Overdue");

  const columns: DataTableColumn<(typeof enriched)[number]>[] = [
    {
      id: "reference",
      header: "Reference",
      cell: (i) => (
        <button
          type="button"
          className="font-mono text-xs font-semibold text-brand-navy hover:underline"
          onClick={() => setSelected(i.id)}
        >
          {i.reference}
        </button>
      )
    },
    {
      id: "party",
      header: "Billing party",
      cell: (i) => i.billingParty
    },
    {
      id: "due",
      header: "Due date",
      cell: (i) => <span className="whitespace-nowrap">{i.dueDate}</span>
    },
    {
      id: "outstanding",
      header: "Outstanding",
      cell: (i) => <span className="text-amber-900">{i.outstandingLabel}</span>
    },
    {
      id: "aging",
      header: "Aging",
      cell: (i) => <Badge tone={agingTone(i.aging)}>{i.aging}</Badge>
    },
    {
      id: "status",
      header: "Payment status",
      cell: (i) => (
        <Badge tone={i.status === "Paid" ? "success" : i.status === "Overdue" ? "danger" : "warning"}>
          {i.status}
        </Badge>
      )
    }
  ];

  if (!canView) {
    return (
      <section className="mx-auto max-w-ns-xl space-y-6">
        <DashboardPageHeader title="Accounts receivable" description="finance.view permission required." />
        <EmptyState title="Access restricted" description="Your session role does not include finance.view." />
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-ns-xl space-y-6">
      <DashboardPageHeader
        title="Accounts receivable"
        description="UI-01 invoice list with aging categories derived from demonstration due dates. Amounts are labelled demo records."
      />

      <AdminUiNote>
        All invoice figures are demonstration labels. Collect payment, refund and reconciliation controls are not enabled
        on this page
        {canManage
          ? " (session has finance.manage, but this UI still does not post mutations without an approved integration)."
          : " (session lacks finance.manage)."}
      </AdminUiNote>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="AR open (demo)" value={outstandingRows.length} hint="Due + Overdue rows" tone="warning" />
        <KpiCard
          label="Overdue (demo)"
          value={enriched.filter((i) => i.status === "Overdue").length}
          hint="Status Overdue"
          tone="danger"
        />
        <KpiCard label="Paid (demo)" value={enriched.filter((i) => i.status === "Paid").length} hint="Status Paid" tone="success" />
        <KpiCard label="As-of date" value="18 Nov 2026" hint="Aging reference" tone="info" />
      </div>

      <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {agingCounts.map((row) => (
          <Card key={row.bucket} className="space-y-1 p-3">
            <p className="ns-meta uppercase">{row.bucket}</p>
            <p className="font-display text-xl font-bold text-brand-navy">{row.count}</p>
          </Card>
        ))}
      </div>

      <FilterBar>
        <div className="min-w-[12rem] flex-1">
          <label className="ns-meta uppercase" htmlFor="inv-q">
            Search
          </label>
          <Input
            id="inv-q"
            className="mt-1"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Invoice, party, customer ref…"
          />
        </div>
        <div>
          <label className="ns-meta uppercase" htmlFor="inv-status">
            Payment status
          </label>
          <select
            id="inv-status"
            className="mt-1 h-11 rounded-input border border-ns-border bg-white px-3 text-sm"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option>All</option>
            <option>Draft</option>
            <option>Due</option>
            <option>Paid</option>
            <option>Overdue</option>
            <option>Void</option>
          </select>
        </div>
        <div>
          <label className="ns-meta uppercase" htmlFor="inv-aging">
            Aging
          </label>
          <select
            id="inv-aging"
            className="mt-1 h-11 rounded-input border border-ns-border bg-white px-3 text-sm"
            value={aging}
            onChange={(e) => setAging(e.target.value)}
          >
            <option>All</option>
            <option>Current</option>
            <option>1–30</option>
            <option>31–60</option>
            <option>61–90</option>
            <option>90+</option>
            <option>Paid / Void</option>
          </select>
        </div>
      </FilterBar>

      <ul className="space-y-3 md:hidden" aria-label="Invoice cards">
        {rows.length === 0 ? (
          <li className="rounded-card border border-dashed border-ns-border px-3 py-6 text-center text-sm text-slate-500">
            No demonstration invoices match the current filters.
          </li>
        ) : (
          rows.map((i) => (
            <li key={i.id}>
              <button
                type="button"
                onClick={() => setSelected(i.id)}
                className={`w-full rounded-card border px-3 py-3 text-left shadow-sm transition ${
                  selected === i.id ? "border-brand-yellow bg-brand-yellow/10" : "border-ns-border bg-white"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-mono text-xs font-semibold text-brand-navy">{i.reference}</span>
                  <Badge tone={i.status === "Paid" ? "success" : i.status === "Overdue" ? "danger" : "warning"}>
                    {i.status}
                  </Badge>
                </div>
                <p className="mt-1 text-sm font-medium text-brand-navy">{i.billingParty}</p>
                <p className="ns-meta">Due {i.dueDate} · Aging {i.aging}</p>
                <p className="mt-1 text-sm text-amber-900">{i.outstandingLabel}</p>
              </button>
            </li>
          ))
        )}
      </ul>

      <div className="hidden gap-4 md:grid lg:grid-cols-[1.25fr_0.75fr]">
        <DataTable
          columns={columns}
          rows={rows}
          rowKey={(i) => i.id}
          empty="No demonstration invoices match the current filters."
        />

        {detail ? (
          <Card className="h-fit space-y-2 text-sm">
            <h2 className="ns-card-title">Invoice detail</h2>
            <p className="font-mono font-semibold text-brand-navy">{detail.reference}</p>
            <p>Customer reference: {detail.customerRef}</p>
            <p>Billing party: {detail.billingParty}</p>
            <p>Billing period: {detail.period}</p>
            <p>Due date: {detail.dueDate}</p>
            <p>Days past due: {detail.status === "Paid" || detail.status === "Void" ? "—" : detail.daysPastDue}</p>
            <p>
              Aging: <Badge tone={agingTone(detail.aging)}>{detail.aging}</Badge>
            </p>
            <p>Subtotal: {detail.subtotalLabel}</p>
            <p>Tax: {detail.taxLabel}</p>
            <p>Total: {detail.totalLabel}</p>
            <p>Outstanding: {detail.outstandingLabel}</p>
            <p>
              Payment status: <Badge>{detail.status}</Badge>
            </p>
            <p className="ns-meta pt-2">
              Payment / refund actions disabled — no approved mutation integration on this screen.
            </p>
          </Card>
        ) : null}
      </div>

      {detail ? (
        <Card className="space-y-2 text-sm md:hidden">
          <h2 className="ns-card-title">Selected invoice</h2>
          <p className="font-mono font-semibold text-brand-navy">{detail.reference}</p>
          <p>Customer reference: {detail.customerRef}</p>
          <p>Billing party: {detail.billingParty}</p>
          <p>Due date: {detail.dueDate}</p>
          <p>
            Aging: <Badge tone={agingTone(detail.aging)}>{detail.aging}</Badge>
          </p>
          <p>Outstanding: {detail.outstandingLabel}</p>
          <p>
            Payment status: <Badge>{detail.status}</Badge>
          </p>
          <p className="ns-meta pt-1">Payment / refund actions disabled on this screen.</p>
        </Card>
      ) : null}
    </section>
  );
}
