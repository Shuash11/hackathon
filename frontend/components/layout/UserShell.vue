<script setup lang="ts">
const route = useRoute()
const { auth } = useAuth()
const cartItems = useCartItems()
const cartBump = useCartBump()

const cartCount = computed(() => cartItems.value.reduce((sum, item) => sum + item.qty, 0))

const initials = computed(() => {
  const first = auth.user?.first_name?.charAt(0) || ''
  const last = auth.user?.last_name?.charAt(0) || ''
  return (first + last).toUpperCase() || auth.user?.email?.charAt(0).toUpperCase() || 'SC'
})

const links = [
  { label: 'Shop', to: '/dashboard' },
  { label: 'My Orders', to: '/dashboard/orders' },
]

function isActive(to: string): boolean {
  if (to === '/dashboard') return route.path === to
  return route.path.startsWith(to)
}
</script>

<template>
  <div class="min-h-screen bg-[#FAF7F5] text-[#231318]">
    <header class="sticky top-0 z-40 border-b border-[#F0E2E5] bg-white/95 backdrop-blur-xl">
      <div class="mx-auto flex h-16 max-w-[1280px] items-center gap-4 px-4 sm:px-6">
        <NuxtLink to="/dashboard" class="flex shrink-0 items-center gap-2.5">
          <span class="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-[#9E2B47] to-[#6E1226] text-white shadow-[0_6px_16px_rgba(122,25,55,.35)]">
            <span class="h-4 w-[9px] rounded-sm border-[1.5px] border-white" />
          </span>
          <span class="font-display text-xl font-bold tracking-wide text-[#5E0F20]">Scentico</span>
        </NuxtLink>

        <nav aria-label="Shop navigation" class="ml-4 hidden items-center gap-1 sm:flex">
          <NuxtLink
            v-for="l in links"
            :key="l.to"
            :to="l.to"
            class="rounded-full px-4 py-2 text-[14px] font-semibold transition-colors"
            :class="isActive(l.to) ? 'bg-[#FBEFF2] text-[#8A1538]' : 'text-slate-600 hover:bg-slate-50 hover:text-[#231318]'"
          >{{ l.label }}</NuxtLink>
        </nav>

        <div class="relative ml-auto hidden w-full max-w-[280px] md:block">
          <input type="text" placeholder="Search perfumes, bundles..." class="w-full rounded-full border border-[#EBE3E5] bg-[#F8F5F6] px-4 py-2.5 pl-10 text-sm text-[#231318] placeholder:text-slate-400 focus:border-[#8A1538] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8A1538]/15" />
          <svg class="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
        </div>

        <div class="ml-auto flex items-center gap-2 md:ml-0">
          <NuxtLink to="/dashboard/cart" aria-label="Cart" class="relative grid h-10 w-10 place-items-center rounded-full border border-[#EBE3E5] bg-white text-[#5E0F20] transition hover:border-[#8A1538]/40 hover:bg-[#FBEFF2]">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5"><path d="M6 6h15l-1.7 8.5a2 2 0 0 1-2 1.5H9.6a2 2 0 0 1-2-1.6L6 3H3" /><circle cx="10" cy="20" r="1.4" /><circle cx="17.5" cy="20" r="1.4" /></svg>
            <Transition name="pop">
              <span v-if="cartCount" :key="cartBump" class="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[#8A1538] px-1 text-[10px] font-bold text-white shadow">{{ cartCount }}</span>
            </Transition>
          </NuxtLink>
          <span class="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-[#9E2B47] to-[#6E1226] text-xs font-bold text-white shadow-[0_4px_12px_rgba(122,25,55,.3)]">{{ initials }}</span>
        </div>
      </div>
    </header>

    <main class="mx-auto w-full max-w-[1280px] px-4 py-6 sm:px-6">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.pop-enter-active { animation: badge-pop .3s cubic-bezier(.2, 1.4, .4, 1); }
@keyframes badge-pop {
  0% { transform: scale(.4); }
  100% { transform: scale(1); }
}
</style>