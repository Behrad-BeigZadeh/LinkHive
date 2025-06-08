/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  safelist: [
    {
      pattern: /hover:bg-(emerald|fuchsia|cyan)-400/,
    },
    {
      pattern: /hover:shadow-(emerald|fuchsia|cyan)-400\/50/,
    },
  ],
  plugins: [],
};
