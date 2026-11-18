"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { CheckCircle2, CircleAlert, Info, X, XCircle } from "lucide-react";

type ToastTone = "success" | "error" | "warning" | "info";
type ToastItem = {
  id: string;
  title: string;
  message?: string;
  tone: ToastTone;
};

type ToastContextValue = {
  pushToast: (toast: Omit<ToastItem, "id">) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

function iconForTone(tone: ToastTone) {
  if (tone === "success") return CheckCircle2;
  if (tone === "error") return XCircle;
  if (tone === "warning") return CircleAlert;
  return Info;
}

function toneClasses(tone: ToastTone) {
  if (tone === "success") return "border-brand-success/20 bg-ns-successSoft text-brand-success";
  if (tone === "error") return "border-brand-danger/20 bg-ns-dangerSoft text-brand-danger";
  if (tone === "warning") return "border-brand-warning/20 bg-ns-warningSoft text-brand-warning";
  return "border-brand-yellow/40 bg-brand-yellow-soft text-brand-navy";
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const pushToast = useCallback((toast: Omit<ToastItem, "id">) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.id !== id));
    }, 4200);
  }, []);

  const value = useMemo<ToastContextValue>(() => ({ pushToast }), [pushToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-[100] flex w-full max-w-sm flex-col gap-2">
        {toasts.map((toast) => {
          const Icon = iconForTone(toast.tone);
          return (
            <div
              key={toast.id}
              className={`pointer-events-auto rounded-card border p-3 shadow-overlay ${toneClasses(toast.tone)}`}
              role="status"
              aria-live="polite"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2">
                  <Icon size={16} aria-hidden className="mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold">{toast.title}</p>
                    {toast.message ? <p className="mt-1 text-xs opacity-90">{toast.message}</p> : null}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => dismiss(toast.id)}
                  className="focus-ring rounded-button p-1"
                  aria-label="Dismiss toast"
                >
                  <X size={14} aria-hidden />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}
