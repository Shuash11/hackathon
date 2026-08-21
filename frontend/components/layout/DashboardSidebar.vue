<script setup lang="ts">
defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()

const route = useRoute()
const { signOut, auth } = useAuth()
const signingOut = ref(false)

const isAdmin = computed(() => auth.user?.role === 'admin')

const navigation = computed(() => {
  const items: { label: string; to: string; icon: 'home' | 'products' | 'categories' | 'orders' | 'settings' | 'logout' | 'menu' | 'close' | 'bell' | 'revenue' | 'trend' | 'alert' | 'search' | 'arrow' | 'refresh' | 'trash' | 'user' | 'chevron-left' | 'chevron-right' }[] = [
    { label: 'Dashboard', to: '/dashboard', icon: 'home' },
    { label: 'Products', to: '/dashboard/catalog', icon: 'products' },
    { label: 'Customer Orders', to: '/dashboard/orders', icon: 'orders' },
  ]
  if (isAdmin.value) {
    items.push({ label: 'Admin', to: '/dashboard/admin', icon: 'settings' })
  }
  return items
})

function isActive(to: string): boolean {
  if (to === '/dashboard') return route.path === to
  return route.path.startsWith(to)
}

async function handleSignOut(): Promise<void> {
  signingOut.value = true
  try {
    await signOut()
    await navigateTo('/')
  } finally {
    signingOut.value = false
  }
}
</script>

<template>
  <div
    v-if="open"
    class="fixed inset-0 z-40 bg-atelier-ink/40 backdrop-blur-sm lg:hidden"
    aria-hidden="true"
    @click="emit('close')"
  />
  <aside
    id="dashboard-navigation"
    class="fixed inset-y-0 left-0 z-50 flex w-64 -translate-x-full flex-col border-r border-white/10 bg-atelier-ink text-white transition-transform duration-300 lg:translate-x-0"
    :class="open ? 'translate-x-0' : ''"
    :aria-hidden="!open ? undefined : false"
  >
    <div class="flex h-20 items-center justify-between border-b border-white/10 px-6">
      <NuxtLink to="/dashboard" class="group flex items-center gap-3" @click="emit('close')">
        <span class="grid h-9 w-9 place-items-center rounded-full border border-white/30 bg-white/5">
          <span class="h-4 w-2 rounded-sm border border-white/80" />
        </span>
        <span>
          <span class="block font-display text-xl tracking-wide">Scentico</span>
          <span class="block text-[9px] font-semibold uppercase tracking-[0.28em] text-white/45">Atelier desk</span>
        </span>
      </NuxtLink>
      <button type="button" class="rounded-lg p-2 text-white/60 hover:bg-white/10 hover:text-white lg:hidden" aria-label="Close navigation" @click="emit('close')">
        <DashboardIcon name="close" class="h-5 w-5" />
      </button>
    </div>

    <nav aria-label="Dashboard navigation" class="flex-1 overflow-y-auto px-4 py-7">
      <p class="px-3 text-[10px] font-bold uppercase tracking-[0.22em] text-white/35">Workspace</p>
      <ul class="mt-3 space-y-1">
        <li v-for="item in navigation" :key="item.to">
          <NuxtLink
            :to="item.to"
            class="group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition"
            :class="isActive(item.to) ? 'bg-white text-atelier-ink shadow-lg shadow-black/10' : 'text-white/65 hover:bg-white/10 hover:text-white'"
            :aria-current="isActive(item.to) ? 'page' : undefined"
            @click="emit('close')"
          >
            <DashboardIcon :name="item.icon" class="h-[18px] w-[18px] shrink-0" />
            <span>{{ item.label }}</span>
          </NuxtLink>
        </li>
      </ul>
    </nav>

    <div class="border-t border-white/10 p-4">
      <button
        type="button"
        class="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-white/65 transition hover:bg-white/10 hover:text-white disabled:cursor-wait disabled:opacity-50"
        :disabled="signingOut"
        @click="handleSignOut"
      >
        <DashboardIcon name="logout" class="h-[18px] w-[18px]" />
        <span>{{ signingOut ? 'Signing out...' : 'Log out' }}</span>
      </button>
      <p class="mt-2 px-3 text-[10px] leading-4 text-white/25">Scentico operations v1.0</p>
    </div>
  </aside>
</template>
