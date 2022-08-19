/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        bright: {
          '0%, 100%': { 'opacity': "1" },
          '50%': { 'opacity': ".85" },
        },
        mailFly: {
          '0%, 100%': { transform: 'translateX(0%)' },
          '50%': { transform: 'translateX(50%) skewX(4deg) scale(1.2, 1.2)' },
        }
      },
      animation: {
        bright: 'bright 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite;',
        spinIG: 'spin 1.4s ease infinite',
        mailFly: 'mailFly 1.4s ease infinite',
      },
      colors:{
        main: "#6D505D",
        background: "#E2D4B7"
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('tailwind-scrollbar-hide'),
    require('@tailwindcss/line-clamp'),
  ],
}
