module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: { darkBg: "#0b0f19", glassBorder: "rgba(255, 255, 255, 0.08)", neonGreen: "#10b981", neonCyan: "#06b6d4" },
      boxShadow: { neonGlow: "0 0 25px rgba(6, 182, 212, 0.15)" }
    }
  },
  plugins: []
}
