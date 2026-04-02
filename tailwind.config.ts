import type { Config } from "tailwindcss";

const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        outfit: ["var(--font-outfit)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        ink: "#08111f",
        mist: "#e5eef8",
        accent: "#ff8f00",
        teal: "#41c9c0",
        "ball-amber": "#ffb020",
        "ball-sky": "#38bdf8",
        "ball-rose": "#fb7185",
        "ball-emerald": "#34d399",
        "ball-violet": "#a78bfa",
      },
      animation: {
        "mesh": "mesh 15s ease-in-out infinite alternate",
        "glow": "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        mesh: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        glow: {
          "from": { boxShadow: "0 0 10px rgba(65, 201, 192, 0.4), 0 0 20px rgba(65, 201, 192, 0.2)" },
          "to": { boxShadow: "0 0 20px rgba(65, 201, 192, 0.8), 0 0 30px rgba(65, 201, 192, 0.4)" },
        }
      }
    }
  },
  plugins: []
} satisfies Config;

export default config;
