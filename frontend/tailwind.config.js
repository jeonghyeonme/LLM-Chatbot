/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'inha-blue': '#004898',
        'inha-bg': '#F7F9FF',
        'inha-border': '#E5E8EE',
        'inha-border-input': '#C3C6D3',
        'inha-text-main': '#424751',
        'inha-text-sub': '#5C5F60',
        'inha-pill-bg': '#ACC7FF',
      },
      borderRadius: {
        'inha-card': '12px',
        'inha-input': '24.5px',
        'inha-pill': '21px',
      },
      boxShadow: {
        'inha-card': '0 4px 6px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
