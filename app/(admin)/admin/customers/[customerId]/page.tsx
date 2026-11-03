"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "react-query";
import { Badge, Button, Card, Input } from "@/components/design-system/ui";
import { apiQuery } from "@/lib/query-api";
import { LogIn, Mail, MessageSquareText, ShieldCheck } from "lucide-react";
import { useToast } from "@/components/feedback/toast-provider";

type CustomerRecord = {
  id: string;
  name: string;
  type: "Individual" | "Business" | "Enterprise";
  country: string;
  joinDate: string;
  status: "Active" | "Suspended";
  totalShipments: number;
  totalRevenueUsd: number;
  creditLimitUsd?: number;
};

type InvoiceRecord = { id: string; customer: string; amount: number; status: string };
type TicketRecord = { id: string; subject: string; status: string; lastReplyAt: string };

function money(amount: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
}

export default function CustomerDetailPage() {
  const { pushToast } = useToast();
  const params = useParams<{ customerId: string }>();
  const customerId = decodeURIComponent(params.customerId);

  const customerQuery = useQuery(["admin-customer", customerId], () =>
    apiQuery<CustomerRecord>(`/api/admin/customers/${encodeURIComponent(customerId)}`)
  );
  const invoicesQuery = useQuery(["admin-invoices", customerId], () =>
    apiQuery<InvoiceRecord[]>(`/api/billing/invoices?customerId=${encodeURIComponent(customerId)}`)
  );
  const ticketsQuery = useQuery(["admin-tickets-all"], () => apiQuery<TicketRecord[]>("/api/tickets"));

  const customer = customerQuery.data;

  const [status, setStatus] = useState<"Active" | "Suspended">("Active");
  const [creditLimit, setCreditLimit] = useState("150000");
  const [internalNote, setInternalNote] = useState("");

  const comms = useMemo(
    () => [
      { at: "Apr 22, 2026 10:22 UTC", channel: "Email", message: "Sent customs doc request template." },
      { at: "Apr 21, 2026 14:06 UTC", channel: "SMS", message: "Invoice due reminder delivered." }
    ],
    []
  );

  return (
    <main className="min-h-screen bg-brand-surface p-4 md:p-8">
      <section className="mx-auto max-w-7xl space-y-4">
        <header className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs text-slate-500">Admin / Customers / {customerId}</p>
            <h1 className="font-display text-3xl font-bold text-brand-navy">Customer Detail</h1>
            <p className="text-sm text-slate-600">Unified profile view: operations, finance, support, and comms.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" type="button" onClick={() => pushToast({ tone: "info", title: "Impersonation started" })}>
              <LogIn size={16} aria-hidden /> Login as user
            </Button>
            <Button type="button" onClick={() => pushToast({ tone: "success", title: "Customer profile saved" })}>
              Save
            </Button>
          </div>
        </header>

        {customerQuery.isLoading ? (
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="h-56 animate-pulse rounded-card bg-slate-100" />
            <div className="h-56 animate-pulse rounded-card bg-slate-100" />
            <div className="h-56 animate-pulse rounded-card bg-slate-100" />
          </div>
        ) : customerQuery.isError ? (
          <Card className="text-sm text-red-700">Failed to load customer.</Card>
        ) : !customer ? (
          <Card className="text-sm text-slate-600">Customer not found.</Card>
        ) : (
          <>
            <div className="grid gap-4 lg:grid-cols-3">
              <Card className="space-y-2">
                <p className="text-xs text-slate-500">Profile</p>
                <p className="font-display text-xl font-bold text-brand-navy">{customer.name}</p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <Badge tone="default">{customer.type}</Badge>
                  <Badge tone="default">{customer.country}</Badge>
                  <Badge tone={customer.status === "Active" ? "success" : "danger"}>{customer.status}</Badge>
                </div>
                <p className="pt-2 text-xs text-slate-500">Joined {customer.joinDate}</p>
              </Card>
              <Card className="space-y-2">
                <p className="text-xs text-slate-500">Rollup</p>
                <p className="font-display text-xl font-bold text-brand-navy">{customer.totalShipments} shipments</p>
                <p className="text-sm text-slate-600">Total revenue: {money(customer.totalRevenueUsd)}</p>
                {customer.creditLimitUsd ? <p className="text-sm text-slate-600">Credit limit: {money(customer.creditLimitUsd)}</p> : null}
              </Card>
              <Card className="space-y-2">
                <p className="text-xs text-slate-500">Account access</p>
                <select
                  className="rounded-input border border-slate-200 bg-white px-3 py-2 text-sm focus-ring"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as never)}
                  aria-label="Account status"
                >
                  <option value="Active">Active</option>
                  <option value="Suspended">Suspended</option>
                </select>
                {customer.type === "Enterprise" ? (
                  <Input value={creditLimit} onChange={(e) => setCreditLimit(e.target.value)} placeholder="Credit limit (USD)" />
                ) : (
                  <div className="rounded-input border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
                    Credit limits are Enterprise-only.
                  </div>
                )}
              </Card>
            </div>

            <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
              <div className="space-y-4">
                <Card className="space-y-2">
                  <p className="font-semibold text-brand-navy">Invoices (sample)</p>
                  {invoicesQuery.isLoading ? (
                    <div className="h-10 animate-pulse rounded-input bg-slate-100" />
                  ) : (
                    <div className="space-y-2">
                      {(invoicesQuery.data ?? []).slice(0, 3).map((inv) => (
                        <div key={inv.id} className="flex items-center justify-between gap-3 rounded-input border border-slate-200 p-3 text-sm">
                          <div>
                            <p className="font-mono font-semibold text-brand-navy">{inv.id}</p>
                            <p className="text-xs text-slate-500">{inv.customer}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-brand-navy">{money(inv.amount)}</p>
                            <Badge tone={inv.status === "Paid" ? "success" : inv.status === "Due" ? "warning" : "danger"}>{inv.status}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>

                <Card className="space-y-2">
                  <p className="font-semibold text-brand-navy">Support tickets (sample)</p>
                  {ticketsQuery.isLoading ? (
                    <div className="h-10 animate-pulse rounded-input bg-slate-100" />
                  ) : (
                    <div className="space-y-2">
                      {(ticketsQuery.data ?? []).slice(0, 3).map((t) => (
                        <div key={t.id} className="rounded-input border border-slate-200 p-3 text-sm">
                          <p className="font-semibold text-brand-navy">{t.subject}</p>
                          <p className="mt-1 text-xs text-slate-500">
                            {t.id} · {t.status} · {t.lastReplyAt}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </div>

              <div className="space-y-4">
                <Card className="space-y-2">
                  <div className="flex items-center gap-2 font-semibold text-brand-navy">
                    <ShieldCheck size={16} aria-hidden /> Internal notes
                  </div>
                  <textarea
                    className="focus-ring h-32 w-full rounded-input border border-slate-300 p-2 text-sm"
                    value={internalNote}
                    onChange={(e) => setInternalNote(e.target.value)}
                    placeholder="Staff-only notes, risk flags, and escalation markers…"
                  />
                  <Button
                    variant="secondary"
                    type="button"
                    disabled={!internalNote.trim()}
                    onClick={() => {
                      pushToast({ tone: "success", title: "Internal note saved" });
                      setInternalNote("");
                    }}
                  >
                    Save note
                  </Button>
                </Card>

                <Card className="space-y-2">
                  <p className="font-semibold text-brand-navy">Communication log</p>
                  <div className="space-y-2">
                    {comms.map((c) => (
                      <div key={c.at} className="rounded-input border border-slate-200 p-3 text-sm">
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-semibold text-brand-navy">{c.channel}</p>
                          <p className="text-xs text-slate-500">{c.at}</p>
                        </div>
                        <p className="mt-1 text-sm text-slate-600">{c.message}</p>
                      </div>
                    ))}
                  </div>
                  <div className="grid gap-2 md:grid-cols-2">
                    <Button type="button" onClick={() => pushToast({ tone: "info", title: "Customer email sent" })}>
                      <Mail size={16} aria-hidden /> Email
                    </Button>
                    <Button
                      variant="secondary"
                      type="button"
                      onClick={() => pushToast({ tone: "info", title: "Customer SMS sent" })}
                    >
                      <MessageSquareText size={16} aria-hidden /> SMS
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
