import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: { navy: "#00205B", teal: "#0d9488", red: "#D31145" },
      },
    },
  },
  plugins: [],
};

export default config;
