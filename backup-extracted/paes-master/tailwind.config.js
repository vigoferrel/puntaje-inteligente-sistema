/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        'arsenal': {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        'neural': {
          50: '#fdf4ff',
          100: '#fae8ff',
          200: '#f5d0fe',
          300: '#f0abfc',
          400: '#e879f9',
          500: '#d946ef',
          600: '#c026d3',
          700: '#a21caf',
          800: '#86198f',
          900: '#701a75',
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'quantum': 'quantum 2s ease-in-out infinite',
        'neural': 'neural 4s linear infinite',
      },
      keyframes: {
        quantum: {
          '0%, 100%': { 
            opacity: '1',
            transform: 'scale(1) rotate(0deg)'
          },
          '50%': { 
            opacity: '0.8',
            transform: 'scale(1.05) rotate(180deg)'
          },
        },
        neural: {
          '0%': { 
            'background-position': '0% 50%' 
          },
          '50%': { 
            'background-position': '100% 50%' 
          },
          '100%': { 
            'background-position': '0% 50%' 
          },
        }
      }
    },
  },
  plugins: [],
}
