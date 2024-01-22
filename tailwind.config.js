/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        indigo: {
          100: '#D8FFB1',
          200: '#C0FF82',
          300: '#A8FF53',
          400: '#7DD228',
          500: '#65CC00',
          600: '#53A800',
          700: '#408100',
          800: '#285100',
          900: '#0D4D35',
        },
        gray: {
          100: '#E4F2ED ',
          200: '#CEE6DE ',
          300: '#A8FF53',
          400: '#145C41',
          500: '#0D4D35',
          600: '#0D4D35',
          700: '#09452E',
          800: '#285100',
          900: '#0D4D35',
        },
      },
    },
  },
  plugins: [],
}

