"use client";

/**
 * Decorative hero “globe / routes” — dotted great-circle style paths (no Mapbox dependency).
 */
export function HeroRoutesVisual() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-90" aria-hidden>
      <svg className="h-full w-full" viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="routeGlow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1E6BFF" stopOpacity="0" />
            <stop offset="50%" stopColor="#1E6BFF" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#1E6BFF" stopOpacity="0" />
          </linearGradient>
        </defs>
        <g fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.12)" strokeWidth="1">
          <ellipse cx="280" cy="260" rx="120" ry="90" />
          <ellipse cx="620" cy="220" rx="140" ry="100" />
          <ellipse cx="900" cy="320" rx="100" ry="120" />
          <ellipse cx="520" cy="380" rx="90" ry="60" />
        </g>
        {[
          { d: "M 220 200 Q 500 80 760 220", delay: "0s" },
          { d: "M 760 220 Q 920 140 1020 260", delay: "0.4s" },
          { d: "M 320 320 Q 560 420 880 360", delay: "0.8s" },
          { d: "M 200 400 Q 480 300 640 260", delay: "1.2s" }
        ].map((route, i) => (
          <path
            key={i}
            d={route.d}
            fill="none"
            stroke="url(#routeGlow)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="6 10"
            className="animate-route-dash"
            style={{ animationDelay: route.delay }}
          />
        ))}
        {[
          [220, 200],
          [760, 220],
          [1020, 260],
          [880, 360],
          [320, 320]
        ].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="5" fill="#1E6BFF" className="animate-pulse" />
        ))}
      </svg>
    </div>
  );
}
