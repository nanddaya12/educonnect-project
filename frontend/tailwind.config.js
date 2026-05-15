/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#0f172a', // Deep navy
          800: '#1e293b',
          700: '#334155',
        },
        accent: {
          500: '#06b6d4', // Cyan
          400: '#22d3ee',
        }
      }
    },
  },
  plugins: [],
}
