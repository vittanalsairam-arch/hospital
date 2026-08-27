/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'medical-blue': '#0055D4',
        'medical-cyan': '#00B4D8',
        'soft-green': '#10B981',
      }
    },
  },
  plugins: [],
}
