<script setup lang="ts">
const emit = defineEmits<{ openMenu: [] }>()
const route = useRoute()
const { auth } = useAuth()

const pageTitle = computed(() => {
  if (/^\/dashboard\/orders\/\d+/.test(route.path)) return 'Order detail'
  if (route.path.startsWith('/dashboard/orders')) return 'Orders'
  return 'Dashboard'
})

const initials = computed(() => {
  const first = auth.user?.first_name?.charAt(0) || ''
  const last = auth.user?.last_name?.charAt(0) || ''
  return (first + last).toUpperCase() || auth.user?.email?.charAt(0).toUpperCase() || 'S'
})
</script>

<template>
  <header class="sticky top-0 z-30 border-b border-atelier-line/80 bg-atelier-canvas/90 backdrop-blur-xl">
    <div class="flex h-20 items-center justify-between px-4 sm:px-6 xl:px-10">
      <div class="flex min-w-0 items-center gap-3">
        <button
          type="button"
          class="rounded-xl border border-atelier-line bg-atelier-cream p-2.5 text-atelier-ink shadow-sm hover:border-atelier-sage lg:hidden"
          aria-label="Open navigation"
          aria-controls="dashboard-navigation"
          @click="emit('openMenu')"
        >
          <DashboardIcon name="menu" class="h-5 w-5" />
        </button>
        <div class="min-w-0">
          <p class="text-[10px] font-bold uppercase tracking-[0.22em] text-atelier-moss">Scentico operations</p>
          <p class="truncate font-display text-xl leading-tight sm:text-2xl">{{ pageTitle }}</p>
        </div>
      </div>
      <div class="flex items-center gap-2 sm:gap-4">
        <button type="button" class="relative rounded-full border border-atelier-line bg-atelier-cream p-2.5 text-atelier-ink transition hover:border-atelier-sage" aria-label="Notifications">
          <DashboardIcon name="bell" class="h-5 w-5" />
          <span class="absolute right-1.5 top-1.5 h-2 w-2 rounded-full border-2 border-atelier-cream bg-atelier-clay" />
        </button>
        <div class="hidden h-8 w-px bg-atelier-line sm:block" />
        <div class="flex items-center gap-3">
          <span class="grid h-10 w-10 place-items-center rounded-full bg-atelier-moss text-xs font-bold tracking-wide text-white">{{ initials }}</span>
          <div class="hidden max-w-48 sm:block">
            <p class="truncate text-sm font-semibold">{{ auth.user?.first_name || 'Atelier owner' }}</p>
            <p class="truncate text-xs text-atelier-ink/50">{{ auth.user?.email }}</p>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
