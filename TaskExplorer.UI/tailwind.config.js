/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: "#0969da", // GitHub Blue
        background: "#ffffff",
        "dark-background": "#0d1117",
        "card-bg": "#ffffff",
        "dark-card-bg": "#161b22",
        "text-primary": "#1f2328",
        "dark-text-primary": "#c9d1d9",
        "text-secondary": "#636c76",
        "dark-text-secondary": "#8b949e",
        "success": "#1a7f37",
        "alert": "#d1242f",
        "warning": "#9a6700",
        "info": "#0969da",
        "light-gray": "#d0d7de",
        "dark-border": "#30363d",
      },
      borderRadius: {
        'lg': '6px',
        'xl': '8px',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        'scale-up': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        }
      },
      animation: {
        'scale-up': 'scale-up 0.2s ease-out',
      }
    },
  },
  plugins: [],
}
