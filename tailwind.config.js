/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", ...defaultTheme.fontFamily.sans],
        exo: ["Exo", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        green: "#48A928",
      },
    },
  },
  plugins: [],
};
