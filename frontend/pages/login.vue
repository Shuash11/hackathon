<script setup lang="ts">
import type { GoogleCredentialResponse } from '~/types/auth'

definePageMeta({ layout: 'auth' })
const route = useRoute()
const { signInWithGoogle, redirectAfterLogin, bootstrapCsrf } = useAuth()
const errorMessage = ref('')
const submitting = ref(false)
const csrfReady = ref(false)
const csrfLoading = ref(true)

onMounted(async () => {
  try {
    await bootstrapCsrf()
    csrfReady.value = true
  } catch {
    errorMessage.value = 'A secure sign-in session could not be initialized. Refresh and try again.'
  } finally {
    csrfLoading.value = false
  }
})

async function completeLogin(credential: GoogleCredentialResponse): Promise<void> {
  submitting.value = true
  errorMessage.value = ''
  try {
    await signInWithGoogle(credential)
    await redirectAfterLogin(route.query.redirect)
  } catch {
    errorMessage.value = 'Sign-in could not be completed. Please try again.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <section aria-labelledby="login-title" class="w-full max-w-md rounded-panel bg-white p-6 shadow-panel sm:p-8">
    <h1 id="login-title" class="text-2xl font-bold">Welcome</h1>
    <p class="mt-2 text-muted">Sign in to access your workspace.</p>
    <p v-if="errorMessage" role="alert" class="mt-4 text-sm text-red-700">{{ errorMessage }}</p>
    <p v-if="csrfLoading" role="status" aria-live="polite" class="mt-6 text-sm text-muted">Preparing secure sign-in...</p>
    <div v-else-if="csrfReady" class="mt-6" :aria-busy="submitting"><GoogleSignIn @credential="completeLogin" @error="errorMessage = $event" /></div>
  </section>
</template>
