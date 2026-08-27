<script setup lang="ts">
const emit = defineEmits<{ openLogin: [] }>()
const isMenuOpen = ref(false)
const showLogoutConfirm = ref(false)
const { auth, loadCurrentUser, signOut } = useAuth()

useScenticoBodyLock(isMenuOpen)

const links = [
  { href: '#home', label: 'Home' },
  { href: '#about', label: 'About' },
  { href: '#products', label: 'Products' },
  { href: '#contact', label: 'Contact' },
]

function closeMenu(): void {
  isMenuOpen.value = false
}

function openLogin(): void {
  closeMenu()
  emit('openLogin')
}

function handleSignOut(): void {
  showLogoutConfirm.value = true
}
async function confirmSignOut(): Promise<void> {
  showLogoutConfirm.value = false
  await signOut()
  await navigateTo('/')
}

function handleEscape(event: KeyboardEvent): void {
  if (event.key === 'Escape') closeMenu()
}

onMounted(() => {
  if (!auth.initialized) void loadCurrentUser()
  document.addEventListener('keydown', handleEscape)
})
onBeforeUnmount(() => document.removeEventListener('keydown', handleEscape))
</script>

<template>
  <header class="fixed inset-x-0 top-0 z-[200] py-5">
    <div class="mx-auto flex max-w-[1180px] items-center justify-between gap-6 px-6 md:px-8">
      <a href="#home" class="scentico-glow absolute left-6 top-5 font-display text-lg font-bold uppercase tracking-[.22em] text-white/85 transition-all duration-300 hover:text-white md:left-8" aria-label="Scentico home">Scentico</a>
      <nav class="scentico-glow mx-auto flex items-center gap-10" aria-label="Primary navigation">
        <a v-for="link in links" :key="link.href" :href="link.href" class="relative py-1 text-[.78rem] font-bold uppercase tracking-[.18em] text-white/85 transition-all duration-300 hover:text-white hover:[text-shadow:0_0_18px_rgba(221,234,247,.95),0_0_40px_rgba(178,205,233,.7)]">{{ link.label }}</a>
      </nav>
      <div class="scentico-glow absolute right-6 top-5 flex items-center gap-5 md:right-8">
        <NuxtLink v-if="auth.isAuthenticated" to="/dashboard" class="text-[.78rem] font-bold uppercase tracking-[.18em] text-white/85 transition-all duration-300 hover:text-white hover:[text-shadow:0_0_18px_rgba(221,234,247,.95),0_0_40px_rgba(178,205,233,.7)]">Dashboard</NuxtLink>
        <button v-else type="button" class="group relative text-[.78rem] font-bold uppercase tracking-[.18em] text-white/85 transition-all duration-300 hover:text-white hover:[text-shadow:0_0_18px_rgba(221,234,247,.95),0_0_40px_rgba(178,205,233,.7)]" @click="openLogin">Sign in<span class="absolute -bottom-1 left-0 h-[1.5px] w-full bg-white/50 transition-all duration-300 group-hover:bg-white group-hover:shadow-[0_0_10px_rgba(221,234,247,.9)]"></span></button>
        <button v-if="auth.isAuthenticated" type="button" class="text-[.7rem] font-bold uppercase tracking-[.14em] text-white/50 transition-colors duration-300 hover:text-white" @click="handleSignOut">Sign out</button>
      </div>
      <button type="button" class="scentico-glow absolute right-6 top-5 h-11 w-11 md:hidden" :aria-label="isMenuOpen ? 'Close menu' : 'Open menu'" :aria-expanded="isMenuOpen" aria-controls="scentico-mobile-menu" @click="isMenuOpen = !isMenuOpen"><span class="absolute left-[13px] right-[13px] top-4 h-[1.6px] bg-white transition-transform duration-300" :class="{ 'translate-y-[6px] rotate-45': isMenuOpen }"></span><span class="absolute left-[13px] right-[13px] top-[22px] h-[1.6px] bg-white transition-opacity duration-300" :class="{ 'opacity-0': isMenuOpen }"></span><span class="absolute left-[13px] right-[13px] top-7 h-[1.6px] bg-white transition-transform duration-300" :class="{ '-translate-y-[6px] -rotate-45': isMenuOpen }"></span></button>
    </div>
  </header>
  <nav id="scentico-mobile-menu" aria-label="Mobile navigation" class="fixed inset-0 z-[190] flex flex-col items-center justify-center gap-9 bg-[#061F39]/95 text-white backdrop-blur-md transition-all duration-500 ease-out" :class="isMenuOpen ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none -translate-y-full opacity-0'">
    <a v-for="link in links" :key="link.href" :href="link.href" class="scentico-glow font-display text-3xl transition-colors duration-300 hover:text-[#DDEAF7]" @click="closeMenu">{{ link.label }}</a>
    <NuxtLink v-if="auth.isAuthenticated" to="/dashboard" class="mt-2 inline-flex rounded-full border border-white/30 px-8 py-3.5 text-sm font-bold text-white" @click="closeMenu">Your dashboard</NuxtLink>
    <button v-else type="button" class="mt-2 inline-flex rounded-full border border-white/30 px-8 py-3.5 text-sm font-bold text-white" @click="openLogin">Sign in with Google</button>
    <button v-if="auth.isAuthenticated" type="button" class="text-sm text-white/60 underline" @click="handleSignOut">Sign out</button>
  </nav>
  <ScenticoLogoutConfirm v-model="showLogoutConfirm" @confirm="confirmSignOut" />
</template>

<style scoped>
.scentico-glow {
  text-shadow: 0 0 14px rgba(221, 234, 247, .75), 0 0 34px rgba(178, 205, 233, .45);
}
</style>
