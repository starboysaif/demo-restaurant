import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#FFF8EE",
        charcoal: "#2B1810",
        brand: {
          orange: "#F1671F",
          red: "#D62828",
          yellow: "#F7B32B",
        },
      },
      fontFamily: {
        display: ["Cairo", "sans-serif"],
        body: ["Tajawal", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
