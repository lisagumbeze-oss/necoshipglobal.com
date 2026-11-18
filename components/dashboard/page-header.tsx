import type { ReactNode } from "react";
import { PageHeader } from "@/components/design-system/page";

/** Portal-compatible page header using the shared design system. */
export function DashboardPageHeader({
  title,
  description,
  actions
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return <PageHeader title={title} description={description} actions={actions} />;
}
