import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'walnut': {
          50: '#f5f3f0',
          100: '#e8e0d6',
          200: '#d4c4b0',
          300: '#b8a085',
          400: '#9d7d5f',
          500: '#8b6b4f',
          600: '#7a5a44',
          700: '#664a3a',
          800: '#563e33',
          900: '#4a352c',
        },
        'cream': {
          50: '#fefdfb',
          100: '#fdfaf5',
          200: '#faf5ea',
          300: '#f5ead5',
          400: '#eed9b8',
          500: '#e5c99a',
        },
        'frost': '#FCFBFC',
      },
      fontFamily: {
        sans: ['var(--font-raleway)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-bodoni)', 'serif'],
      },
      lineHeight: {
        'tight': '1.1',
        'snug': '1.2',
        'normal': '1.5',
        'relaxed': '1.75',
      },
      transitionTimingFunction: {
        'ease-out-back': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
  plugins: [],
}
export default config

