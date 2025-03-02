/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        pressstart: ['"Press Start 2P"', "cursive"],
      },
    },
  },
  plugins: [],
};
