// tailwind.config.ts

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // === Custom Font Family ===
      fontFamily: {
        mono: ["'Geist Mono'", "monospace"], // Uses 'Geist Mono', falls back to monospace
      },
      // === Custom Colors ===
      colors: {
        background: "#1e1e1e", // Dark background
        foreground: "#c0c0c0", // Light foreground
        cyan: {
          300: "#00FFFF",
        },
        green: {
          300: "#00FF00",
          400: "#32CD32",
          600: "#228B22",
          700: "#006400",
          500: "#008000",
        },
        red: {
          300: "#FF0000",
        },
        yellow: {
          300: "#FFFF00",
        },
        gray: {
          500: "#808080",
          700: "#A9A9A9",
        },
      },
    },
  },
  plugins: [],
};

export default config;
