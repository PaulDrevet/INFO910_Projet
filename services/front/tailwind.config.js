/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors : {
        'primary': '#F7FFF7',
        'secondary': '#4ECDC4',
        'danger': '#FF6B6B',
        'dark': '#292F36',
        'light' : '#FFE66D'
      },
    },
  },
  plugins: [],
}

