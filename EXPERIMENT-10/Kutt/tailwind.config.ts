import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--text)",
        surface: "var(--surface)",
        border: "var(--border)",
        muted: "var(--text-muted)",
        brand: {
          DEFAULT: "var(--brand)",
          mid: "var(--brand-mid)",
          light: "var(--brand-light)",
        },
        success: "var(--success)",
        danger: "var(--error)",
        amber: "var(--amber)",
      },
      animation: {
        "spin-slow": "spin-slow 1.2s linear infinite",
        "fade-up": "fade-up 0.4s ease both",
      },
    },
  },
  plugins: [],
} satisfies Config;
