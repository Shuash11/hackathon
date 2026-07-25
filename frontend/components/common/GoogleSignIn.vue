<script setup lang="ts">
import type { GoogleCredentialResponse } from '~/types/auth'

const emit = defineEmits<{ credential: [value: GoogleCredentialResponse]; error: [message: string] }>()
const target = ref<HTMLElement | null>(null)
const { $googleIdentity } = useNuxtApp()

onMounted(async () => {
  try {
    const identity = await $googleIdentity.load()
    if (!target.value) return
    identity.initialize({ client_id: $googleIdentity.clientId, callback: response => emit('credential', response) })
    identity.renderButton(target.value, { theme: 'outline', size: 'large', width: 320, text: 'continue_with' })
  } catch (error) {
    emit('error', error instanceof Error ? error.message : 'Google sign-in is unavailable.')
  }
})
</script>

<template><div ref="target" aria-label="Sign in with Google" /></template>
