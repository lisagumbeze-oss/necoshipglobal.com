import Link from "next/link";
import { Card } from "@/components/design-system/ui";

type RecipientAccessUnavailableProps = {
  /** Path token is present but not treated as verified credentials. */
  tokenHint?: string;
};

/**
 * Shown when a recipient link is opened but server-side signed-token
 * verification is not yet implemented. Does not load shipment or recipient records.
 */
export function RecipientAccessUnavailable({ tokenHint }: RecipientAccessUnavailableProps) {
  return (
    <main className="min-h-screen bg-brand-surface px-4 py-8 md:px-8">
      <div className="mx-auto max-w-xl space-y-5">
        <header className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-yellow">Recipient portal</p>
          <h1 className="font-display text-3xl font-bold text-brand-navy">Secure access unavailable</h1>
          <p className="text-sm text-slate-600">
            This link cannot open a shipment until signed recipient-token verification is enabled on the
            server. Tracking numbers and path tokens are not used as authorization credentials.
          </p>
        </header>

        <Card className="space-y-3">
          <p className="text-sm text-slate-700">
            What you can do now: use public tracking for status only, or contact support if you received a
            delivery notification and need help with access.
          </p>
          {tokenHint ? (
            <p className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-xs text-slate-500">
              Link reference retained locally only — not verified: {tokenHint.slice(0, 12)}
              {tokenHint.length > 12 ? "…" : ""}
            </p>
          ) : null}
          <div className="flex flex-wrap gap-3 pt-1">
            <Link
              href="/tracking"
              className="inline-flex h-11 items-center justify-center rounded-button bg-brand-navy px-4 text-sm font-semibold text-white focus-ring"
            >
              Public tracking
            </Link>
            <Link
              href="/support"
              className="inline-flex h-11 items-center justify-center rounded-button border border-slate-300 bg-white px-4 text-sm font-semibold text-brand-navy focus-ring"
            >
              Contact support
            </Link>
          </div>
        </Card>

        <p className="text-xs text-slate-500">
          Future access will validate a signed, time-limited token on the server before any recipient or
          shipment details are shown.
        </p>
      </div>
    </main>
  );
}
