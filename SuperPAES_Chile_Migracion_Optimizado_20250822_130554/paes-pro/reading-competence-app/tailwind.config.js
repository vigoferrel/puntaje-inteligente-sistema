/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'diagnostic-blue': {
          50: '#e6f1ff',
          100: '#b3d7ff',
          500: '#2196f3',
          700: '#1976d2'
        },
        'diagnostic-green': {
          50: '#e8f5e9',
          100: '#c8e6c9',
          500: '#4caf50',
          700: '#388e3c'
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif']
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
}
