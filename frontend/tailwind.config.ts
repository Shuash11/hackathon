import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './composables/**/*.{js,ts}',
    './app.vue',
  ],
  theme: {
    extend: {
      colors: {
        brand: { 50: '#eff6ff', 500: '#2563eb', 600: '#1d4ed8', 700: '#1d4ed8' },
        ink: '#172033',
        muted: '#667085',
        surface: '#f8fafc',
      },
      borderRadius: { panel: '1rem' },
      boxShadow: { panel: '0 10px 30px rgba(23, 32, 51, 0.08)' },
    },
  },
}
