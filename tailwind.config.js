/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
          colors: {
          ink: "#000000",
          inksoft: "#F8FAFC",
          paper: "#FFFFFF",
          brass: "#2563EB",
          moss: "#22C55E",
          rust: "#EF4444",
          hairline: "#E5E7EB",
        },
        fontFamily: {
        display: ["Outfit", "sans-serif"],
        sans: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
