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
</script>

<template>
  <footer class="bg-footer pb-6 pt-16 text-cream-soft/70 md:pt-20"><div class="mx-auto max-w-[1180px] px-6 md:px-8"><div class="grid grid-cols-1 gap-10 border-b border-cream-soft/[.12] pb-12 sm:grid-cols-2 md:grid-cols-[1.3fr_.8fr_.8fr_1.1fr]"><div><a href="#home" aria-label="Scentico Collection home" class="inline-block"><img src="/scentico/logo.webp" alt="Scentico Collection" width="1536" height="1024" loading="lazy" class="block h-auto w-[168px] rounded-lg"></a><p class="mt-4 max-w-[32ch] text-[.9rem] text-cream-soft/55">Small-batch fragrance made slowly, in warm tones of coffee, amber and peach.</p></div><div><h2 class="mb-4.5 font-display text-base text-cream-soft">Navigate</h2><ul class="grid gap-3"><li v-for="link in [{ href: '#home', label: 'Home' }, { href: '#about', label: 'About' }, { href: '#products', label: 'Products' }, { href: '#contact', label: 'Contact' }]" :key="link.href"><a :href="link.href" class="text-[.88rem] transition-colors duration-300 hover:text-peach-light">{{ link.label }}</a></li></ul></div><div><h2 class="mb-4.5 font-display text-base text-cream-soft">Account</h2><ul class="grid gap-3"><li><button type="button" class="text-[.88rem] transition-colors duration-300 hover:text-peach-light" @click="emit('openLogin')">Sign in with Google</button></li><li><a href="#products" class="text-[.88rem] transition-colors duration-300 hover:text-peach-light">Track Order</a></li></ul></div><div><h2 class="mb-4.5 font-display text-base text-cream-soft">Stay in Scent</h2><p class="mb-1 text-[.85rem] text-cream-soft/55">New scents, first pour, no spam.</p><form class="mt-4 flex overflow-hidden rounded-full border border-cream-soft/[.22]" @submit.prevent="submitNewsletter"><label class="sr-only" for="newsletter-email">Email address</label><input id="newsletter-email" type="email" placeholder="Email address" required class="flex-1 border-none bg-transparent px-4 py-3 text-[.85rem] text-cream-soft placeholder:text-cream-soft/40 focus:outline-none"><button type="submit" class="bg-peach-deep px-5 text-[.8rem] font-bold tracking-wide text-espresso">{{ joined ? 'Joined ✓' : 'Join' }}</button></form><p v-if="joined" role="status" aria-live="polite" class="mt-2 text-[.75rem] text-peach-light">Joined locally — this demo does not send email.</p></div></div><div class="flex flex-wrap items-center justify-between gap-3.5 pt-6 text-[.8rem] text-cream-soft/45"><span>© 2026 Scentico. All rights reserved.</span><div class="flex gap-3"><a href="#" aria-label="Instagram" class="flex h-9 w-9 items-center justify-center rounded-full border border-cream-soft/[.22] transition-colors duration-300 hover:border-peach-deep hover:bg-peach-deep"><svg class="h-4 w-4 stroke-cream-soft" viewBox="0 0 24 24" fill="none" stroke-width="1.8" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/></svg></a><a href="#" aria-label="TikTok" class="flex h-9 w-9 items-center justify-center rounded-full border border-cream-soft/[.22] transition-colors duration-300 hover:border-peach-deep hover:bg-peach-deep"><svg class="h-4 w-4 stroke-cream-soft" viewBox="0 0 24 24" fill="none" stroke-width="1.8" aria-hidden="true"><path d="M15 3v11.5a3.5 3.5 0 1 1-3-3.46"/><path d="M15 3c0 2.5 2 4.5 4.5 4.5"/></svg></a></div></div></div></footer>
</template>
