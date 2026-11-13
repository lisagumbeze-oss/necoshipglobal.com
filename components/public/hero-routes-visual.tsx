"use client";

/**
 * Hero world map with exact NECO hub pins and animated shipping lanes.
 * Equirectangular projection in a 1200×600 viewBox (matches world-map-dark.svg).
 */

const VIEW_W = 1200;
const VIEW_H = 600;

type Hub = {
  id: string;
  city: string;
  code: string;
  lat: number;
  lng: number;
};

const HERO_HUBS: Hub[] = [
  { id: "lax", city: "Los Angeles", code: "LAX", lat: 33.94, lng: -118.41 },
  { id: "ord", city: "Chicago", code: "ORD", lat: 41.97, lng: -87.91 },
  { id: "fra", city: "Frankfurt", code: "FRA", lat: 50.04, lng: 8.57 },
  { id: "dxb", city: "Dubai", code: "DXB", lat: 25.25, lng: 55.36 },
  { id: "sin", city: "Singapore", code: "SIN", lat: 1.36, lng: 103.99 }
];

/** Equirectangular projection → SVG coordinates */
function project(lat: number, lng: number) {
  const x = ((lng + 180) / 360) * VIEW_W;
  const y = ((90 - lat) / 180) * VIEW_H;
  return { x, y };
}

const HUB_POINTS = Object.fromEntries(
  HERO_HUBS.map((hub) => [hub.id, { ...hub, ...project(hub.lat, hub.lng) }])
) as Record<string, Hub & { x: number; y: number }>;

type Lane = {
  from: keyof typeof HUB_POINTS;
  to: keyof typeof HUB_POINTS;
  /** Negative lifts the control point north; positive south */
  loft: number;
  delay: string;
};

const LANES: Lane[] = [
  { from: "lax", to: "fra", loft: -90, delay: "0s" },
  { from: "fra", to: "sin", loft: -55, delay: "0.35s" },
  { from: "ord", to: "dxb", loft: -70, delay: "0.7s" },
  { from: "lax", to: "ord", loft: -28, delay: "1.05s" }
];

function arcPath(fromId: string, toId: string, loft: number) {
  const a = HUB_POINTS[fromId];
  const b = HUB_POINTS[toId];
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2 + loft;
  return `M ${a.x.toFixed(1)} ${a.y.toFixed(1)} Q ${mx.toFixed(1)} ${my.toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
}

export function HeroRoutesVisual() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <svg
        className="h-full w-full"
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="heroMapScrim" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#062853" stopOpacity="0.55" />
            <stop offset="45%" stopColor="#062853" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#062853" stopOpacity="0.72" />
          </linearGradient>
          <radialGradient id="heroCenterScrim" cx="50%" cy="35%" r="55%">
            <stop offset="0%" stopColor="#062853" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#062853" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="routeGlow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F8E000" stopOpacity="0.15" />
            <stop offset="50%" stopColor="#F8E000" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#F8E000" stopOpacity="0.15" />
          </linearGradient>
          <filter id="pinGlow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="2.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <image
          href="/images/hero/world-map-dark.svg"
          x="0"
          y="0"
          width={VIEW_W}
          height={VIEW_H}
          preserveAspectRatio="xMidYMid slice"
        />
        <rect width={VIEW_W} height={VIEW_H} fill="url(#heroMapScrim)" />
        <rect width={VIEW_W} height={VIEW_H} fill="url(#heroCenterScrim)" />

        {LANES.map((lane) => (
          <path
            key={`${lane.from}-${lane.to}`}
            d={arcPath(lane.from, lane.to, lane.loft)}
            fill="none"
            stroke="url(#routeGlow)"
            strokeWidth="2.25"
            strokeLinecap="round"
            strokeDasharray="7 11"
            className="animate-route-dash"
            style={{ animationDelay: lane.delay }}
          />
        ))}

        {HERO_HUBS.map((hub) => {
          const p = HUB_POINTS[hub.id];
          return (
            <g key={hub.id} transform={`translate(${p.x}, ${p.y})`}>
              <circle r="14" fill="#F8E000" fillOpacity="0.18" className="animate-pulse" />
              <circle r="8" fill="#F8E000" fillOpacity="0.28" />
              <circle r="4.5" fill="#F8E000" filter="url(#pinGlow)" />
              <circle r="1.8" fill="#062853" />
              <text
                x="0"
                y="-16"
                textAnchor="middle"
                fill="#FFFFFF"
                fillOpacity="0.92"
                fontSize="11"
                fontWeight="600"
                style={{ fontFamily: "var(--font-dm-sans), DM Sans, system-ui, sans-serif" }}
              >
                {hub.city}
              </text>
              <text
                x="0"
                y="22"
                textAnchor="middle"
                fill="#F8E000"
                fillOpacity="0.95"
                fontSize="9"
                fontWeight="700"
                letterSpacing="0.08em"
                style={{ fontFamily: "var(--font-jetbrains), ui-monospace, monospace" }}
              >
                {hub.code}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
