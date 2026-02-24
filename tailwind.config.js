/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg:       "#070d09",
        surface:  "#0d1710",
        surface2: "#111e13",
        border:   "#162018",
        green:    "#00c853",
        gold:     "#f9c84c",
        danger:   "#e53935",
        mid:      "#7aaa88",
        dim:      "#4d7060",
      },
      fontFamily: {
        sans: ["Syne", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      animation: {
        "pulse-green": "pulse-green 2s ease-in-out infinite",
        "shimmer":     "shimmer 1.5s infinite",
        "flash-in":    "flash-in 0.4s ease-out",
      },
      keyframes: {
        "pulse-green": {
          "0%,100%": { boxShadow: "0 0 0 0 rgba(0,200,83,0.4)" },
          "50%":      { boxShadow: "0 0 0 12px rgba(0,200,83,0)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "flash-in": {
          "0%":   { opacity: "0", transform: "translateY(-8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
