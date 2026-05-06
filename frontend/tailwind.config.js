/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'inha-blue': '#004680',
        'inha-green': '#00843D',
        'light-gray': '#F1F5F9',
      },
    },
  },
  plugins: [],
}
