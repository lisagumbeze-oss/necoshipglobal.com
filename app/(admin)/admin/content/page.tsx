"use client";

import { useState } from "react";
import { Badge, Button, Card } from "@/components/design-system/ui";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { AdminNonOperationalNote } from "@/components/admin/admin-ui-note";
import { demoCmsEntries } from "@/lib/demo/admin-fixtures";

export default function AdminContentPage() {
  const [selected, setSelected] = useState(demoCmsEntries[0]?.id ?? "");
  const entry = demoCmsEntries.find((e) => e.id === selected) ?? demoCmsEntries[0];

  return (
    <section className="mx-auto max-w-6xl space-y-5">
      <DashboardPageHeader
        title="Website content management"
        description="Homepage, services, FAQ, locations, announcements and public notices. UI-only controls in Module 5."
      />
      <AdminNonOperationalNote action="Publishing website content" />

      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <Card className="overflow-x-auto p-0">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Section</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Updated</th>
              </tr>
            </thead>
            <tbody>
              {demoCmsEntries.map((e) => (
                <tr
                  key={e.id}
                  className={`cursor-pointer border-b border-slate-100 ${selected === e.id ? "bg-slate-50" : ""}`}
                  onClick={() => setSelected(e.id)}
                >
                  <td className="px-4 py-3">{e.section}</td>
                  <td className="px-4 py-3 font-medium text-brand-navy">{e.title}</td>
                  <td className="px-4 py-3">
                    <Badge tone={e.status === "Published" ? "success" : "warning"}>{e.status}</Badge>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{e.updatedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {entry ? (
          <Card className="space-y-3 text-sm h-fit">
            <h2 className="font-semibold text-brand-navy">Content editor preview</h2>
            <p>
              {entry.section} · {entry.title}
            </p>
            <textarea
              className="min-h-[140px] w-full rounded-md border border-slate-300 bg-slate-50 p-3 text-sm"
              defaultValue="Demonstration content body — not published to the live site from this module."
              readOnly
            />
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="secondary" disabled>
                Save draft
              </Button>
              <Button type="button" disabled>
                Publish
              </Button>
            </div>
            <p className="text-xs text-slate-500">
              Legacy CMS route remains at <code className="rounded bg-slate-100 px-1">/admin/cms</code>.
            </p>
          </Card>
        ) : null}
      </div>
    </section>
  );
}
