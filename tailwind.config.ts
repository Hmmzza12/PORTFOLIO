import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand Kit palette
        base: "#0A0A0C", // Primary dark background
        accent: "#FF1E42", // Neon highlight
        slate: "#1E1E24", // Muted slate / containers
        ink: "#F4F4F6", // Main text
        muted: "#8A8A93", // Subtext / muted text
      },
      fontFamily: {
        display: ["var(--font-space-grotesk)", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 20px #FF1E4233",
        "glow-lg": "0 0 45px #FF1E4240",
      },
      backdropBlur: {
        glass: "12px",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
        "caret-blink": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "scan-down": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
      },
      animation: {
        "pulse-glow": "pulse-glow 2.4s ease-in-out infinite",
        "caret-blink": "caret-blink 1s step-end infinite",
        float: "float 5s ease-in-out infinite",
        "scan-down": "scan-down 4s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
