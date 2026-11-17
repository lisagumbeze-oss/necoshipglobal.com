"use client";

import { useState } from "react";
import { Badge, Button, Card } from "@/components/design-system/ui";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { AdminNonOperationalNote } from "@/components/admin/admin-ui-note";
import { demoNotificationTemplates } from "@/lib/demo/admin-fixtures";

export default function AdminNotificationsPage() {
  const [selected, setSelected] = useState(demoNotificationTemplates[0]?.id ?? "");
  const template = demoNotificationTemplates.find((t) => t.id === selected) ?? demoNotificationTemplates[0];

  return (
    <section className="mx-auto max-w-6xl space-y-5">
      <DashboardPageHeader
        title="Notification templates"
        description="Email and SMS template directory with subject previews. Sending is disabled in Module 5."
      />
      <AdminNonOperationalNote action="Email / SMS send" />

      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <Card className="overflow-x-auto p-0">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Channel</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {demoNotificationTemplates.map((t) => (
                <tr
                  key={t.id}
                  className={`cursor-pointer border-b border-slate-100 ${selected === t.id ? "bg-slate-50" : ""}`}
                  onClick={() => setSelected(t.id)}
                >
                  <td className="px-4 py-3">{t.channel}</td>
                  <td className="px-4 py-3">{t.category}</td>
                  <td className="px-4 py-3 font-medium text-brand-navy">{t.name}</td>
                  <td className="px-4 py-3">
                    <Badge tone={t.status === "Active" ? "success" : "warning"}>{t.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {template ? (
          <Card className="space-y-3 text-sm h-fit">
            <h2 className="font-semibold text-brand-navy">Template preview</h2>
            <p>
              {template.channel} · {template.category}
            </p>
            <p className="font-medium">{template.name}</p>
            <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs uppercase text-slate-500">Subject / preview</p>
              <p className="mt-1">{template.subjectPreview}</p>
            </div>
            <Button type="button" disabled>
              Send test message
            </Button>
          </Card>
        ) : null}
      </div>
    </section>
  );
}
