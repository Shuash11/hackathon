<script setup lang="ts">
definePageMeta({ layout: 'auth' })

onMounted(async () => {
  try {
    const { $supabase } = useNuxtApp()
    const api = useApi()
    let accessToken: string | null = null
    const { data: sessionData } = await $supabase.auth.getSession()
    accessToken = sessionData.session?.access_token ?? null
    if (!accessToken) {
      const url = new URL(window.location.href)
      const code = url.searchParams.get('code')
      if (code) {
        const { data, error } = await $supabase.auth.exchangeCodeForSession(window.location.href)
        if (error) throw error
        accessToken = data.session?.access_token ?? null
      }
    }
    if (!accessToken) {
      const hash = window.location.hash.substring(1)
      const params = new URLSearchParams(hash)
      accessToken = params.get('access_token')
    }
    if (!accessToken) throw new Error('No access_token')
    const data = await api.request<{ user: import('~/types/auth').User }>('/auth/supabase/', {
      method: 'POST',
      body: { access_token: accessToken },
    })
    const auth = useAuthStore()
    auth.setUser(data.user)
    window.history.replaceState({}, '', '/')
    await navigateTo('/dashboard', { replace: true })
  } catch (e) {
    console.error('[auth/callback] failed', e)
    window.history.replaceState({}, '', '/')
    await navigateTo('/', { replace: true })
  }
})
</script>

<template>
  <div class="w-full max-w-[420px] rounded-[28px] border border-cream-deep bg-cream-soft p-8 shadow-[0_32px_80px_-20px_rgba(42,24,16,.45),0_0_0_1px_rgba(239,219,192,.9)] md:p-10">
    <div class="text-center">
      <span class="text-[.68rem] font-bold uppercase tracking-[.28em] text-peach-deep">Scentico</span>
      <div class="relative mx-auto mt-6 flex h-[84px] w-[84px] items-center justify-center">
        <div class="absolute inset-0 rounded-full border border-espresso/10" aria-hidden="true" />
        <div class="absolute inset-0 rounded-full border-2 border-transparent border-t-gold-light border-r-gold/40 animate-spin" style="animation-duration: 1.1s" aria-hidden="true" />
        <div class="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-espresso shadow-[0_8px_20px_rgba(42,24,16,.35)]">
          <svg class="h-6 w-6 text-cream-soft" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 3.5c1.2 2.2 3.2 3.6 5.4 4.1-.9 1.7-2.4 3-4.2 3.7-.4-1.1-1.2-1.1-1.2-1.1s-.8 0-1.2 1.1c-1.8-.7-3.3-2-4.2-3.7 2.2-.5 4.2-1.9 5.4-4.1Z" fill="currentColor" opacity=".95" />
            <path d="M10.2 12.2h3.6l.7 6.8c.1.8-.5 1.5-1.3 1.5h-2.4c-.8 0-1.4-.7-1.3-1.5l.7-6.8Z" fill="currentColor" />
            <path d="M9.4 9.2h5.2c.5 0 .9.4.9.9v2.1H8.5V10.1c0-.5.4-.9.9-.9Z" fill="currentColor" opacity=".9" />
          </svg>
        </div>
      </div>
      <h1 class="mt-6 font-display text-[1.65rem] leading-none text-espresso">Signing you in</h1>
      <p class="mx-auto mt-2.5 max-w-[28ch] text-[.88rem] leading-relaxed text-espresso/60">Securing your fragrance profile. You’ll be at your dashboard in a moment.</p>
      <div class="mt-7 flex justify-center gap-1.5" aria-hidden="true">
        <span class="h-1.5 w-1.5 animate-[pulseDot_1s_ease-in-out_infinite] rounded-full bg-peach-deep" />
        <span class="h-1.5 w-1.5 animate-[pulseDot_1s_ease-in-out_.2s_infinite] rounded-full bg-peach-deep/70" />
        <span class="h-1.5 w-1.5 animate-[pulseDot_1s_ease-in-out_.4s_infinite] rounded-full bg-peach-deep/40" />
      </div>
      <p class="mt-7 text-[.68rem] font-semibold uppercase tracking-[.16em] text-espresso/35">Please don’t close this window</p>
    </div>
  </div>
</template>

<style scoped>
@keyframes pulseDot {
  0%, 100% { opacity: .35; transform: scale(.85); }
  50% { opacity: 1; transform: scale(1); }
}
</style>
