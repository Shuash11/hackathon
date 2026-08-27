<script setup lang="ts">
const emit = defineEmits<{ openLogin: [] }>()
const joined = ref(false)
const resetTimer = ref<ReturnType<typeof setTimeout> | undefined>()

function submitNewsletter(event: Event): void {
  joined.value = true
  if (resetTimer.value) clearTimeout(resetTimer.value)
  resetTimer.value = setTimeout(() => {
    const form = event.currentTarget
    if (form instanceof HTMLFormElement) form.reset()
    joined.value = false
  }, 1800)
}

onBeforeUnmount(() => {
  if (resetTimer.value) clearTimeout(resetTimer.value)
})

const navigate = [
  { href: '#home', label: 'Home' },
  { href: '#about', label: 'Products' },
  { href: '#contact', label: 'Contact' },
]
</script>

<template>
  <footer id="contact" class="relative overflow-hidden bg-[#050C13] pb-8 text-white/70">
    <!-- Bridge from the variants stage above -->
    <div class="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#061018] to-transparent" aria-hidden="true"></div>
    <div class="pointer-events-none absolute -left-40 top-0 h-[360px] w-[360px] rounded-full bg-[#0E2033]/50 blur-[120px]" aria-hidden="true"></div>
    <div class="pointer-events-none absolute -right-32 bottom-0 h-[320px] w-[320px] rounded-full bg-[#3A2A14]/40 blur-[110px]" aria-hidden="true"></div>

    <div class="relative mx-auto max-w-[1180px] px-6 pt-20 md:px-8 md:pt-24">
      <div class="grid grid-cols-1 gap-10 border-b border-white/[.08] pb-12 sm:grid-cols-2 md:grid-cols-[1.2fr_.7fr_.75fr_1fr_1.1fr]">
        <div>
          <a href="#home" aria-label="Scentico Collection home" class="inline-block">
            <img src="/scentico/logo.webp" alt="Scentico Collection" width="1536" height="1024" loading="lazy" decoding="async" class="block h-auto w-[168px] rounded-lg">
          </a>
          <p class="mt-4 max-w-[30ch] text-[.9rem] leading-relaxed text-white/50">Small-batch fragrance made slowly, in warm tones of coffee, amber and peach.</p>
        </div>

        <div>
          <h2 class="mb-4.5 text-[.72rem] font-extrabold uppercase tracking-[.22em] text-white/40">Navigate</h2>
          <ul class="grid gap-3">
            <li v-for="link in navigate" :key="link.href">
              <a :href="link.href" class="text-[.88rem] text-white/75 transition-colors duration-300 hover:text-amber-200">{{ link.label }}</a>
            </li>
          </ul>
        </div>

        <div>
          <h2 class="mb-4.5 text-[.72rem] font-extrabold uppercase tracking-[.22em] text-white/40">Account</h2>
          <ul class="grid gap-3">
            <li><button type="button" class="text-[.88rem] text-white/75 transition-colors duration-300 hover:text-amber-200" @click="emit('openLogin')">Sign in with Google</button></li>
            <li><a href="#about" class="text-[.88rem] text-white/75 transition-colors duration-300 hover:text-amber-200">Track Order</a></li>
          </ul>
        </div>

        <div>
          <h2 class="mb-4.5 text-[.72rem] font-extrabold uppercase tracking-[.22em] text-white/40">Contact</h2>
          <ul class="grid gap-3">
            <li>
              <a href="mailto:hello@scentico.com" class="flex items-center gap-2.5 text-[.88rem] text-white/75 transition-colors duration-300 hover:text-amber-200">
                <svg class="h-4 w-4 shrink-0 stroke-amber-200/70" viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M3 7l9 6 9-6"/><rect x="3" y="5" width="18" height="14" rx="2"/></svg>
                hello@scentico.com
              </a>
            </li>
            <li>
              <a href="tel:+15550192244" class="flex items-center gap-2.5 text-[.88rem] text-white/75 transition-colors duration-300 hover:text-amber-200">
                <svg class="h-4 w-4 shrink-0 stroke-amber-200/70" viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.4 2.1L8.1 9.7a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.4c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.7 2z"/></svg>
                +1 (555) 019-2244
              </a>
            </li>
            <li class="flex items-center gap-2.5 text-[.88rem] text-white/75">
              <svg class="h-4 w-4 shrink-0 stroke-amber-200/70" viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M12 21s-7-5.6-7-11a7 7 0 0 1 14 0c0 5.4-7 11-7 11z"/><circle cx="12" cy="10" r="2.6"/></svg>
              118 Amber Row, Makati
            </li>
            <li class="text-[.8rem] text-white/40">Atelier open weekends only</li>
          </ul>
        </div>

        <div>
          <h2 class="mb-4.5 text-[.72rem] font-extrabold uppercase tracking-[.22em] text-white/40">Stay in Scent</h2>
          <p class="text-[.85rem] text-white/50">New scents, first pour, no spam.</p>
          <form class="mt-4 flex overflow-hidden rounded-full border border-white/[.16] bg-white/[.04] backdrop-blur" @submit.prevent="submitNewsletter">
            <label class="sr-only" for="newsletter-email">Email address</label>
            <input id="newsletter-email" type="email" placeholder="Email address" required class="min-w-0 flex-1 border-none bg-transparent px-4 py-3 text-[.85rem] text-white placeholder:text-white/35 focus:outline-none">
            <button type="submit" class="shrink-0 bg-gradient-to-r from-amber-200 to-[#D9A93B] px-6 text-[.82rem] font-bold text-[#231303] transition hover:brightness-110">
              {{ joined ? 'Joined ✓' : 'Join' }}
            </button>
          </form>
        </div>
      </div>

      <div class="flex flex-col items-center justify-between gap-4 pt-7 sm:flex-row">
        <p class="text-[.8rem] text-white/40">© 2026 Scentico. All rights reserved.</p>
        <div class="flex items-center gap-3">
          <a href="#" aria-label="Instagram" class="grid h-10 w-10 place-items-center rounded-full border border-white/[.14] text-white/60 transition hover:border-amber-200/50 hover:text-amber-200">
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r=".9" fill="currentColor" stroke="none"/></svg>
          </a>
          <a href="#" aria-label="TikTok" class="grid h-10 w-10 place-items-center rounded-full border border-white/[.14] text-white/60 transition hover:border-amber-200/50 hover:text-amber-200">
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16.6 3c.4 2 1.7 3.4 3.9 3.6v2.8c-1.5.1-2.9-.4-3.9-1.2v5.9c0 3.6-2.4 5.9-5.7 5.9-3.1 0-5.4-2.2-5.4-5.2 0-3 2.4-5.3 5.6-5.2v2.9c-1.5-.2-2.7.7-2.7 2.2 0 1.4 1.1 2.4 2.5 2.4 1.6 0 2.8-1.1 2.8-3.2V3h2.9z"/></svg>
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>