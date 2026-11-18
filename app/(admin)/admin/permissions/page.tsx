"use client";

import { Fragment, useMemo, useState } from "react";
import Link from "next/link";
import { Badge, Card, ChartContainer } from "@/components/design-system";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { AdminUiNote } from "@/components/admin/admin-ui-note";
import {
  ALL_PERMISSIONS,
  PERSISTED_STAFF_ROLES,
  STAFF_ROLE_DESCRIPTIONS,
  STAFF_ROLE_LABELS,
  deniedPermissionsForRole,
  grantedPermissionsForRole,
  permissionDomain,
  permissionVerb,
  permissionsByDomain,
  roleConsoleAccess,
  roleHasPermission,
  type PermissionVerb
} from "@/lib/rbac-matrix";
import type { Permission, StaffRole } from "@/lib/rbac";

const VERB_ORDER: PermissionVerb[] = ["access", "view", "create", "operate", "assign", "manage", "configure", "other"];

function verbTone(granted: boolean): "success" | "danger" | "default" {
  if (granted) return "success";
  return "danger";
}

export default function AdminPermissionsPage() {
  const [compareRole, setCompareRole] = useState<StaffRole>("ADMIN");
  const [focusRole, setFocusRole] = useState<StaffRole>("OPS_MANAGER");
  const domains = useMemo(() => permissionsByDomain(), []);

  const focusGranted = grantedPermissionsForRole(focusRole);
  const focusDenied = deniedPermissionsForRole(focusRole);
  const adminGranted = grantedPermissionsForRole("ADMIN");

  const comparisonMissing = useMemo(
    () => adminGranted.filter((p) => !roleHasPermission(focusRole, p)),
    [focusRole, adminGranted]
  );

  return (
    <section className="mx-auto max-w-ns-xl space-y-6">
      <DashboardPageHeader
        title="Roles & permissions"
        description="UI-30 functional matrix projected from lib/rbac.ts. Read-only — no UI-only roles and no permission editing."
        actions={
          <Link href={"/admin/roles" as never} className="text-sm font-semibold text-brand-navy hover:underline">
            Role catalogue
          </Link>
        }
      />

      <AdminUiNote>
        Cells reflect `ROLE_PERMISSIONS` / `hasPermission` in `lib/rbac.ts`. There is no authorized backend API to mutate
        role grants from this page. Changing checkboxes would disagree with server enforcement — editing is disabled.
      </AdminUiNote>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="space-y-1 p-4">
          <p className="ns-meta uppercase">Persisted roles</p>
          <p className="font-display text-2xl font-bold text-brand-navy">{PERSISTED_STAFF_ROLES.length}</p>
        </Card>
        <Card className="space-y-1 p-4">
          <p className="ns-meta uppercase">Permission IDs</p>
          <p className="font-display text-2xl font-bold text-brand-navy">{ALL_PERMISSIONS.length}</p>
        </Card>
        <Card className="space-y-1 p-4">
          <p className="ns-meta uppercase">Admin grants</p>
          <p className="font-display text-2xl font-bold text-brand-navy">{adminGranted.length}</p>
        </Card>
        <Card className="space-y-1 p-4">
          <p className="ns-meta uppercase">Focus role denied</p>
          <p className="font-display text-2xl font-bold text-brand-navy">{focusDenied.length}</p>
        </Card>
      </div>

      <Card className="flex flex-wrap items-end gap-3">
        <div>
          <label className="ns-meta uppercase" htmlFor="perm-focus">
            Focus role
          </label>
          <select
            id="perm-focus"
            className="mt-1 h-11 rounded-input border border-ns-border bg-white px-3 text-sm"
            value={focusRole}
            onChange={(e) => setFocusRole(e.target.value as StaffRole)}
          >
            {PERSISTED_STAFF_ROLES.map((role) => (
              <option key={role} value={role}>
                {STAFF_ROLE_LABELS[role]} ({role})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="ns-meta uppercase" htmlFor="perm-compare">
            Compare column
          </label>
          <select
            id="perm-compare"
            className="mt-1 h-11 rounded-input border border-ns-border bg-white px-3 text-sm"
            value={compareRole}
            onChange={(e) => setCompareRole(e.target.value as StaffRole)}
          >
            {PERSISTED_STAFF_ROLES.map((role) => (
              <option key={role} value={role}>
                {STAFF_ROLE_LABELS[role]} ({role})
              </option>
            ))}
          </select>
        </div>
        <p className="text-sm text-slate-600">
          Console access:{" "}
          <Badge tone={roleConsoleAccess(focusRole) ? "success" : "danger"}>
            {roleConsoleAccess(focusRole) ? "Allowed" : "Denied"}
          </Badge>
        </p>
      </Card>

      <Card className="space-y-2 md:hidden">
        <h2 className="ns-card-title">Mobile role inspector</h2>
        <p className="text-sm text-slate-600">
          On small screens, use the focus role selector above to review granted and denied permissions. The full
          multi-role matrix is available from tablet width upward.
        </p>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="space-y-3">
          <h2 className="ns-card-title">{STAFF_ROLE_LABELS[focusRole]} access</h2>
          <p className="text-sm text-slate-600">{STAFF_ROLE_DESCRIPTIONS[focusRole]}</p>
          <div>
            <p className="ns-meta mb-2 uppercase">Granted ({focusGranted.length})</p>
            <ul className="flex flex-wrap gap-1.5">
              {focusGranted.length === 0 ? (
                <li className="text-sm text-slate-500">None — deny by default.</li>
              ) : (
                focusGranted.map((p) => (
                  <li key={p}>
                    <Badge tone="success">{p}</Badge>
                  </li>
                ))
              )}
            </ul>
          </div>
          <div>
            <p className="ns-meta mb-2 uppercase">Explicitly denied ({focusDenied.length})</p>
            <ul className="flex max-h-56 flex-col gap-1.5 overflow-y-auto sm:max-h-40 sm:flex-wrap sm:flex-row">
              {focusDenied.map((p) => (
                <li key={p}>
                  <Badge tone="danger">{p}</Badge>
                </li>
              ))}
            </ul>
          </div>
        </Card>

        <ChartContainer
          title="Administrator comparison"
          description={`Permissions granted to ADMIN but not to ${STAFF_ROLE_LABELS[focusRole]}.`}
        >
          {comparisonMissing.length === 0 ? (
            <p className="text-sm text-slate-600">This role matches the administrator allowlist for all listed permissions.</p>
          ) : (
            <ul className="flex flex-wrap gap-1.5">
              {comparisonMissing.map((p) => (
                <li key={p}>
                  <Badge tone="warning">{p}</Badge>
                </li>
              ))}
            </ul>
          )}
        </ChartContainer>
      </div>

      <Card className="hidden overflow-x-auto p-0 md:block">
        <table className="min-w-full text-left text-sm" aria-label="Permission matrix by role">
          <caption className="sr-only">
            Read-only permission matrix for persisted staff roles. Granted and denied cells mirror lib/rbac.ts.
          </caption>
          <thead className="border-b border-ns-border bg-brand-surface-muted text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th scope="col" className="sticky left-0 z-10 bg-brand-surface-muted px-4 py-3">
                Permission
              </th>
              <th scope="col" className="px-3 py-3">
                Verb
              </th>
              {PERSISTED_STAFF_ROLES.map((role) => (
                <th
                  key={role}
                  scope="col"
                  className={`px-3 py-3 ${role === focusRole || role === compareRole ? "bg-brand-yellow/20 text-brand-navy" : ""}`}
                >
                  <span className="block whitespace-nowrap">{STAFF_ROLE_LABELS[role]}</span>
                  <span className="font-mono text-[10px] font-normal normal-case text-slate-500">{role}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {domains.map(({ domain, permissions }) => (
              <Fragment key={`domain-${domain}`}>
                <tr className="border-b border-ns-border bg-slate-50/80">
                  <th
                    scope="colgroup"
                    colSpan={2 + PERSISTED_STAFF_ROLES.length}
                    className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-brand-navy"
                  >
                    {domain}
                  </th>
                </tr>
                {permissions
                  .slice()
                  .sort((a, b) => VERB_ORDER.indexOf(permissionVerb(a)) - VERB_ORDER.indexOf(permissionVerb(b)))
                  .map((permission: Permission) => (
                    <tr key={permission} className="border-b border-ns-border last:border-0">
                      <th scope="row" className="sticky left-0 z-10 bg-white px-4 py-2.5 font-mono text-xs font-semibold text-brand-navy">
                        {permission}
                      </th>
                      <td className="px-3 py-2.5 capitalize text-slate-600">{permissionVerb(permission)}</td>
                      {PERSISTED_STAFF_ROLES.map((role) => {
                        const granted = roleHasPermission(role, permission);
                        return (
                          <td
                            key={`${role}-${permission}`}
                            className={`px-3 py-2.5 ${role === focusRole || role === compareRole ? "bg-brand-yellow/5" : ""}`}
                          >
                            <span className="sr-only">
                              {role} {permission}: {granted ? "granted" : "denied"}
                            </span>
                            <Badge tone={verbTone(granted)} aria-hidden>
                              {granted ? "Allow" : "Deny"}
                            </Badge>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
              </Fragment>
            ))}
          </tbody>
        </table>
      </Card>

      <Card className="space-y-2 text-sm text-slate-600">
        <h2 className="ns-card-title">Read / create / update / delete distinctions</h2>
        <p>
          The persisted model uses capability verbs on each identifier (view, create, operate, assign, manage, configure,
          access) rather than a separate CRUD grid per resource. Where both view and manage exist (for example{" "}
          <code className="font-mono text-xs">finance.view</code> / <code className="font-mono text-xs">finance.manage</code>
          ), manage implies write-side administration and view is read-only. There is no standalone delete permission —
          destructive API routes map to manage (see `ADMIN_ROUTE_PERMISSIONS` in `lib/rbac.ts`).
        </p>
        <p>
          Domain hint for selected cell context: <strong>{permissionDomain(focusGranted[0] ?? "admin.access")}</strong>.
        </p>
      </Card>
    </section>
  );
}
