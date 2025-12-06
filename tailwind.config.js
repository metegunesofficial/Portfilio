/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          primary: '#f97316', // warm amber
          accent: '#fb923c',
          muted: '#94a3b8',
        },
        sand: '#fdf6ec',
        ink: '#0f172a',
      },
      boxShadow: {
        card: '0 18px 60px -32px rgba(15, 23, 42, 0.35)',
        glow: '0 0 0 1px rgba(255, 255, 255, 0.06), 0 24px 70px -36px rgba(249, 115, 22, 0.4)',
      },
    },
  },
  plugins: [],
}

