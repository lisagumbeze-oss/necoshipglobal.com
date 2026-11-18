import type { ReactNode } from "react";
import { EmptyState as DesignEmptyState } from "@/components/design-system/feedback";

/** @deprecated Prefer `@/components/design-system` EmptyState. Kept for portal compatibility. */
export function EmptyState({
  title,
  description,
  action
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return <DesignEmptyState title={title} description={description} action={action} />;
}
