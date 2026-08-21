<script setup lang="ts">
definePageMeta({ layout: 'auth' })

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
    window.history.replaceState({}, '', '/dashboard')
    await navigateTo('/dashboard')
  } catch {
    await navigateTo('/')
  }
})
</script>

<template>
  <div />
</template>
