<script setup lang="ts">
definePageMeta({ layout: 'auth' })
const log = ref<string[]>([])
const errorMessage = ref('')

onMounted(async () => {
  try {
    const hash = window.location.hash.substring(1)
    log.value.push('hash: ' + (hash ? hash.length + ' chars' : 'EMPTY'))

    const params = new URLSearchParams(hash)
    const accessToken = params.get('access_token')
    log.value.push('token: ' + (accessToken ? 'YES' : 'NO'))

    if (!accessToken) throw new Error('No access_token in URL')

    const config = useRuntimeConfig()
    const apiBase = config.public.apiBaseUrl
    log.value.push('api: ' + apiBase)

    log.value.push('fetching health...')
    const healthResp = await fetch(apiBase + '/health/', { credentials: 'include' })
    log.value.push('health: ' + healthResp.status)

    log.value.push('posting to backend...')
    const resp = await fetch(apiBase + '/auth/supabase/', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ access_token: accessToken }),
    })
    const body = await resp.text()
    log.value.push('backend: ' + resp.status)

    if (!resp.ok) throw new Error('Backend ' + resp.status + ': ' + body.substring(0, 200))

    const data = JSON.parse(body)
    const auth = useAuthStore()
    auth.setUser(data.user)
    log.value.push('SUCCESS - redirecting')
    window.history.replaceState({}, '', '/auth/callback')
    await navigateTo('/dashboard')
  } catch (err: any) {
    errorMessage.value = err.message || String(err)
  }
})
</script>

<template>
  <section class="w-full max-w-lg rounded-panel bg-white p-6 shadow-panel sm:p-8">
    <h1 class="text-2xl font-bold">Signing in</h1>
    <div class="mt-4 font-mono text-xs text-muted" style="white-space: pre-line">{{ log.join('\n') }}</div>
    <p v-if="errorMessage" role="alert" class="mt-4 text-sm text-red-700 font-mono">{{ errorMessage }}</p>
    <NuxtLink v-if="errorMessage" to="/" class="mt-6 inline-block text-sm font-medium underline">Back to sign in</NuxtLink>
  </section>
</template>
