import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: "var(--ns-color-navy)",
          "navy-800": "var(--ns-color-navy-800)",
          "navy-700": "var(--ns-color-navy-700)",
          yellow: "var(--ns-color-yellow)",
          "yellow-soft": "var(--ns-color-yellow-soft)",
          charcoal: "var(--ns-color-charcoal)",
          slate: "var(--ns-color-text-muted)",
          success: "var(--ns-color-success)",
          warning: "var(--ns-color-warning)",
          danger: "var(--ns-color-danger)",
          info: "var(--ns-color-info)",
          surface: "var(--ns-color-surface)",
          "surface-muted": "var(--ns-color-surface-muted)"
        },
        ns: {
          border: "var(--ns-color-border)",
          "border-strong": "var(--ns-color-border-strong)",
          muted: "var(--ns-color-text-subtle)",
          successSoft: "var(--ns-color-success-soft)",
          warningSoft: "var(--ns-color-warning-soft)",
          dangerSoft: "var(--ns-color-danger-soft)",
          infoSoft: "var(--ns-color-info-soft)"
        }
      },
      borderRadius: {
        button: "var(--ns-radius-button)",
        input: "var(--ns-radius-input)",
        badge: "var(--ns-radius-badge)",
        card: "var(--ns-radius-card)",
        panel: "var(--ns-radius-panel)"
      },
      fontFamily: {
        display: ["var(--ns-font-display)"],
        body: ["var(--ns-font-body)"],
        mono: ["var(--ns-font-mono)"]
      },
      fontSize: {
        "ns-display": ["var(--ns-text-display)", { lineHeight: "var(--ns-leading-tight)" }],
        "ns-title": ["var(--ns-text-title)", { lineHeight: "var(--ns-leading-tight)" }],
        "ns-section": ["var(--ns-text-section)", { lineHeight: "var(--ns-leading-snug)" }],
        "ns-body": ["var(--ns-text-body)", { lineHeight: "var(--ns-leading-normal)" }],
        "ns-meta": ["var(--ns-text-meta)", { lineHeight: "var(--ns-leading-normal)" }],
        "ns-label": ["var(--ns-text-label)", { lineHeight: "var(--ns-leading-normal)" }]
      },
      spacing: {
        "ns-1": "var(--ns-space-1)",
        "ns-2": "var(--ns-space-2)",
        "ns-3": "var(--ns-space-3)",
        "ns-4": "var(--ns-space-4)",
        "ns-5": "var(--ns-space-5)",
        "ns-6": "var(--ns-space-6)",
        "ns-8": "var(--ns-space-8)",
        "ns-10": "var(--ns-space-10)",
        "ns-12": "var(--ns-space-12)",
        touch: "var(--ns-touch-min)"
      },
      maxWidth: {
        "ns-sm": "var(--ns-container-sm)",
        "ns-md": "var(--ns-container-md)",
        "ns-lg": "var(--ns-container-lg)",
        "ns-xl": "var(--ns-container-xl)",
        "ns-2xl": "var(--ns-container-2xl)"
      },
      boxShadow: {
        sm: "var(--ns-shadow-sm)",
        card: "var(--ns-shadow-card)",
        overlay: "var(--ns-shadow-overlay)",
        /** @deprecated Prefer shadow-card; kept for existing pages */
        layered: "var(--ns-shadow-card)"
      },
      transitionDuration: {
        fast: "var(--ns-duration-fast)",
        normal: "var(--ns-duration-normal)"
      },
      transitionTimingFunction: {
        ns: "var(--ns-ease)"
      }
    }
  },
  plugins: []
};

export default config;
