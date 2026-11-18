"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button, IconButton } from "@/components/design-system/ui";

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  className
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}) {
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const node = dialogRef.current;
    if (!node) return;
    if (open && !node.open) node.showModal();
    if (!open && node.open) node.close();
  }, [open]);

  useEffect(() => {
    const node = dialogRef.current;
    if (!node) return;
    const onCancel = (event: Event) => {
      event.preventDefault();
      onClose();
    };
    node.addEventListener("cancel", onCancel);
    return () => node.removeEventListener("cancel", onCancel);
  }, [onClose]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      className={cn(
        "w-[min(100%,32rem)] rounded-panel border border-ns-border bg-white p-0 text-brand-navy shadow-overlay open:flex open:flex-col backdrop:bg-brand-navy/50",
        className
      )}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
    >
      <div className="flex items-start justify-between gap-3 border-b border-ns-border px-5 py-4">
        <div>
          <h2 id={titleId} className="ns-section-title">
            {title}
          </h2>
          {description ? (
            <p id={descriptionId} className="ns-body mt-1">
              {description}
            </p>
          ) : null}
        </div>
        <IconButton label="Close dialog" onClick={onClose}>
          <span aria-hidden>×</span>
        </IconButton>
      </div>
      <div className="px-5 py-4">{children}</div>
      {footer ? <div className="flex justify-end gap-2 border-t border-ns-border px-5 py-4">{footer}</div> : null}
    </dialog>
  );
}

export function Drawer({
  open,
  onClose,
  title,
  children,
  side = "right",
  className
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  side?: "left" | "right";
  className?: string;
}) {
  const titleId = useId();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex" role="presentation">
      <button
        type="button"
        className="absolute inset-0 bg-brand-navy/40"
        aria-label="Close panel"
        onClick={onClose}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn(
          "relative z-10 flex h-full w-full max-w-md flex-col bg-white shadow-overlay",
          side === "right" ? "ml-auto" : "mr-auto",
          className
        )}
      >
        <div className="flex items-center justify-between border-b border-ns-border px-4 py-3">
          <h2 id={titleId} className="ns-section-title">
            {title}
          </h2>
          <Button type="button" variant="ghost" size="sm" onClick={onClose} aria-label="Close drawer">
            Close
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-4">{children}</div>
      </aside>
    </div>
  );
}
