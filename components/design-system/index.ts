/**
 * NECO Ship Global design system — UI Phase 1 public surface.
 * Prefer importing from this barrel for new UI work.
 */

export {
  Badge,
  Button,
  ButtonLink,
  buttonVariants,
  Card,
  ChartContainer,
  DateField,
  FormField,
  IconButton,
  Input,
  KpiCard,
  SearchField,
  Select,
  StatusBadge,
  Textarea
} from "@/components/design-system/ui";

export { Breadcrumbs, FilterBar, PageHeader, Tabs } from "@/components/design-system/page";
export type { BreadcrumbItem } from "@/components/design-system/page";

export { DataTable, Pagination, RowActions } from "@/components/design-system/data-table";
export type { DataTableColumn } from "@/components/design-system/data-table";

export {
  AlertBanner,
  EmptyState,
  ErrorState,
  Skeleton,
  SkeletonText,
  TableSkeleton,
  ToastFrame
} from "@/components/design-system/feedback";

export { Drawer, Modal } from "@/components/design-system/overlays";
export { Timeline } from "@/components/design-system/timeline";
export type { TimelineItem } from "@/components/design-system/timeline";
