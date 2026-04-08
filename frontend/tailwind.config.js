/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          dark: '#0a0f1a',
          darker: '#05080f',
          cyan: '#00ffff',
          electric: '#0066ff',
          teal: '#00ffcc',
          neon: '#00ff00',
          purple: '#b300ff',
        }
      },
      fontFamily: {
        mono: ['"Fira Code"', '"Courier New"', 'monospace'],
        cyber: ['"Share Tech Mono"', '"Courier New"', 'monospace'],
      },
      boxShadow: {
        'neon': '0 0 5px #00ffff, 0 0 10px #00ffff',
        'neon-cyan': '0 0 5px #00ffff, 0 0 20px #00ffff',
        'glow': '0 0 10px rgba(0, 255, 255, 0.5)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'matrix-rain': 'matrixRain 20s linear infinite',
      },
      keyframes: {
        glow: {
          '0%, 100%': { textShadow: '0 0 5px #00ffff, 0 0 10px #00ffff' },
          '50%': { textShadow: '0 0 20px #00ffff, 0 0 30px #00ffff' },
        },
        matrixRain: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
      },
    },
  },
  plugins: [],
}