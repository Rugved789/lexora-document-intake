/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary - Deep ink / midnight navy
        primary: {
          DEFAULT: '#0F1419',
          light: '#1C2530',
          lighter: '#2D3748',
        },
        // Background - Warm paper / ivory
        background: {
          DEFAULT: '#FDFCFA',
          elevated: '#FFFFFF',
          subtle: '#F7F5F2',
        },
        // Secondary - Graphite / muted gray
        secondary: {
          DEFAULT: '#4A5568',
          light: '#6B7280',
          lighter: '#9CA3AF',
        },
        // Accent - Restrained indigo (use sparingly!)
        accent: {
          DEFAULT: '#4C51BF',
          light: '#5A67D8',
          dark: '#3730A3',
        },
        // Document - Warm brass/gold
        document: {
          DEFAULT: '#B8860B',
          light: '#DAA520',
        },
        // Paper
        paper: {
          DEFAULT: '#FFFEF9',
          border: 'rgba(15, 20, 25, 0.06)',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Lora', 'Georgia', 'Times New Roman', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'paper': '0 4px 12px rgba(15, 20, 25, 0.06), 0 2px 6px rgba(15, 20, 25, 0.04)',
      },
    },
  },
  plugins: [],
}
