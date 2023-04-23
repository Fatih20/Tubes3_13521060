/** @type {import('tailwindcss').Config} */
module.exports = {
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#2aa198",
          secondary: "#268bd2",
          accent: "#859900",
          neutral: "#657b83",
          "base-100": "#073642",
          "base-200": "#002b36",
          error: "#dc322f",
        },
      },
    ],
  },
  plugins: [require("daisyui"), require("tailwind-scrollbar")],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
};
