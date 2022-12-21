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
          '50%': { 'opacity': ".5" },
        },
        mailFly: {
          '0%, 100%': { transform: 'translateX(0%)' },
          '50%': { transform: 'translateX(50%) skewX(4deg) scale(1.2, 1.2)' },
        }
      },
      animation: {
        bright: 'bright 1.8s cubic-bezier(0.4, 0, 0.6, 1) infinite;',
        opacity: 'bright 1.4s ease infinite;',
        spinIG: 'spin 1.4s ease infinite',
        mailFly: 'mailFly 1.4s ease infinite',
      },
      // spring-colors:{
      //   main: "#6D505D",
      //   main2: "#8C3F3F",
      //   background: "#E2D4B7",
      //   background2: "#F2EDE4",
      // },
      colors: {
        main: "#475259",
        main2: "#5D7CA6",
        background: "#BACDD9",
        background2: "#E4EAF2",
      },
      flexBasis: {
        '1/9': '11.1111111%',
        '2/9': '22.2222222%',
        '3/9': '33.3333333%',
        '4/9': '44.4444444%',
        '5/9': '55.5555555%',
        '6/9': '66.6666666%',
        '7/9': '77.7777777%',
        '8/9': '88.8888888%',
        '9/9': '99.9999999%',
      }
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
    require('tailwind-scrollbar-hide')
  ],
}