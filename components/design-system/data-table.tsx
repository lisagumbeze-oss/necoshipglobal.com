"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { Button } from "@/components/design-system/ui";

export type DataTableColumn<T> = {
  id: string;
  header: ReactNode;
  cell: (row: T) => ReactNode;
  className?: string;
  headerClassName?: string;
  sortable?: boolean;
};

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  empty,
  sortColumn,
  sortDirection,
  onSort,
  className,
  dense = false
}: {
  columns: DataTableColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  empty?: ReactNode;
  sortColumn?: string;
  sortDirection?: "asc" | "desc";
  onSort?: (columnId: string) => void;
  className?: string;
  dense?: boolean;
}) {
  return (
    <div className={cn("overflow-x-auto rounded-card border border-ns-border bg-white shadow-sm", className)}>
      <table className="min-w-full border-collapse text-left text-sm">
        <thead className="bg-brand-surface-muted">
          <tr>
            {columns.map((column) => {
              const sorted = sortColumn === column.id;
              const ariaSort = sorted ? (sortDirection === "asc" ? "ascending" : "descending") : "none";
              const sortLabel = sorted
                ? `Sort by ${typeof column.header === "string" ? column.header : column.id}, currently ${sortDirection === "asc" ? "ascending" : "descending"}`
                : `Sort by ${typeof column.header === "string" ? column.header : column.id}`;
              return (
                <th
                  key={column.id}
                  scope="col"
                  aria-sort={column.sortable && onSort ? ariaSort : undefined}
                  className={cn(
                    "ns-table-heading whitespace-nowrap px-3 py-3",
                    dense ? "py-2" : "py-3",
                    column.headerClassName
                  )}
                >
                  {column.sortable && onSort ? (
                    <button
                      type="button"
                      className="focus-ring inline-flex items-center gap-1 rounded-sm text-left"
                      onClick={() => onSort(column.id)}
                      aria-label={sortLabel}
                    >
                      {column.header}
                      <span aria-hidden className="text-slate-400">
                        {sorted ? (sortDirection === "asc" ? "↑" : "↓") : "↕"}
                      </span>
                    </button>
                  ) : (
                    column.header
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-3 py-10 text-center text-slate-500">
                {empty ?? "No records to display."}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr
                key={rowKey(row)}
                className="border-t border-ns-border transition hover:bg-brand-surface/80"
              >
                {columns.map((column) => (
                  <td
                    key={column.id}
                    className={cn(
                      "px-3 text-brand-navy",
                      dense ? "py-2" : "py-3",
                      column.className
                    )}
                  >
                    {column.cell(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export function Pagination({
  page,
  pageCount,
  onPageChange,
  summary,
  className
}: {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  summary?: ReactNode;
  className?: string;
}) {
  const canPrev = page > 1;
  const canNext = page < pageCount;

  return (
    <div className={cn("flex flex-wrap items-center justify-between gap-3", className)}>
      <p className="ns-meta">{summary ?? `Page ${page} of ${Math.max(pageCount, 1)}`}</p>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={!canPrev}
          onClick={() => onPageChange(page - 1)}
          aria-label="Previous page"
        >
          Previous
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={!canNext}
          onClick={() => onPageChange(page + 1)}
          aria-label="Next page"
        >
          Next
        </Button>
      </div>
    </div>
  );
}

export function RowActions({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("flex items-center justify-end gap-1", className)}>{children}</div>;
}
