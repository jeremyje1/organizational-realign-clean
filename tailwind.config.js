/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'dots-float': 'dots-float 20s ease-in-out infinite',
      },
      colors: {
        'nps-blue': {
          DEFAULT: '#1654A3',
          50: '#E8F0FB',
          100: '#D4E2F8',
          150: '#B8D1F4',
          200: '#9BC0F0',
          500: '#1654A3',
          600: '#0f3d79',
          700: '#0d3363',
        },
        'nps-slate': {
          DEFAULT: '#2A2E33',
          100: '#F6F8FC',
          200: '#E2E6EE',
        },
        'nps-gold': {
          DEFAULT: '#D4AF37',
        },
        'nps-light': '#F6F8FC',
        blue: {
          500: '#3b82f6',
          600: '#2563eb',
        }
      },
      ringColor: {
        'blue-500': '#3b82f6',
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ]
};
