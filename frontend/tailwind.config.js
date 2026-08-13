/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        military: {
          900: '#1a1c1e', // Dark header
          800: '#2d3436', // Sidebar
          700: '#636e72', // Text
          600: '#2d3e50', // Accents
        }
      }
    },
  },
  plugins: [],
}