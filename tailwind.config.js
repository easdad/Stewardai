/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Lora', 'serif'],
        brand: ['Poppins', 'sans-serif'],
      },
      colors: {
        'primary': '#3A2E29', // Deep charcoal-brown
        'primary-hover': '#2E2420', // Darker shade
        'secondary': '#B89535', // Antique gold
        'secondary-hover': '#A1842E', // Darker gold
        'background': '#F8F5F2', // Warm off-white
        'surface': '#FFFFFF',
        'on-surface': '#3A2E29', // Main text color
        'on-surface-secondary': '#8A7E78', // Muted text color
      },
      boxShadow: {
        'subtle': '0 4px 12px 0 rgba(0, 0, 0, 0.05)',
        'interactive': '0 0 0 4px rgba(58, 46, 41, 0.1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideOut: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(100%)' },
        },
        modalIn: {
          '0%': { opacity: '0', transform: 'translateY(20px) scale(0.95)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-out forwards',
        slideIn: 'slideIn 0.3s ease-out forwards',
        slideOut: 'slideOut 0.3s ease-out forwards',
        modalIn: 'modalIn 0.3s ease-out forwards',
      }
    }
  },
  plugins: [],
}