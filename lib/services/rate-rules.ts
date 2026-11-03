import type { RateOption, RateRequest } from "@/lib/services/carriers";
import { memoryStore } from "@/lib/repository/memory-store";

type RateRule = {
  id: string;
  name: string;
  priority: number;
  active: boolean;
  conditions?: {
    maxWeightKg?: number;
    minWeightKg?: number;
    international?: boolean;
    minDeclaredValueCents?: number;
    destZones?: string[];
    originZones?: string[];
  };
  actions?: {
    sortBy?: "price_asc" | "price_desc" | "transit_asc";
    preferCarriers?: string[];
    excludeCarriers?: string[];
    requireServiceTypes?: string[];
    surchargePct?: number;
    boostServiceTypes?: string[];
  };
};

function rules(): RateRule[] {
  return ((memoryStore.rateRules ??= []) as RateRule[]).filter((r) => r.active);
}

function matches(rule: RateRule, req: RateRequest & { declaredValueCents?: number }) {
  const c = rule.conditions ?? {};
  if (c.maxWeightKg != null && req.weightKg > c.maxWeightKg) return false;
  if (c.minWeightKg != null && req.weightKg < c.minWeightKg) return false;
  const intl = req.originCountry.toUpperCase() !== req.destCountry.toUpperCase();
  if (c.international != null && c.international !== intl) return false;
  if (c.minDeclaredValueCents != null && (req.declaredValueCents ?? 0) < c.minDeclaredValueCents) return false;
  if (c.destZones?.length) {
    const dest = req.destCountry.toUpperCase();
    if (!c.destZones.some((z) => dest.includes(z.toUpperCase()) || z.toUpperCase() === "EU")) return false;
  }
  if (c.originZones?.length) {
    const origin = req.originCountry.toUpperCase();
    if (!c.originZones.some((z) => origin.includes(z.toUpperCase()))) return false;
  }
  return true;
}

/** Apply admin rate-shopping rules on top of raw carrier/local rates. */
export function applyRateRules(
  rates: RateOption[],
  req: RateRequest & { declaredValueCents?: number }
): { rates: RateOption[]; appliedRuleIds: string[] } {
  const applied: string[] = [];
  let next = rates.map((r) => ({ ...r }));

  // Also merge rate-card floor prices when present
  for (const card of memoryStore.rateCards) {
    const service = String(card.serviceType ?? "");
    const base = Number(card.baseCents ?? 0);
    const perKg = Number(card.perKgCents ?? 0);
    const floor = Math.round(base + req.weightKg * perKg);
    next = next.map((r) => {
      if (service && r.serviceType !== service && !String(r.serviceCode).includes(service.toLowerCase())) return r;
      if (floor > 0 && r.amountCents < floor) return { ...r, amountCents: floor };
      return r;
    });
  }

  const sortedRules = [...rules()].sort((a, b) => b.priority - a.priority);
  for (const rule of sortedRules) {
    if (!matches(rule, req)) continue;
    applied.push(rule.id);
    const a = rule.actions ?? {};
    if (a.excludeCarriers?.length) {
      next = next.filter((r) => !a.excludeCarriers!.some((c) => r.carrier.toLowerCase().includes(c.toLowerCase())));
    }
    if (a.requireServiceTypes?.length) {
      const required = next.filter((r) => a.requireServiceTypes!.includes(r.serviceType));
      if (required.length) next = required;
    }
    if (a.surchargePct) {
      next = next.map((r) => ({
        ...r,
        amountCents: Math.round(r.amountCents * (1 + a.surchargePct! / 100))
      }));
    }
    if (a.preferCarriers?.length) {
      next = [...next].sort((x, y) => {
        const xp = a.preferCarriers!.some((c) => x.carrier.toLowerCase().includes(c.toLowerCase())) ? 0 : 1;
        const yp = a.preferCarriers!.some((c) => y.carrier.toLowerCase().includes(c.toLowerCase())) ? 0 : 1;
        return xp - yp || x.amountCents - y.amountCents;
      });
    } else if (a.sortBy === "price_desc") {
      next = [...next].sort((x, y) => y.amountCents - x.amountCents);
    } else if (a.sortBy === "transit_asc") {
      next = [...next].sort((x, y) => x.transitDays - y.transitDays);
    } else if (a.sortBy === "price_asc") {
      next = [...next].sort((x, y) => x.amountCents - y.amountCents);
    }
  }

  if (!next.length) next = rates;
  return { rates: next, appliedRuleIds: applied };
}
