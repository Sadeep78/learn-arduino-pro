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
        blueprint: {
          cream: '#FAF8F5',
          creamDark: '#F3EFEA',
          creamBorder: '#E5DFD5',
          navy: '#0F1E36',
          navyMuted: '#3A4D6B',
          navyDark: '#0A1322',
          nightBg: '#0B132B',
          nightCard: '#131F3B',
          nightBorder: '#1E2F52',
          teal: '#16B8B0',
          tealHover: '#139E97',
          tealLight: '#E8F8F7',
          amber: '#F59E0B',
          coral: '#EF4444',
          cyan: '#06B6D4',
          gridLine: 'rgba(22, 184, 176, 0.08)',
          gridLineNight: 'rgba(22, 184, 176, 0.12)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Consolas', 'Menlo', 'monospace'],
        blueprint: ['"Fira Code"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'blueprint': '0 4px 20px -2px rgba(15, 30, 54, 0.08)',
        'blueprint-hover': '0 8px 30px -4px rgba(22, 184, 176, 0.2)',
        'teal-glow': '0 0 15px rgba(22, 184, 176, 0.4)',
        'teal-glow-lg': '0 0 30px rgba(22, 184, 176, 0.6)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 12s linear infinite',
      }
    },
  },
  plugins: [],
}
