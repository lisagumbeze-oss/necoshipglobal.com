import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: "#0B1F3A",
          blue: "#1E6BFF",
          slate: "#4A5568",
          success: "#10B981",
          warning: "#F59E0B",
          danger: "#EF4444",
          surface: "#F8FAFC"
        }
      },
      borderRadius: {
        card: "12px",
        input: "8px",
        button: "6px"
      },
      fontFamily: {
        display: ["var(--font-sora)", "Sora", "system-ui", "sans-serif"],
        body: ["var(--font-dm-sans)", "DM Sans", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "JetBrains Mono", "ui-monospace", "monospace"]
      },
      boxShadow: {
        layered:
          "0 10px 30px -12px rgba(11,31,58,0.35), 0 6px 12px -6px rgba(30,107,255,0.22)"
      }
    }
  },
  plugins: []
};

export default config;
