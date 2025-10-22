/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f3e8ff',
          100: '#dbeafe',    // azul claro (blue-100)
  200: '#bfdbfe',    // azul claro (blue-200)
  300: '#93c5fd',    // azul medio (blue-300)
  400: '#60a5fa',    // azul (blue-400)
  500: '#1e293b',    // se mantiene igual (slate-800)
  600: '#1e40af',    // azul oscuro (blue-600)
  700: '#1e3a8a',    // azul marino (blue-700)
  800: '#1e2a4a',    // azul muy oscuro
  900: '#1a2036',    // azul casi negro
        },
        dark: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        }
      }
    },
  },
  plugins: [],
}
