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
        'outfit': ['Outfit', 'sans-serif'],
        'momo-trust-sans': ['Momo Trust Sans', 'sans-serif'],
        'momo-trust-display': ['Momo Trust Display', 'sans-serif'],
        'volkhov': ['Volkhov', 'serif'],
      },
      colors: {
        'main-green': '#00793e',
        'dark-green': '#004825',
        'light-green': '#01ae5a',
        'light-mint': '#b7ffdc',
        'dark-bg': '#1d1d1d',
        'gradient-green-1': 'rgb(1, 174, 90)',
        'gradient-green-2': 'rgb(1, 172, 89)',
        'gradient-green-3': 'rgb(0, 72, 37)',
      },
    },
  },
  plugins: [],
}
