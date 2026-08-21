<script setup lang="ts">
definePageMeta({ layout: 'auth' })
const { $supabase } = useNuxtApp()
const errorMessage = ref('')
const submitting = ref(false)

async function signInWithGoogle(): Promise<void> {
  submitting.value = true
  errorMessage.value = ''
  try {
    const { error } = await $supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback`, queryParams: { prompt: 'select_account' } },
    })
    if (error) throw error
  } catch {
    errorMessage.value = 'Sign-in could not be started. Please try again.'
    submitting.value = false
  }
}
</script>

<template>
  <section aria-labelledby="login-title" class="w-full max-w-md rounded-panel bg-white p-6 shadow-panel sm:p-8">
    <h1 id="login-title" class="text-2xl font-bold">Welcome</h1>
    <p class="mt-2 text-muted">Sign in to access your workspace.</p>
    <p v-if="errorMessage" role="alert" class="mt-4 text-sm text-red-700">{{ errorMessage }}</p>
    <div class="mt-6" :aria-busy="submitting">
      <button
        type="button"
        class="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
        :disabled="submitting"
        @click="signInWithGoogle"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" class="h-5 w-5">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
          <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52Z" />
        </svg>
        {{ submitting ? 'Redirecting...' : 'Continue with Google' }}
      </button>
    </div>
  </section>
</template>
