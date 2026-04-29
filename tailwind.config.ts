import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        lg: "2rem",
      },
      screens: {
        "2xl": "1280px",
      },
    },
    extend: {
      colors: {
        // NORDIK-aligned blue system
        nordik: {
          50: "#eef5fc",
          100: "#d8e8f7",
          200: "#b1d0ef",
          300: "#84b3e4",
          400: "#5690d4",
          500: "#2f6fc2",
          600: "#1d56a6",
          700: "#164284",
          800: "#0f3066",
          900: "#092148",
          950: "#04122b",
        },
        // Category accent colors — tuned for WCAG AA on white
        cat: {
          population: "#4f46e5", // indigo
          housing: "#b45309", // amber-700
          health: "#be123c", // rose-700
          labour: "#047857", // emerald-700
          education: "#6d28d9", // violet-700
          economy: "#0369a1", // sky-700
          climate: "#15803d", // green-700
          immigration: "#0f766e", // teal-700
          community: "#c2410c", // orange-700
          weather: "#0891b2", // cyan-600
        },
        // Neutral grays
        ink: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
          950: "#020617",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-fraunces)", "ui-serif", "Georgia", "serif"],
        mono: [
          "var(--font-jetbrains)",
          "ui-monospace",
          "SFMono-Regular",
          "monospace",
        ],
      },
      fontSize: {
        "display-2xl": ["4.5rem", { lineHeight: "1.02", letterSpacing: "-0.03em" }],
        "display-xl": ["3.75rem", { lineHeight: "1.05", letterSpacing: "-0.028em" }],
        "display-lg": ["3rem", { lineHeight: "1.08", letterSpacing: "-0.024em" }],
        "display-md": ["2.25rem", { lineHeight: "1.15", letterSpacing: "-0.02em" }],
        "display-sm": ["1.75rem", { lineHeight: "1.2", letterSpacing: "-0.015em" }],
      },
      borderRadius: {
        xs: "6px",
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "20px",
        "2xl": "28px",
      },
      boxShadow: {
        "elev-1": "0 1px 2px rgba(15,23,42,0.04), 0 1px 3px rgba(15,23,42,0.06)",
        "elev-2":
          "0 2px 4px rgba(15,23,42,0.04), 0 4px 12px rgba(15,23,42,0.06)",
        "elev-3":
          "0 4px 8px rgba(15,23,42,0.04), 0 12px 24px rgba(15,23,42,0.08)",
        "elev-4":
          "0 8px 16px rgba(15,23,42,0.06), 0 24px 48px rgba(15,23,42,0.1)",
        "focus-ring": "0 0 0 3px rgba(29,86,166,0.25)",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-slow": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out both",
        "fade-in-slow": "fade-in-slow 0.7s ease-out both",
        shimmer: "shimmer 2s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
