"use client";

import { useMemo, useState } from "react";
import { useQuery } from "react-query";
import { Badge, Button, Card, Input } from "@/components/design-system/ui";
import { apiQuery } from "@/lib/query-api";
import { CreditCard, Download, Plus, RefreshCcw, ShieldCheck } from "lucide-react";
import { useToast } from "@/components/feedback/toast-provider";
import { useEffect } from "react";

type InvoiceRecord = {
  id: string;
  customer: string;
  amount: number;
  status: "Paid" | "Due" | "Overdue" | string;
};

type WalletInfo = {
  balanceCents: number;
  autoPay: boolean;
  defaultPaymentMethod: string;
};

function money(amount: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
}

function statusTone(status: InvoiceRecord["status"]) {
  if (status === "Paid") return "success";
  if (status === "Due") return "warning";
  return "danger";
}

export default function BillingPage() {
  const { pushToast } = useToast();
  const notify = (title: string, message?: string) => pushToast({ tone: "info", title, message });
  const [invoiceStatus, setInvoiceStatus] = useState<"All" | InvoiceRecord["status"]>("All");
  const [search, setSearch] = useState("");

  const [autoPay, setAutoPay] = useState(true);
  const [defaultMethod, setDefaultMethod] = useState<"card" | "bank">("card");

  const invoicesQuery = useQuery(["invoices", invoiceStatus], () =>
    apiQuery<InvoiceRecord[]>(
      `/api/billing/invoices${invoiceStatus === "All" ? "" : `?status=${encodeURIComponent(invoiceStatus)}`}`
    )
  );
  const walletQuery = useQuery(["wallet"], () => apiQuery<WalletInfo>("/api/billing/wallet"));

  useEffect(() => {
    if (!walletQuery.data) return;
    setAutoPay(walletQuery.data.autoPay);
    setDefaultMethod(walletQuery.data.defaultPaymentMethod === "bank" ? "bank" : "card");
  }, [walletQuery.data]);

  const filtered = useMemo(() => {
    const list = invoicesQuery.data ?? [];
    if (!search.trim()) return list;
    const s = search.trim().toLowerCase();
    return list.filter((inv) => `${inv.id} ${inv.customer}`.toLowerCase().includes(s));
  }, [invoicesQuery.data, search]);

  const totals = useMemo(() => {
    const list = invoicesQuery.data ?? [];
    const due = list.filter((i) => i.status === "Due").reduce((sum, i) => sum + i.amount, 0);
    const overdue = list.filter((i) => i.status === "Overdue").reduce((sum, i) => sum + i.amount, 0);
    const paid = list.filter((i) => i.status === "Paid").reduce((sum, i) => sum + i.amount, 0);
    return { due, overdue, paid };
  }, [invoicesQuery.data]);

  const walletBalanceUsd = (walletQuery.data?.balanceCents ?? 0) / 100;

  return (
    <main className="min-h-screen bg-brand-surface p-4 md:p-8">
      <section className="mx-auto max-w-7xl space-y-4">
        <header className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-display text-3xl font-bold text-brand-navy">Billing & Invoices</h1>
            <p className="text-sm text-slate-600">Manage invoices, payment methods, and automatic payments.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" type="button" onClick={() => notify("Top-up flow opened")}>
              <Plus size={16} aria-hidden /> Top Up Wallet
            </Button>
            <Button type="button" onClick={() => notify("Statement download started")}>
              <Download size={16} aria-hidden /> Download Statement
            </Button>
          </div>
        </header>

        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="space-y-2">
            <p className="text-xs text-slate-500">Wallet balance</p>
            <p className="font-display text-2xl font-bold text-brand-navy">{money(walletBalanceUsd)}</p>
            <div className="flex flex-wrap gap-2 pt-1 text-xs text-slate-600">
              <Badge tone={autoPay ? "success" : "warning"}>{autoPay ? "Auto-pay enabled" : "Auto-pay paused"}</Badge>
              <Badge tone="default">Default: {defaultMethod === "card" ? "Card" : "Bank"}</Badge>
            </div>
          </Card>

          <Card className="space-y-2">
            <p className="text-xs text-slate-500">This period</p>
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-input border border-slate-200 p-3">
                <p className="text-xs text-slate-500">Paid</p>
                <p className="font-semibold text-brand-navy">{money(totals.paid)}</p>
              </div>
              <div className="rounded-input border border-slate-200 p-3">
                <p className="text-xs text-slate-500">Due</p>
                <p className="font-semibold text-brand-navy">{money(totals.due)}</p>
              </div>
              <div className="rounded-input border border-slate-200 p-3">
                <p className="text-xs text-slate-500">Overdue</p>
                <p className="font-semibold text-brand-navy">{money(totals.overdue)}</p>
              </div>
            </div>
          </Card>

          <Card className="space-y-2">
            <p className="text-xs text-slate-500">Billing profile</p>
            <div className="flex items-start gap-3">
              <div className="rounded-input bg-slate-100 p-2 text-slate-700">
                <ShieldCheck size={18} aria-hidden />
              </div>
              <div className="text-sm">
                <p className="font-semibold text-brand-navy">NecoShip Global — Business</p>
                <p className="text-xs text-slate-500">Invoices sent to billing@necoship.global</p>
                <p className="mt-2 text-xs text-slate-600">Tax ID + address verification: complete</p>
              </div>
            </div>
            <div className="pt-2">
              <Button variant="secondary" type="button" onClick={() => notify("Billing profile editor opened")}>
                Edit Profile
              </Button>
            </div>
          </Card>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-3">
            <Card className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-brand-navy">Invoices</p>
                <p className="text-xs text-slate-500">Search, filter, download PDFs, and pay in one place.</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Input placeholder="Search invoice or customer..." value={search} onChange={(e) => setSearch(e.target.value)} />
                <select
                  className="rounded-input border border-slate-200 bg-white px-3 py-2 text-sm focus-ring"
                  value={invoiceStatus}
                  onChange={(e) => setInvoiceStatus(e.target.value as never)}
                  aria-label="Filter invoices by status"
                >
                  <option value="All">All</option>
                  <option value="Paid">Paid</option>
                  <option value="Due">Due</option>
                  <option value="Overdue">Overdue</option>
                </select>
                <Button variant="ghost" type="button" onClick={() => invoicesQuery.refetch()} disabled={invoicesQuery.isFetching}>
                  <RefreshCcw size={16} aria-hidden /> Refresh
                </Button>
              </div>
            </Card>

            <Card className="overflow-hidden p-0">
              <div className="grid grid-cols-12 gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-600">
                <div className="col-span-4">Invoice</div>
                <div className="col-span-4">Customer</div>
                <div className="col-span-2 text-right">Amount</div>
                <div className="col-span-2 text-right">Actions</div>
              </div>

              {invoicesQuery.isLoading ? (
                <div className="space-y-2 p-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-10 animate-pulse rounded-input bg-slate-100" />
                  ))}
                </div>
              ) : invoicesQuery.isError ? (
                <div className="p-4 text-sm text-red-700">Failed to load invoices. Please try again.</div>
              ) : filtered.length === 0 ? (
                <div className="p-4 text-sm text-slate-600">No invoices match your filters.</div>
              ) : (
                <div className="divide-y divide-slate-200">
                  {filtered.map((inv) => (
                    <div key={inv.id} className="grid grid-cols-12 items-center gap-2 px-4 py-3 text-sm">
                      <div className="col-span-4">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-brand-navy">{inv.id}</p>
                          <Badge tone={statusTone(inv.status)}>{inv.status}</Badge>
                        </div>
                      </div>
                      <div className="col-span-4 text-slate-700">{inv.customer}</div>
                      <div className="col-span-2 text-right font-semibold text-brand-navy">{money(inv.amount)}</div>
                      <div className="col-span-2 flex justify-end gap-2">
                        <Button variant="secondary" type="button" onClick={() => notify("Invoice download started", inv.id)}>
                          <Download size={16} aria-hidden />
                        </Button>
                        <Button
                          type="button"
                          onClick={() => notify("Payment flow opened", inv.id)}
                          disabled={inv.status === "Paid"}
                        >
                          Pay
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-brand-navy">Auto-pay</p>
                  <p className="text-xs text-slate-500">Automatically pay Due invoices with your default method.</p>
                </div>
                <button
                  type="button"
                  className={`focus-ring rounded-full px-3 py-2 text-xs font-semibold ${
                    autoPay ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-800"
                  }`}
                  onClick={async () => {
                    const next = !autoPay;
                    setAutoPay(next);
                    try {
                      await apiQuery("/api/billing/wallet", {
                        method: "PATCH",
                        body: JSON.stringify({ autoPay: next })
                      });
                    } catch (err) {
                      setAutoPay(!next);
                      pushToast({
                        tone: "error",
                        title: "Could not update auto-pay",
                        message: err instanceof Error ? err.message : "Try again"
                      });
                    }
                  }}
                  aria-pressed={autoPay}
                >
                  {autoPay ? "Enabled" : "Paused"}
                </button>
              </div>
              <div className="rounded-input border border-slate-200 p-3 text-sm text-slate-600">
                If a payment fails, you’ll be notified and we’ll retry within 24 hours.
              </div>
            </Card>

            <Card className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-brand-navy">Payment methods</p>
                  <p className="text-xs text-slate-500">Choose a default method for invoices and auto-pay.</p>
                </div>
                <Button variant="secondary" type="button" onClick={() => notify("Add payment method opened")}>
                  <Plus size={16} aria-hidden /> Add
                </Button>
              </div>

              <div className="space-y-2">
                <button
                  type="button"
                  className={`focus-ring w-full rounded-input border px-3 py-3 text-left text-sm ${
                    defaultMethod === "card" ? "border-brand-navy bg-white" : "border-slate-200 bg-white"
                  }`}
                  onClick={async () => {
                    setDefaultMethod("card");
                    try {
                      await apiQuery("/api/billing/wallet", {
                        method: "PATCH",
                        body: JSON.stringify({ defaultPaymentMethod: "card" })
                      });
                    } catch {
                      /* keep UI selection */
                    }
                  }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <CreditCard size={16} aria-hidden />
                      <p className="font-semibold text-brand-navy">Corporate Visa •••• 4242</p>
                    </div>
                    <Badge tone={defaultMethod === "card" ? "success" : "default"}>
                      {defaultMethod === "card" ? "Default" : "Available"}
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">Exp. 11/28 · 3DS enabled</p>
                </button>

                <button
                  type="button"
                  className={`focus-ring w-full rounded-input border px-3 py-3 text-left text-sm ${
                    defaultMethod === "bank" ? "border-brand-navy bg-white" : "border-slate-200 bg-white"
                  }`}
                  onClick={async () => {
                    setDefaultMethod("bank");
                    try {
                      await apiQuery("/api/billing/wallet", {
                        method: "PATCH",
                        body: JSON.stringify({ defaultPaymentMethod: "bank" })
                      });
                    } catch {
                      /* keep UI selection */
                    }
                  }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-brand-navy">ACH Bank Account •••• 0193</p>
                      <p className="mt-1 text-xs text-slate-500">Settlement: 1–2 business days</p>
                    </div>
                    <Badge tone={defaultMethod === "bank" ? "success" : "default"}>
                      {defaultMethod === "bank" ? "Default" : "Available"}
                    </Badge>
                  </div>
                </button>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
