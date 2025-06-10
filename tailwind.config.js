/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{ts,tsx}",
    "../../packages/ui/**/*.{ts,tsx}" // For future UI package
  ],
  darkMode: 'class', // Enables class-based dark mode
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#00E0FF',
          dark: '#0090A0',
        },
      },
    },
  },
  plugins: [],
};