import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Dominion game palette
        parchment: {
          50:  '#F5EDD4',
          100: '#EFE0BB',
          200: '#E6D0A0',
          300: '#D4BA80',
        },
        gold: {
          300: '#E8C04A',
          400: '#C9A227',
          500: '#A8841A',
          600: '#8A6C10',
        },
        navy: {
          800: '#1E2D5C',
          900: '#141D3D',
        },
        crimson: {
          700: '#8B1A1A',
          800: '#6B1313',
        },
        forest: {
          700: '#2A5C2A',
          800: '#1E4A1E',
        },
        brown: {
          800: '#3B1F0A',
          900: '#271408',
        },
        ink: {
          900: '#1C1208',
        },
      },
      fontFamily: {
        display: ['"IM Fell English"', 'Georgia', 'serif'],
        serif: ['"Crimson Text"', 'Georgia', 'serif'],
      },
      fontSize: {
        xs:   ['0.875rem', { lineHeight: '1.4' }],   // 14px (was 12px)
        sm:   ['1rem',     { lineHeight: '1.5' }],   // 16px (was 14px)
        base: ['1.125rem', { lineHeight: '1.6' }],   // 18px (was 16px)
        lg:   ['1.25rem',  { lineHeight: '1.6' }],   // 20px (was 18px)
        xl:   ['1.375rem', { lineHeight: '1.5' }],   // 22px (was 20px)
        '2xl':['1.625rem', { lineHeight: '1.4' }],   // 26px (was 24px)
        '3xl':['2rem',     { lineHeight: '1.3' }],   // 32px (was 30px)
        '4xl':['2.5rem',   { lineHeight: '1.2' }],   // 40px (was 36px)
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-4px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(4px)' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in': {
          '0%': { opacity: '0', transform: 'translateX(-12px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      animation: {
        shake: 'shake 0.5s ease-in-out',
        'fade-in': 'fade-in 0.4s ease-out',
        'slide-in': 'slide-in 0.3s ease-out',
      },
    },
  },
  plugins: [],
}

export default config
