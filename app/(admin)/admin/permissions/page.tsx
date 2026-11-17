"use client";

import { useState } from "react";
import { Card } from "@/components/design-system/ui";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { AdminUiNote } from "@/components/admin/admin-ui-note";
import {
  ADMIN_PERMISSION_CATEGORIES,
  ADMIN_ROLE_DEFS,
  demoPermissionGranted,
  type DemoPermissionAction
} from "@/lib/demo/admin-fixtures";

const ACTIONS: DemoPermissionAction[] = ["view", "create", "edit", "approve", "delete", "manage"];

export default function AdminPermissionsPage() {
  const [roleId, setRoleId] = useState<string>(ADMIN_ROLE_DEFS[0].id);

  return (
    <section className="mx-auto max-w-7xl space-y-5">
      <DashboardPageHeader
        title="Permission matrix"
        description="Illustrative role-permission matrix for administrative review. Changes are not persisted and do not update backend authorization."
      />
      <AdminUiNote>
        Frontend interface only. Editing cells does not grant access. Future enforcement must occur at API and data-access
        layers. Existing protected `/admin` routes remain governed by current authentication.
      </AdminUiNote>

      <Card className="flex flex-wrap items-end gap-3">
        <div>
          <label className="text-xs font-semibold uppercase text-slate-500" htmlFor="perm-role">
            Role
          </label>
          <select
            id="perm-role"
            className="mt-1 h-11 rounded-md border border-slate-300 bg-white px-3 text-sm"
            value={roleId}
            onChange={(e) => setRoleId(e.target.value)}
          >
            {ADMIN_ROLE_DEFS.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
        <p className="text-xs text-slate-500">Matrix cells are demonstration-only.</p>
      </Card>

      <Card className="overflow-x-auto p-0">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Category</th>
              {ACTIONS.map((a) => (
                <th key={a} className="px-3 py-3 capitalize">
                  {a}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ADMIN_PERMISSION_CATEGORIES.map((category) => (
              <tr key={category} className="border-b border-slate-100 last:border-0">
                <td className="px-4 py-3 font-medium text-brand-navy">{category}</td>
                {ACTIONS.map((action) => {
                  const granted = demoPermissionGranted(roleId, category, action);
                  return (
                    <td key={action} className="px-3 py-3">
                      <input
                        type="checkbox"
                        checked={granted}
                        readOnly
                        aria-label={`${category} ${action}`}
                        className="h-4 w-4 accent-brand-navy"
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </section>
  );
}
