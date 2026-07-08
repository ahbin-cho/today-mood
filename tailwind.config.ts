import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#3b332a",
        "ink-soft": "#8c7d6b",
        line: "#e6d9c4",
        accent: "#b0895f",
        seal: "#b1503f",
        card: "#ffffff",
        "paper-1": "#fdf9f0",
        "paper-2": "#f7efe1",
      },
      fontFamily: {
        serif: "var(--serif)",
        sans: "var(--sans)",
        hand: "var(--hand)",
        soft: "var(--soft)",
      },
    },
  },
  plugins: [],
};

export default config;
