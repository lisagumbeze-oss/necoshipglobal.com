"use client";

import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { Button } from "@/components/design-system/ui";
import { BRAND } from "@/lib/brand";

export function LiveChatWidget() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2 md:bottom-6 md:right-6">
      {open ? (
        <div
          className="surface-card w-[min(100vw-2rem,320px)] space-y-3 border border-slate-200 p-4 shadow-layered"
          role="dialog"
          aria-label="Live chat"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-blue text-sm font-bold text-white">
                SK
              </div>
              <div>
                <p className="text-sm font-semibold text-brand-navy">Sam Kim</p>
                <p className="text-xs text-slate-500">{BRAND.name} Support</p>
              </div>
            </div>
            <button
              type="button"
              className="focus-ring rounded-input p-1 text-slate-500 hover:bg-slate-100"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
            >
              <X size={18} />
            </button>
          </div>
          <p className="text-sm text-slate-600">
            Hi — we&apos;re online. Ask about tracking, customs, or billing and we&apos;ll route you to the right specialist.
          </p>
          <textarea
            className="focus-ring min-h-[72px] w-full rounded-input border border-slate-300 p-2 text-sm"
            placeholder="Type your message..."
          />
          <Button className="w-full" type="button">
            Send
          </Button>
        </div>
      ) : null}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="focus-ring flex items-center gap-2 rounded-full bg-brand-blue px-4 py-3 text-sm font-semibold text-white shadow-layered hover:bg-blue-600"
        aria-expanded={open}
        aria-controls="live-chat-panel"
      >
        <MessageCircle size={18} aria-hidden />
        {open ? "Close" : "Live chat"}
      </button>
    </div>
  );
}
