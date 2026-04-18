/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
      },
      colors: {
        'main-green': '#00793e',
        'dark-green': '#004825',
        'light-green': '#01ae5a',
        'light-mint': '#b7ffdc',
        'dark-bg': '#1d1d1d',
      },
      backgroundImage: {
        'gradient-hero': "linear-gradient(63.98deg, rgb(1, 174, 90) 53.17%, rgb(1, 172, 89) 72.56%, rgb(0, 72, 37) 102.3%)",
        'gradient-kampus': "linear-gradient(-41.18deg, rgb(14, 184, 102) 54.54%, rgb(0, 105, 54) 100%)",
      },
    },
  },
  plugins: [],
}
