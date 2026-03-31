import type { Config } from "tailwindcss";

const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#08111f",
        mist: "#e5eef8",
        accent: "#ff8f00",
        teal: "#41c9c0"
      }
    }
  },
  plugins: []
} satisfies Config;

export default config;
