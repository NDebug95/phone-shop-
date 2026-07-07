/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#141414",
        paper: "#ffffff",
        haze: "#f5f5f7",
        line: "#e6e6e9",
        accent: "#ff6b00",
        accentDark: "#e05e00",
        muted: "#6b6b70",
      },
      fontFamily: {
        display: ["'Inter'", "system-ui", "sans-serif"],
        body: ["'Inter'", "system-ui", "sans-serif"],
      },
      maxWidth: {
        shell: "1280px",
      },
    },
  },
  plugins: [],
};
