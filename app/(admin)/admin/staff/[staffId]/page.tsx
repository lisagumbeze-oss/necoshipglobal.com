"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Badge, Card } from "@/components/design-system/ui";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { AdminUiNote } from "@/components/admin/admin-ui-note";
import { demoAuditEntries, getAdminStaff } from "@/lib/demo/admin-fixtures";

export default function AdminStaffDetailPage() {
  const params = useParams<{ staffId: string }>();
  const staff = getAdminStaff(params.staffId);

  if (!staff) {
    return (
      <section className="mx-auto max-w-3xl space-y-4">
        <DashboardPageHeader title="Staff profile not found" />
        <Link href={"/admin/staff" as never} className="text-sm font-semibold text-brand-navy hover:underline">
          Back to staff
        </Link>
      </section>
    );
  }

  const activity = demoAuditEntries.filter((a) => a.user === staff.name);

  return (
    <section className="mx-auto max-w-4xl space-y-5">
      <DashboardPageHeader
        title={staff.name}
        description={`${staff.reference} · Demonstration staff profile`}
        actions={
          <Link href={"/admin/staff" as never} className="text-sm font-semibold text-brand-navy hover:underline">
            Back
          </Link>
        }
      />
      <AdminUiNote>
        Personnel information is shown separately from platform privileges. Viewing this profile does not grant or change
        authorization.
      </AdminUiNote>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="space-y-2 text-sm">
          <h2 className="font-semibold text-brand-navy">Personnel</h2>
          <p>Department: {staff.department}</p>
          <p>Job title: {staff.title}</p>
          <p>Email: {staff.email}</p>
          <p>Phone: {staff.phone}</p>
          <p>
            Employment: <Badge tone={staff.employmentStatus === "Active" ? "success" : "warning"}>{staff.employmentStatus}</Badge>
          </p>
          <p>
            Account: <Badge tone={staff.accountStatus === "Active" ? "success" : "warning"}>{staff.accountStatus}</Badge>
          </p>
        </Card>
        <Card className="space-y-2 text-sm">
          <h2 className="font-semibold text-brand-navy">Assigned operational role (label)</h2>
          <p className="font-semibold text-brand-navy">{staff.roleLabel}</p>
          <p className="text-xs text-slate-500">
            Representational only. Super Administrator oversight remains distinct from narrowly scoped operational roles.
          </p>
        </Card>
      </div>

      <Card className="space-y-3">
        <h2 className="font-semibold text-brand-navy">Activity history (demonstration)</h2>
        {activity.length === 0 ? (
          <p className="text-sm text-slate-500">No demonstration audit rows attributed to this staff member.</p>
        ) : (
          <ul className="divide-y divide-slate-100 text-sm">
            {activity.map((a) => (
              <li key={a.id} className="py-2">
                <p className="font-medium text-brand-navy">{a.summary}</p>
                <p className="text-xs text-slate-500">
                  {a.reference} · {new Date(a.at).toLocaleString()} · {a.outcome}
                </p>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </section>
  );
}
