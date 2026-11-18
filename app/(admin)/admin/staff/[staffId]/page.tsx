"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Badge, Card, EmptyState } from "@/components/design-system";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { AdminUiNote } from "@/components/admin/admin-ui-note";
import { demoAuditEntries, getAdminStaff } from "@/lib/demo/admin-fixtures";
import { hasPermission } from "@/lib/rbac";
import {
  STAFF_ROLE_DESCRIPTIONS,
  STAFF_ROLE_LABELS,
  deniedPermissionsForRole,
  grantedPermissionsForRole,
  roleConsoleAccess,
  staffLabelToPersistedRole
} from "@/lib/rbac-matrix";

export default function AdminStaffDetailPage() {
  const params = useParams<{ staffId: string }>();
  const { data: session } = useSession();
  const sessionRole = session?.user?.staffRole ?? null;
  const canView = !sessionRole || hasPermission(sessionRole, "staff.view");

  const staff = getAdminStaff(params.staffId);

  if (!canView) {
    return (
      <section className="mx-auto max-w-ns-xl space-y-6">
        <DashboardPageHeader title="Staff profile" description="staff.view permission required." />
        <EmptyState title="Access restricted" description="Your session role does not include staff.view." />
      </section>
    );
  }

  if (!staff) {
    return (
      <section className="mx-auto max-w-ns-xl space-y-4">
        <DashboardPageHeader title="Staff profile not found" />
        <EmptyState
          title="No matching staff record"
          description="The requested identifier is not in the demonstration directory."
          action={
            <Link href={"/admin/staff" as never} className="text-sm font-semibold text-brand-navy hover:underline">
              Back to staff
            </Link>
          }
        />
      </section>
    );
  }

  const mapped = staffLabelToPersistedRole(staff.roleLabel);
  const grants = mapped ? grantedPermissionsForRole(mapped) : [];
  const denied = mapped ? deniedPermissionsForRole(mapped) : [];
  const activity = demoAuditEntries.filter((a) => a.user === staff.name);

  return (
    <section className="mx-auto max-w-ns-xl space-y-6">
      <DashboardPageHeader
        title={staff.name}
        description={`${staff.reference} · Demonstration staff profile (UI-20)`}
        actions={
          <Link href={"/admin/staff" as never} className="text-sm font-semibold text-brand-navy hover:underline">
            Back to directory
          </Link>
        }
      />

      <AdminUiNote>
        Personnel details are separate from live authorization. Passwords, reset tokens and session secrets are never
        displayed. Last login is not available from current fixtures or staff APIs.
      </AdminUiNote>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="space-y-2 text-sm">
          <h2 className="ns-card-title">Personnel</h2>
          <p>Department: {staff.department}</p>
          <p>Job title: {staff.title}</p>
          <p>Email: {staff.email}</p>
          <p>Phone: {staff.phone}</p>
          <p>
            Employment:{" "}
            <Badge tone={staff.employmentStatus === "Active" ? "success" : "warning"}>
              {staff.employmentStatus}
            </Badge>
          </p>
          <p>
            Account:{" "}
            <Badge tone={staff.accountStatus === "Active" ? "success" : "warning"}>{staff.accountStatus}</Badge>
          </p>
          <p>
            Last login: <span className="ns-meta">Not available</span>
          </p>
        </Card>

        <Card className="space-y-2 text-sm">
          <h2 className="ns-card-title">Role presentation</h2>
          <p className="font-semibold text-brand-navy">{staff.roleLabel}</p>
          {mapped ? (
            <>
              <p>
                Mapped persisted role:{" "}
                <Badge tone="info">
                  {STAFF_ROLE_LABELS[mapped]} ({mapped})
                </Badge>
              </p>
              <p>
                Admin console:{" "}
                <Badge tone={roleConsoleAccess(mapped) ? "success" : "danger"}>
                  {roleConsoleAccess(mapped) ? "Allowed" : "Denied"}
                </Badge>
              </p>
              <p className="text-slate-600">{STAFF_ROLE_DESCRIPTIONS[mapped]}</p>
            </>
          ) : (
            <p className="text-amber-900">
              Demonstration label does not map 1:1 to a persisted StaffRole. Do not treat the label as a grant.
            </p>
          )}
        </Card>
      </div>

      {mapped ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="space-y-2">
            <h2 className="ns-card-title">Granted permissions ({grants.length})</h2>
            <ul className="flex flex-wrap gap-1.5">
              {grants.length === 0 ? (
                <li className="text-sm text-slate-500">None — deny by default.</li>
              ) : (
                grants.map((p) => (
                  <li key={p}>
                    <Badge tone="success">{p}</Badge>
                  </li>
                ))
              )}
            </ul>
          </Card>
          <Card className="space-y-2">
            <h2 className="ns-card-title">Denied permissions ({denied.length})</h2>
            <ul className="flex max-h-48 flex-wrap gap-1.5 overflow-y-auto">
              {denied.map((p) => (
                <li key={p}>
                  <Badge tone="danger">{p}</Badge>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      ) : null}

      <Card className="space-y-3">
        <h2 className="ns-card-title">Activity history (demonstration)</h2>
        {activity.length === 0 ? (
          <p className="text-sm text-slate-500">No demonstration audit rows attributed to this staff member.</p>
        ) : (
          <ul className="divide-y divide-ns-border text-sm">
            {activity.map((a) => (
              <li key={a.id} className="py-2">
                <p className="font-medium text-brand-navy">{a.summary}</p>
                <p className="ns-meta">
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
