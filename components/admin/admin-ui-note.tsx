import { Card } from "@/components/design-system/ui";

export function AdminUiNote({ children }: { children: React.ReactNode }) {
  return (
    <Card className="border border-amber-200 bg-amber-50 text-sm text-amber-950">
      {children}
    </Card>
  );
}

export function AdminNonOperationalNote({ action }: { action: string }) {
  return (
    <AdminUiNote>
      <strong>{action}</strong> controls are presentation-only in Module 5. They do not modify accounts,
      shipments, finance records, permissions, or send notifications.
    </AdminUiNote>
  );
}
