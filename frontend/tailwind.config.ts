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
        atelier: {
          ink: '#20241f',
          moss: '#5f6f5d',
          sage: '#889684',
          clay: '#b9684d',
          cream: '#fffcf7',
          canvas: '#f2eee6',
          line: '#ded8ce',
        },
        cream: '#F7E9D7',
        'cream-soft': '#FBF2E6',
        'cream-deep': '#EFDBC0',
        espresso: '#2A1810',
        'espresso-soft': '#3D2416',
        coffee: '#5C3826',
        peach: '#E39B6B',
        'peach-light': '#F0C39A',
        'peach-deep': '#C97A47',
        gold: '#B8863B',
        'gold-light': '#D4A857',
        footer: '#1E120B',
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        glyphic: ['Cormorant', 'serif'],
        body: ['Manrope', 'sans-serif'],
      },
      borderRadius: { panel: '1rem' },
      boxShadow: {
        panel: '0 10px 30px rgba(23, 32, 51, 0.08)',
        soft: '0 20px 50px -25px rgba(42, 24, 16, .45)',
        card: '0 18px 40px -28px rgba(42, 24, 16, .6)',
        'card-hover': '0 30px 55px -25px rgba(42, 24, 16, .55)',
      },
      keyframes: {
        drift: {
          '0%, 100%': { transform: 'translateY(0) scale(1)', opacity: '.85' },
          '50%': { transform: 'translateY(-14px) scale(1.03)', opacity: '1' },
        },
        trail: { to: { strokeDashoffset: '-200' } },
        diffuse: {
          '0%': { transform: 'translateX(-50%) scale(.5)', opacity: '.6' },
          '100%': { transform: 'translateX(-50%) scale(2.1)', opacity: '0' },
        },
      },
    },
  },
}
