<script setup lang="ts">
import type { GoogleCredentialResponse } from '~/types/auth'

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()
const { auth, bootstrapCsrf, loadCurrentUser, signInWithGoogle, signOut } = useAuth()
const errorMessage = ref('')
const submitting = ref(false)
const csrfReady = ref(false)
const csrfLoading = ref(false)
const isOpen = computed(() => props.modelValue)

useScenticoBodyLock(isOpen)

function close(): void {
  emit('update:modelValue', false)
}

async function prepare(): Promise<void> {
  errorMessage.value = ''
  csrfReady.value = false
  csrfLoading.value = true
  try {
    if (!auth.initialized) await loadCurrentUser()
    if (!auth.isAuthenticated) {
      await bootstrapCsrf()
      csrfReady.value = true
    }
  } catch {
    errorMessage.value = 'The sign-in service is unavailable. Start the local API and try again.'
  } finally {
    csrfLoading.value = false
  }
}

async function completeLogin(credential: GoogleCredentialResponse): Promise<void> {
  submitting.value = true
  errorMessage.value = ''
  try {
    if (!csrfReady.value) await prepare()
    if (!csrfReady.value) return
    await signInWithGoogle(credential)
    close()
    await navigateTo('/dashboard')
  } catch {
    errorMessage.value = 'Sign-in could not be completed. Please try again.'
  } finally {
    submitting.value = false
  }
}

async function handleSignOut(): Promise<void> {
  await signOut()
  await prepare()
}

async function goToDashboard(): Promise<void> {
  close()
  await navigateTo('/dashboard')
}

function handleEscape(event: KeyboardEvent): void {
  if (event.key === 'Escape' && isOpen.value) close()
}

watch(isOpen, open => {
  if (open) void prepare()
})
onMounted(() => document.addEventListener('keydown', handleEscape))
onBeforeUnmount(() => document.removeEventListener('keydown', handleEscape))
</script>

<template>
  <div
    class="fixed inset-0 z-[400] flex items-center justify-center bg-[rgba(20,11,7,.6)] p-5 backdrop-blur-md transition-opacity duration-300"
    :class="isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'"
    @click.self="close"
  >
    <section
      role="dialog"
      aria-modal="true"
      aria-labelledby="scentico-login-title"
      class="relative w-full max-w-[400px] rounded-[24px] bg-cream-soft p-8 shadow-[0_40px_80px_-30px_rgba(20,11,7,.6)] transition-transform duration-300 md:p-10"
      :class="isOpen ? 'translate-y-0 scale-100' : 'translate-y-4 scale-[.97]'"
      :aria-hidden="!isOpen"
      :inert="!isOpen"
    >
      <button
        type="button"
        aria-label="Close login"
        class="group absolute right-[18px] top-[18px] flex h-9 w-9 items-center justify-center rounded-full border border-espresso/[.18] transition-colors duration-300 hover:bg-espresso"
        @click="close"
      >
        <svg class="h-3.5 w-3.5 stroke-espresso transition-colors duration-300 group-hover:stroke-cream-soft" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12" /></svg>
      </button>

      <span class="mb-2.5 block text-[.72rem] font-bold uppercase tracking-[.22em] text-peach-deep">Scentico Account</span>
      <h2 id="scentico-login-title" class="font-display text-[1.7rem] text-espresso">Welcome back.</h2>
      <p class="mt-2 text-[.9rem] text-espresso/70">Use your Google account to reorder your scent or track a delivery.</p>
      <p v-if="errorMessage" role="alert" class="mt-4 text-sm text-red-700">{{ errorMessage }}</p>
      <p v-if="csrfLoading" role="status" aria-live="polite" class="mt-6 text-sm text-espresso/70">Preparing secure sign-in...</p>

      <div v-if="auth.isAuthenticated" class="mt-6 grid gap-3">
        <p class="text-sm text-espresso/70">You are signed in as {{ auth.user?.email }}.</p>
        <button type="button" class="inline-flex w-full items-center justify-center rounded-full bg-espresso px-7 py-3.5 text-[.85rem] font-bold text-cream-soft" @click="goToDashboard">Go to dashboard</button>
        <button type="button" class="text-sm font-bold text-espresso underline" @click="handleSignOut">Sign out instead</button>
      </div>

      <div v-else-if="isOpen" class="mt-6" :aria-busy="submitting">
        <GoogleSignIn @credential="completeLogin" @error="errorMessage = $event" />
      </div>
    </section>
  </div>
</template>
