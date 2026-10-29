/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          main: '#080B11',
          secondary: '#1A1F24',
          panel: '#222A36',
          elevated: '#2B3544',
        },
        board: {
          light: '#EEEAD6',
          dark: '#2F3847',
          highlight: '#B8FF3B',
        },
        accent: {
          lime: '#B8FF3B',
          limeHover: '#CBFF66',
          limeMuted: 'rgba(184, 255, 59, 0.14)',
        },
        text: {
          primary: '#F8FAFC',
          secondary: '#94A3B8',
          muted: '#64748B',
        },
        danger: {
          DEFAULT: '#EF4444',
          muted: 'rgba(239, 68, 68, 0.15)',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', '"Outfit"', 'system-ui', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', '"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      keyframes: {
        'swap-pulse': {
          '0%, 100%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(184, 255, 59, 0.7)' },
          '50%': { transform: 'scale(1.08)', boxShadow: '0 0 22px 6px rgba(184, 255, 59, 0.45)' },
        },
        'piece-pop': {
          '0%': { transform: 'scale(0.75) rotate(-8deg)', opacity: '0.5' },
          '60%': { transform: 'scale(1.12) rotate(4deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
        },
        'shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '75%': { transform: 'translateX(5px)' },
        },
      },
      animation: {
        'swap-pulse': 'swap-pulse 0.65s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'piece-pop': 'piece-pop 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'shake': 'shake 0.28s ease-in-out',
      },
    },
  },
  plugins: [],
}
