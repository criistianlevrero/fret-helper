/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        '27': 'repeat(27, minmax(0, 1fr))',
      },
      borderWidth: {
        '16': '16px'
      }
    },
  },
  plugins: [],
}
