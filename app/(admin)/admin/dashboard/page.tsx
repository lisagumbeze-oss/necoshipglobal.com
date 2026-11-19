import { AdminDashboardView } from "@/components/admin/admin-dashboard-view";
import { OperationsDashboardView } from "@/components/operations/operations-dashboard-view";

/**
 * Unified staff home: platform administration overview + logistics control tower.
 */
export default function AdminDashboardPage() {
  return (
    <div className="space-y-10 pb-10">
      <AdminDashboardView />
      <div className="border-t border-ns-border pt-8">
        <OperationsDashboardView />
      </div>
    </div>
  );
}
