/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        infra: {
          dark: '#0a0a0c',
          card: '#16161a',
          accent: '#3b82f6',
          danger: '#ef4444',
          success: '#22c55e',
          warning: '#f59e0b',
        }
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
