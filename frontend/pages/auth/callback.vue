<script setup lang="ts">
definePageMeta({ layout: 'auth' })
const errorMessage = ref('')

onMounted(async () => {
  try {
    const hash = window.location.hash.substring(1)
    const params = new URLSearchParams(hash)
    const accessToken = params.get('access_token')

    if (!accessToken) throw new Error('No access_token')

    const config = useRuntimeConfig()
    const apiBase = config.public.apiBaseUrl

    await fetch(apiBase + '/health/', { credentials: 'include' })

    const csrfCookie = document.cookie.split('; ').find(c => c.startsWith('csrftoken='))
    const csrf = csrfCookie ? decodeURIComponent(csrfCookie.slice('csrftoken='.length)) : null

    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    if (csrf) headers['X-CSRFToken'] = csrf

    const resp = await fetch(apiBase + '/auth/supabase/', {
      method: 'POST',
      credentials: 'include',
      headers,
      body: JSON.stringify({ access_token: accessToken }),
    })

    if (!resp.ok) throw new Error('Backend error')

    const data = await resp.json()
    const auth = useAuthStore()
    auth.setUser(data.user)
    window.history.replaceState({}, '', '/auth/callback')
    await navigateTo('/dashboard')
  } catch {
    errorMessage.value = 'Sign-in could not be completed.'
  }
})
</script>

<template>
  <section class="w-full max-w-md rounded-panel bg-white p-6 shadow-panel sm:p-8">
    <h1 class="text-2xl font-bold">Signing in</h1>
    <p v-if="!errorMessage" class="mt-4 text-sm text-muted">Completing sign-in...</p>
    <p v-if="errorMessage" role="alert" class="mt-4 text-sm text-red-700">{{ errorMessage }}</p>
    <NuxtLink v-if="errorMessage" to="/" class="mt-6 inline-block text-sm font-medium underline">Back to sign in</NuxtLink>
  </section>
</template>
