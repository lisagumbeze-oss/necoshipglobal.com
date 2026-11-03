"use client";

import { Badge, Button, Card, Input } from "@/components/design-system/ui";
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useQuery, useQueryClient } from "react-query";
import { apiQuery } from "@/lib/query-api";
import { useDashboardFilters } from "@/lib/dashboard-store";
import { useToast } from "@/components/feedback/toast-provider";
import { useState } from "react";

type InvoiceRecord = { id: string; customer: string; amount: number; status: string };
type CarrierInvoice = {
  id: string;
  carrier: string;
  invoiceNumber: string;
  amountUsd: number;
  matched: boolean;
  varianceUsd: number;
};

const revenueTrend = [
  { month: "Nov", revenue: 380000, cost: 248000 },
  { month: "Dec", revenue: 410000, cost: 266000 },
  { month: "Jan", revenue: 435000, cost: 274000 },
  { month: "Feb", revenue: 470000, cost: 292000 },
  { month: "Mar", revenue: 498000, cost: 305000 },
  { month: "Apr", revenue: 524000, cost: 319000 }
];

const regionalRevenue = [
  { region: "North America", value: 220000 },
  { region: "Europe", value: 161000 },
  { region: "APAC", value: 119000 },
  { region: "Middle East", value: 62000 }
];

export default function RevenueFinancePage() {
  const { pushToast } = useToast();
  const queryClient = useQueryClient();
  const { invoiceStatus, setFilter } = useDashboardFilters();
  const [reconBusy, setReconBusy] = useState(false);
  const financeQuery = useQuery(["admin-finance", invoiceStatus], () => {
    const params = new URLSearchParams();
    if (invoiceStatus) params.set("status", invoiceStatus);
    const qs = params.toString();
    return apiQuery<{ invoices: InvoiceRecord[]; carrierInvoices: CarrierInvoice[] }>(
      `/api/admin/finance${qs ? `?${qs}` : ""}`
    );
  });
  const invoicesQuery = {
    isLoading: financeQuery.isLoading,
    isError: financeQuery.isError,
    data: financeQuery.data?.invoices ?? []
  };

  return (
    <main className="min-h-screen bg-brand-surface p-4 md:p-8">
      <section className="mx-auto max-w-7xl space-y-4">
        <header className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-display text-3xl font-bold text-brand-navy">Revenue & Finance</h1>
            <p className="text-sm text-slate-600">Revenue visibility, invoice operations, refunds, and carrier reconciliation.</p>
          </div>
          <Button
            type="button"
            disabled={reconBusy}
            onClick={async () => {
              setReconBusy(true);
              try {
                const res = await apiQuery<{ matched: number; variance: number; unmatched: number }>(
                  "/api/admin/finance/reconcile",
                  { method: "POST" }
                );
                await queryClient.invalidateQueries(["admin-finance"]);
                pushToast({
                  tone: "success",
                  title: "Reconciliation complete",
                  message: `${res.matched} matched · ${res.variance} variance · ${res.unmatched} unmatched`
                });
              } catch (err) {
                pushToast({
                  tone: "error",
                  title: "Reconciliation failed",
                  message: err instanceof Error ? err.message : ""
                });
              } finally {
                setReconBusy(false);
              }
            }}
          >
            {reconBusy ? "Running…" : "Run Reconciliation"}
          </Button>
        </header>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["MRR", "$524,000"],
            ["ARR", "$6.28M"],
            ["Gross Margin", "39.1%"],
            ["Refund Rate", "1.3%"]
          ].map(([kpi, value]) => (
            <Card key={kpi}>
              <p className="text-xs text-slate-500">{kpi}</p>
              <p className="font-display text-2xl font-bold text-brand-navy">{value}</p>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="space-y-3">
            <p className="font-semibold text-brand-navy">Revenue vs Carrier Cost (6 months)</p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#1E6BFF" strokeWidth={2} />
                  <Line type="monotone" dataKey="cost" stroke="#EF4444" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="space-y-3">
            <p className="font-semibold text-brand-navy">Revenue by Region</p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={regionalRevenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="region" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#0B1F3A" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <Card className="space-y-3">
          <div className="grid gap-3 md:grid-cols-4">
            <Input value={invoiceStatus} onChange={(e) => setFilter("invoiceStatus", e.target.value)} placeholder="Invoice status" />
            <Input placeholder="Date range" />
            <Input placeholder="Customer name" />
            <Button variant="secondary">Filter Invoices</Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="text-xs uppercase text-slate-500">
                <tr>
                  <th className="p-2">Invoice #</th>
                  <th className="p-2">Customer</th>
                  <th className="p-2">Amount</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {invoicesQuery.isLoading && (
                  <tr>
                    <td colSpan={5} className="p-3">
                      <div className="h-10 animate-pulse rounded-input bg-slate-100" />
                    </td>
                  </tr>
                )}
                {invoicesQuery.isError && (
                  <tr>
                    <td colSpan={5} className="p-3 text-sm text-red-700">
                      Unable to load invoices. Please refresh and try again.
                    </td>
                  </tr>
                )}
                {invoicesQuery.data?.length === 0 && !invoicesQuery.isLoading && (
                  <tr>
                    <td colSpan={5} className="p-3 text-sm text-slate-600">
                      No invoices match your current filters.
                    </td>
                  </tr>
                )}
                {invoicesQuery.data?.map((row) => (
                  <tr key={row.id} className="border-t border-slate-100">
                    <td className="p-2 font-mono">{row.id}</td>
                    <td className="p-2">{row.customer}</td>
                    <td className="p-2">${row.amount.toLocaleString()}</td>
                    <td className="p-2">
                      <Badge tone={row.status === "Paid" ? "success" : row.status === "Due" ? "warning" : "danger"}>
                        {row.status}
                      </Badge>
                    </td>
                    <td className="p-2">
                      <Button variant="ghost">Open</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="space-y-3">
          <p className="font-semibold text-brand-navy">Carrier invoices</p>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="text-xs uppercase text-slate-500">
                <tr>
                  <th className="p-2">Carrier</th>
                  <th className="p-2">Invoice #</th>
                  <th className="p-2">Amount</th>
                  <th className="p-2">Variance</th>
                  <th className="p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {(financeQuery.data?.carrierInvoices ?? []).map((row) => (
                  <tr key={row.id} className="border-t border-slate-100">
                    <td className="p-2">{row.carrier}</td>
                    <td className="p-2 font-mono">{row.invoiceNumber}</td>
                    <td className="p-2">${row.amountUsd.toLocaleString()}</td>
                    <td className="p-2">${row.varianceUsd.toLocaleString()}</td>
                    <td className="p-2">
                      <Badge tone={row.matched ? "success" : "warning"}>{row.matched ? "Matched" : "Open"}</Badge>
                    </td>
                  </tr>
                ))}
                {!financeQuery.data?.carrierInvoices?.length ? (
                  <tr>
                    <td colSpan={5} className="p-3 text-sm text-slate-500">
                      No carrier invoices seeded yet.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </Card>
      </section>
    </main>
  );
}
