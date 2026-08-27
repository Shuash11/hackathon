<script setup lang="ts">
const emit = defineEmits<{ openMenu: [] }>()
const route = useRoute()
const { auth } = useAuth()
const isAdmin = computed(() => auth.user?.role === 'admin')

const pageTitle = computed(() => {
  if (/^\/dashboard\/orders\/\d+/.test(route.path)) return 'Order detail'
  if (route.path.startsWith('/dashboard/orders')) return isAdmin.value ? 'Customer Orders' : 'My Orders'
  if (route.path.startsWith('/dashboard/catalog')) return 'Products'
  if (route.path.startsWith('/dashboard/analytics')) return 'Analytics'
  if (route.path.startsWith('/dashboard/chat')) return 'Ask AI'
  if (route.path.startsWith('/dashboard/settings')) return 'Settings'
  return 'Dashboard'
})

const initials = computed(() => {
  const first = auth.user?.first_name?.charAt(0) || ''
  const last = auth.user?.last_name?.charAt(0) || ''
  return (first + last).toUpperCase() || auth.user?.email?.charAt(0).toUpperCase() || 'S'
})
</script>

<template>
  <header class="sticky top-0 z-30 border-b border-[#E9ECF2] bg-white/90 backdrop-blur-xl">
    <div class="flex h-16 items-center justify-between px-4 sm:px-6 xl:px-10">
      <div class="flex min-w-0 items-center gap-3">
        <button
          type="button"
          class="rounded-lg border border-[#E9ECF2] bg-white p-2 text-slate-500 hover:border-slate-200 hover:text-slate-800 lg:hidden"
          aria-label="Open navigation"
          aria-controls="dashboard-navigation"
          @click="emit('openMenu')"
        >
          <DashboardIcon name="menu" class="h-5 w-5" />
        </button>
        <div class="min-w-0">
          <p class="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">Scentico operations</p>
          <p class="truncate font-display text-xl font-semibold leading-tight text-[#14161B] sm:text-2xl">{{ pageTitle }}</p>
        </div>
      </div>
      <div class="flex items-center gap-2 sm:gap-4">
        <button type="button" class="relative rounded-lg border border-[#E9ECF2] bg-white p-2 text-slate-500 transition hover:border-slate-200 hover:text-slate-800" aria-label="Notifications">
          <DashboardIcon name="bell" class="h-5 w-5" />
          <span class="absolute right-1.5 top-1.5 h-2 w-2 rounded-full border-2 border-white bg-[#4056E8]" />
        </button>
        <div class="hidden h-8 w-px bg-[#E9ECF2] sm:block" />
        <div class="flex items-center gap-3">
          <span class="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-[#5B79FF] to-[#3D55F0] text-xs font-bold tracking-wide text-white shadow-[0_4px_12px_rgba(74,98,246,.35)]">{{ initials }}</span>
          <div class="hidden max-w-48 sm:block">
            <p class="truncate text-sm font-semibold text-[#14161B]">{{ auth.user?.first_name || 'Atelier owner' }}</p>
            <p class="truncate text-xs text-slate-500">{{ auth.user?.email }}</p>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
