<script setup lang="ts">
const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()
const { auth, signOut } = useAuth()
const { $supabase } = useNuxtApp()
const errorMessage = ref('')
const submitting = ref(false)
const showLogoutConfirm = ref(false)
const isOpen = computed(() => props.modelValue)

useScenticoBodyLock(isOpen)

function close(): void {
  emit('update:modelValue', false)
}

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

function handleSignOut(): void {
  showLogoutConfirm.value = true
}
async function confirmSignOut(): Promise<void> {
  showLogoutConfirm.value = false
  await signOut()
  close()
}

async function goToDashboard(): Promise<void> {
  close()
  await navigateTo('/dashboard')
}

function handleEscape(event: KeyboardEvent): void {
  if (event.key === 'Escape' && isOpen.value) close()
}

watch(isOpen, open => {
  if (open) errorMessage.value = ''
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

      <div v-if="auth.isAuthenticated" class="mt-6 grid gap-3">
        <p class="text-sm text-espresso/70">You are signed in as {{ auth.user?.email }}.</p>
        <button type="button" class="inline-flex w-full items-center justify-center rounded-full bg-espresso px-7 py-3.5 text-[.85rem] font-bold text-cream-soft" @click="goToDashboard">Go to dashboard</button>
        <button type="button" class="text-sm font-bold text-espresso underline" @click="handleSignOut">Sign out instead</button>
      </div>

      <div v-else class="mt-6" :aria-busy="submitting">
        <button
          type="button"
          class="flex w-full items-center justify-center gap-3 rounded-full border border-espresso/20 bg-white px-4 py-3.5 text-[.85rem] font-bold text-espresso transition hover:bg-espresso/[.04] disabled:cursor-not-allowed disabled:opacity-60"
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
    </div>
  <ScenticoLogoutConfirm v-model="showLogoutConfirm" @confirm="confirmSignOut" />
</template>
