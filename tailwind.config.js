/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      keyframes: {
        cat: {
          '0%': { transform: 'translateX(-10px)' },
          '100%': { transform: 'translateX(0px)' }
        }
      },
      animation: {
        'cat-fade-in': 'cat 1s ease-out 1'
      }
    },
    plugins: [],
    screens: {
      xs: '540px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px'
    },
    fontSize: {
      'xs': '0.7rem',
      'sm': '0.8rem',
      'md': '0.9rem',
      'base': '1rem',
      'xl': '1.25rem',
      '2xl': '1.563rem',
      '3xl': '1.953rem',
      '4xl': '2.441rem',
      '5xl': '3.052rem',
    }
  }
}