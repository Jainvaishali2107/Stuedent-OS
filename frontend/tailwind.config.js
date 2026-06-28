/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        background: '#0f1117',
        foreground: '#f8fafc',
        card: { DEFAULT: '#161922', foreground: '#f8fafc' },
        primary: { DEFAULT: '#6366f1', foreground: '#ffffff' },
        secondary: { DEFAULT: '#1e2230', foreground: '#e2e8f0' },
        muted: { DEFAULT: '#1e2230', foreground: '#94a3b8' },
        accent: { DEFAULT: '#818cf8', foreground: '#ffffff' },
        destructive: '#ef4444',
        border: '#2a3042',
        input: '#2a3042',
        ring: '#6366f1',
      },
      borderRadius: {
        lg: '0.75rem',
        md: '0.5rem',
        sm: '0.375rem',
      },
    },
  },
  plugins: [],
};
