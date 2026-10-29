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
        background: {
          light: '#FBFBFA',
          dark: '#121316'
        },
        surface: {
          light: '#FFFFFF',
          dark: '#1A1C20'
        },
        card: {
          light: '#FFFFFF',
          dark: '#1E2025'
        },
        border: {
          light: '#E7E7E4',
          dark: '#2A2D35'
        },
        charcoal: {
          DEFAULT: '#191C21',
          muted: '#636A79',
          light: '#949BA8',
          dark: '#F1F3F7'
        },
        editorial: {
          accent: '#2563EB',
          accentDark: '#3B82F6',
          ink: '#0F172A',
          paper: '#FDFCF7'
        }
      },
      fontFamily: {
        serif: ['Newsreader', 'Georgia', 'Cambria', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
