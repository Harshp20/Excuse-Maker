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
      '2xs': '0.65rem'
    },
    maxWidth: {
      60: '60%'
    }
  }
}