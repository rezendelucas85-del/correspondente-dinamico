/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fdf2f2',
          100: '#fde8e8',
          500: '#8b1a1a',
          600: '#7a1515',
          700: '#6b1010',
          800: '#5a0d0d',
          900: '#4a0a0a',
        },
        brand: '#8b1a1a',
      },
    },
  },
  plugins: [],
}
