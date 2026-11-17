"use client";

import Link from "next/link";
import { useState } from "react";
import { Button, Card } from "@/components/design-system/ui";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { demoNotifications, type DemoNotification } from "@/lib/demo/customer-fixtures";

export default function NotificationsPage() {
  const [rows, setRows] = useState<DemoNotification[]>(demoNotifications);

  return (
    <section className="mx-auto max-w-4xl space-y-5">
      <DashboardPageHeader
        title="Notifications"
        description="Demonstration notification feed for shipment, quotation and invoice events."
        actions={
          <Button
            type="button"
            variant="secondary"
            onClick={() => setRows((prev) => prev.map((n) => ({ ...n, read: true })))}
          >
            Mark all read
          </Button>
        }
      />

      <ul className="space-y-3">
        {rows.map((n) => (
          <li key={n.id}>
            <Card className={`space-y-2 ${n.read ? "opacity-80" : "border-brand-yellow/40"}`}>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-brand-navy">{n.title}</p>
                  <p className="text-sm text-slate-600">{n.message}</p>
                  <p className="mt-1 text-xs text-slate-500">{new Date(n.createdAt).toLocaleString()}</p>
                </div>
                {!n.read ? (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setRows((prev) => prev.map((row) => (row.id === n.id ? { ...row, read: true } : row)))}
                  >
                    Mark read
                  </Button>
                ) : null}
              </div>
              {n.href ? (
                <Link href={n.href as never} className="text-sm font-semibold text-brand-navy hover:underline">
                  Open related page
                </Link>
              ) : null}
            </Card>
          </li>
        ))}
      </ul>
    </section>
  );
}
