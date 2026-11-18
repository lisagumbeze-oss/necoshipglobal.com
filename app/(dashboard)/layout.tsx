import { CustomerShell } from "@/components/dashboard/customer-shell";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <CustomerShell>{children}</CustomerShell>;
}
