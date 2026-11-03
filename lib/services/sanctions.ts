import { env } from "@/lib/env";
import { logger } from "@/lib/logger";
import { memoryStore } from "@/lib/repository/memory-store";

/** Built-in denied-party / sanctions demo list (always checked). */
const LOCAL_DENIED = [
  { name: "NORTH KOREA TRADING", countries: ["KP"], reason: "OFAC SDN (demo)" },
  { name: "BLOCKED PARTY LLC", countries: ["*"], reason: "Internal deny list" },
  { name: "EMBARGOED LOGISTICS", countries: ["IR", "SY", "CU"], reason: "Country embargo demo" }
];

const EMBARGOED_COUNTRIES = new Set(["KP", "IR", "SY", "CU", "RU"]);

export type ScreeningInput = {
  name: string;
  country?: string;
  company?: string;
  address?: string;
};

export type ScreeningResult = {
  cleared: boolean;
  provider: "local" | "external";
  hits: Array<{ list: string; match: string; reason: string; score: number }>;
  screenedAt: string;
};

function normalize(s: string) {
  return s.toUpperCase().replace(/[^A-Z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
}

function localScreen(input: ScreeningInput): ScreeningResult {
  const hits: ScreeningResult["hits"] = [];
  const name = normalize(input.name);
  const company = normalize(input.company ?? "");
  const country = (input.country ?? "").toUpperCase();

  if (country && EMBARGOED_COUNTRIES.has(country.length === 2 ? country : country.slice(0, 2))) {
    hits.push({
      list: "Embargoed Countries",
      match: country,
      reason: "Destination/origin on embargo list",
      score: 1
    });
  }

  for (const row of LOCAL_DENIED) {
    const target = normalize(row.name);
    const hay = `${name} ${company}`;
    if (hay.includes(target) || target.includes(name) && name.length > 4) {
      if (row.countries.includes("*") || !country || row.countries.some((c) => country.includes(c))) {
        hits.push({
          list: "Denied Party",
          match: row.name,
          reason: row.reason,
          score: 0.95
        });
      }
    }
  }

  return {
    cleared: hits.length === 0,
    provider: "local",
    hits,
    screenedAt: new Date().toISOString()
  };
}

/** Live screening: optional external API + always-on local deny/embargo lists. */
export async function screenParty(input: ScreeningInput): Promise<ScreeningResult> {
  const local = localScreen(input);

  if (env.sanctionsApiUrl && env.sanctionsApiKey) {
    try {
      const res = await fetch(env.sanctionsApiUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.sanctionsApiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: input.name,
          company: input.company,
          country: input.country,
          address: input.address
        })
      });
      if (res.ok) {
        const json = (await res.json()) as {
          cleared?: boolean;
          hits?: Array<{ list?: string; match?: string; reason?: string; score?: number }>;
        };
        const externalHits = (json.hits ?? []).map((h) => ({
          list: h.list ?? "External",
          match: h.match ?? input.name,
          reason: h.reason ?? "External match",
          score: h.score ?? 1
        }));
        const hits = [...local.hits, ...externalHits];
        return {
          cleared: Boolean(json.cleared) && local.cleared && hits.length === 0,
          provider: "external",
          hits,
          screenedAt: new Date().toISOString()
        };
      }
      logger.warn("Sanctions API failed; using local list", { status: res.status });
    } catch (error) {
      logger.warn("Sanctions API error; using local list", {
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  return local;
}

export function recordScreening(shipmentId: string | null, result: ScreeningResult, partyName: string) {
  memoryStore.screeningHits.push({
    id: `scr_${Date.now()}`,
    shipmentId,
    partyName,
    ...result,
    createdAt: new Date().toISOString()
  });
}
