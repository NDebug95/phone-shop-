/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#15132A",
        paper: "#ffffff",
        surface: "#F6F4FF",
        surfaceAlt: "#FFF1F0",
        line: "#E7E3F7",
        muted: "#726F8C",
        primary: "#6C5CE7",
        primaryDark: "#5546C8",
        accent: "#FF5470",
        accentDark: "#E63E5C",
        mint: "#00C896",
        mintDark: "#00A87D",
      },
      fontFamily: {
        display: ["'Space Grotesk'", "system-ui", "sans-serif"],
        body: ["'Inter'", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "ui-monospace", "monospace"],
      },
      maxWidth: {
        shell: "1280px",
      },
      backgroundImage: {
        "grad-brand": "linear-gradient(135deg, #6C5CE7 0%, #FF5470 100%)",
        "grad-mint": "linear-gradient(135deg, #00C896 0%, #6C5CE7 100%)",
      },
    },
  },
  plugins: [],
};
