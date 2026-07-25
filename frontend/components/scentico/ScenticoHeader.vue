<script setup lang="ts">
const emit = defineEmits<{ openLogin: [] }>()
const isMenuOpen = ref(false)
const { isScrolled } = useScenticoHeader()
const { auth, loadCurrentUser, signOut } = useAuth()

useScenticoBodyLock(isMenuOpen)

function closeMenu(): void {
  isMenuOpen.value = false
}

function openLogin(): void {
  closeMenu()
  emit('openLogin')
}

async function handleSignOut(): Promise<void> {
  await signOut()
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
  <header class="scentico-header sticky top-0 z-[200] py-3 transition-all duration-300 ease-out" :class="{ scrolled: isScrolled }">
    <div class="mx-auto flex max-w-[1180px] items-center justify-between gap-6 px-6 md:px-8">
      <a href="#home" aria-label="Scentico Collection home" class="shrink-0"><img src="/scentico/logo.png" alt="Scentico Collection" width="1536" height="1024" fetchpriority="high" class="block h-auto w-24 rounded-md md:w-[114px]"></a>
      <nav class="hidden items-center gap-9 md:flex" aria-label="Primary navigation"><ul class="flex gap-8"><li v-for="link in [{ href: '#home', label: 'Home' }, { href: '#about', label: 'About' }, { href: '#products', label: 'Products' }, { href: '#contact', label: 'Contact' }]" :key="link.href"><a :href="link.href" class="relative py-1 text-[.78rem] font-bold uppercase tracking-[.14em] text-espresso/70 transition-colors duration-300 after:absolute after:-bottom-0.5 after:left-0 after:h-[1.5px] after:w-0 after:bg-peach-deep after:transition-all after:duration-300 hover:text-espresso hover:after:w-full">{{ link.label }}</a></li></ul></nav>
      <div class="flex items-center gap-3.5">
        <button type="button" aria-label="Search" class="group hidden h-[42px] w-[42px] items-center justify-center rounded-full border border-espresso/20 transition-colors duration-300 hover:border-espresso hover:bg-espresso md:flex"><svg class="h-[18px] w-[18px] stroke-espresso transition-colors duration-300 group-hover:stroke-cream-soft" viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg></button>
        <NuxtLink v-if="auth.isAuthenticated" to="/dashboard" class="hidden rounded-full border border-espresso/30 px-7 py-3.5 text-[.85rem] font-bold text-espresso transition-all duration-300 hover:-translate-y-0.5 hover:border-espresso md:inline-flex">Your dashboard</NuxtLink>
        <button v-else type="button" class="hidden rounded-full border border-espresso/30 px-7 py-3.5 text-[.85rem] font-bold text-espresso transition-all duration-300 hover:-translate-y-0.5 hover:border-espresso md:inline-flex" @click="openLogin">Sign in with Google</button>
        <button v-if="auth.isAuthenticated" type="button" class="hidden text-[.72rem] font-bold uppercase tracking-[.1em] text-espresso/70 hover:text-espresso md:inline-flex" @click="handleSignOut">Sign out</button>
        <button type="button" class="relative h-11 w-11 rounded-full border border-espresso/20 md:hidden" :aria-label="isMenuOpen ? 'Close menu' : 'Open menu'" :aria-expanded="isMenuOpen" aria-controls="scentico-mobile-menu" @click="isMenuOpen = !isMenuOpen"><span class="absolute left-[13px] right-[13px] top-4 h-[1.6px] bg-espresso transition-transform duration-300" :class="{ 'translate-y-[6px] rotate-45': isMenuOpen }"></span><span class="absolute left-[13px] right-[13px] top-[22px] h-[1.6px] bg-espresso transition-opacity duration-300" :class="{ 'opacity-0': isMenuOpen }"></span><span class="absolute left-[13px] right-[13px] top-7 h-[1.6px] bg-espresso transition-transform duration-300" :class="{ '-translate-y-[6px] -rotate-45': isMenuOpen }"></span></button>
      </div>
    </div>
  </header>
  <nav id="scentico-mobile-menu" aria-label="Mobile navigation" class="fixed inset-0 z-[190] flex flex-col items-center justify-center gap-9 bg-espresso text-cream-soft transition-all duration-500 ease-out" :class="isMenuOpen ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none -translate-y-full opacity-0'">
    <a v-for="link in [{ href: '#home', label: 'Home' }, { href: '#about', label: 'About' }, { href: '#products', label: 'Products' }, { href: '#contact', label: 'Contact' }]" :key="link.href" :href="link.href" class="font-display text-3xl transition-colors duration-300 hover:text-peach-light" @click="closeMenu">{{ link.label }}</a>
    <NuxtLink v-if="auth.isAuthenticated" to="/dashboard" class="mt-2 inline-flex rounded-full bg-cream-soft px-8 py-3.5 text-sm font-bold text-espresso" @click="closeMenu">Your dashboard</NuxtLink>
    <button v-else type="button" class="mt-2 inline-flex rounded-full bg-cream-soft px-8 py-3.5 text-sm font-bold text-espresso" @click="openLogin">Sign in with Google</button>
    <button v-if="auth.isAuthenticated" type="button" class="text-sm text-cream-soft/70 underline" @click="handleSignOut">Sign out</button>
  </nav>
</template>
