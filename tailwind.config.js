const colors = require("tailwindcss/colors");
module.exports = {
  mode: "jit",
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./views/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      ...colors,
    },
    extend: {
      animation: {
        "blob-spin": "blobbing 25s linear infinite",
      },
      colors: {
        primary: {
          500: "#872684",
          600: "#E72FCC",
        },
      },
    },
  },
  plugins: [],
};
