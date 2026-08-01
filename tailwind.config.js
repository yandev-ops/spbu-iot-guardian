/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        status: {
          normal: "#22c55e",   // hijau
          warning: "#eab308",  // kuning
          critical: "#f97316", // oranye
          down: "#ef4444",     // merah
        },
      },
    },
  },
  plugins: [],
};
