/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  safelist: [
    'font-magistral',
    'font-kallisto',
    {
      pattern: /font-(magistral|kallisto)/,
    },
  ],
  theme: {
    extend: {
      fontFamily: {
        magistral: ['"magistral"', 'sans-serif'],
        kallisto: ['"Kallisto"', 'sans-serif'],
        sans: ['"magistral"', 'sans-serif'], // Default sans to Magistral
      },
    },
  },
  plugins: [],
};