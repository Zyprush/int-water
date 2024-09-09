import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      keyframes: {
        fill: {
          '0%': { height: '0%' },
          '100%': { height: '100%' },
        },
      },
      animation: {
        fill: 'fill 2s infinite ease-in-out',
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#3C5B6F",
          secondary: "#948979",
          accent: "#DFD0B8",
          neutral: "#153448",
          white: "#ffffff",
        },
      },
      "corporate",
    ],
  },
};
export default config;
