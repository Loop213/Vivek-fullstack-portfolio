/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Sora", "sans-serif"],
        body: ["Space Grotesk", "sans-serif"]
      },
      colors: {
        ink: "#081121",
        mist: "#eef4ff",
        brand: "#36cfc9",
        accent: "#ff8a65",
        night: "#050816"
      },
      boxShadow: {
        glass: "0 20px 60px rgba(6, 12, 24, 0.24)"
      },
      backgroundImage: {
        grid: "radial-gradient(circle at center, rgba(255,255,255,0.15) 1px, transparent 1px)"
      }
    }
  },
  plugins: []
};
