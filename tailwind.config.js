/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E3A8A', // Dark blue
          900: '#172554',
        },
        secondary: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
        },
        gold: {
          DEFAULT: '#D4AF37',
          light: '#F1DDBF',
          dark: '#996515',
        },
        status: {
          cold: '#EF4444',  // Red for cold leads
          warm: '#F59E0B',  // Orange/amber for warm leads
          hot: '#10B981',   // Green for hot leads
          available: '#10B981', // Green for available properties
          reserved: '#F59E0B',  // Orange/amber for reserved properties
          sold: '#6B7280',      // Gray for sold properties
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 8px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 4px 12px rgba(0, 0, 0, 0.12)',
      },
    },
  },
  plugins: [],
};