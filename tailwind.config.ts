import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          50: "#fcfbf8",
          DEFAULT: "#f7f4ec",
          100: "#f7f4ec",
          200: "#eee7d5",
          300: "#e2d6bc",
          400: "#c7b897",
          dark: "#1c1b18",
        },
        ink: {
          DEFAULT: "#141414",
          pure: "#0a0a0a",
          muted: "#484642",
          light: "#7b776f",
          faint: "#b8b4a9",
          divider: "#d8d3c5",
        },
        press: {
          red: "#b91c1c",
          vermilion: "#dc2626",
          gold: "#b48227",
          navy: "#1e3a5f",
        },
      },
      fontFamily: {
        "serif-sc": ["'Noto Serif SC'", "Songti SC", "STSong", "SimSun", "serif"],
        "serif-tc": ["'Noto Serif TC'", "Songti TC", "LiSong Pro", "MingLiU", "serif"],
        "sans-sc": ["'Noto Sans SC'", "PingFang SC", "Microsoft YaHei", "sans-serif"],
        "sans-tc": ["'Noto Sans TC'", "PingFang TC", "Microsoft JhengHei", "sans-serif"],
        headline: ["'Noto Serif SC'", "Georgia", "Songti SC", "serif"],
      },
      boxShadow: {
        "paper-flat": "0 1px 3px rgba(20, 20, 20, 0.08), 0 1px 2px rgba(20, 20, 20, 0.04)",
        "paper-lift": "0 12px 35px -8px rgba(28, 25, 23, 0.22), 0 4px 10px -2px rgba(28, 25, 23, 0.08)",
        "paper-crease": "inset 0 0 40px rgba(0, 0, 0, 0.06)",
      },
      letterSpacing: {
        tighter: "-0.04em",
        tight: "-0.02em",
        wideEditorial: "0.15em",
        chineseWide: "0.25em",
      },
      backgroundImage: {
        "paper-grain": "radial-gradient(circle, rgba(0,0,0,0.03) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};

export default config;
