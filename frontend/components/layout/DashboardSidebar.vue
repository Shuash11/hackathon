<script setup lang="ts">
defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()

const route = useRoute()
const { signOut, auth } = useAuth()
const signingOut = ref(false)
const showLogoutConfirm = ref(false)

const isAdmin = computed(() => auth.user?.role === 'admin')

const navigation = computed(() => {
  const items: { label: string; to: string; icon: 'home' | 'products' | 'categories' | 'orders' | 'settings' | 'logout' | 'menu' | 'close' | 'bell' | 'revenue' | 'trend' | 'alert' | 'search' | 'arrow' | 'refresh' | 'trash' | 'user' | 'chevron-left' | 'chevron-right'; iconIdle: string; iconActive: string }[] = []

  if (isAdmin.value) {
    items.push({ label: 'Ask AI', to: '/dashboard/chat', icon: 'search', iconIdle: '', iconActive: '' })
  } else {
    items.push({ label: 'Dashboard', to: '/dashboard', icon: 'home', iconIdle: '', iconActive: '' })
  }
  if (isAdmin.value) {
    items.push(
      { label: 'Analytics', to: '/dashboard/analytics', icon: 'revenue', iconIdle: '', iconActive: '' },
      { label: 'Products', to: '/dashboard/catalog', icon: 'products', iconIdle: '', iconActive: '' },
    )
  }
  items.push(
    { label: isAdmin.value ? 'Customer Orders' : 'My Orders', to: '/dashboard/orders', icon: 'orders', iconIdle: '', iconActive: '' },
    { label: 'Settings', to: '/dashboard/settings', icon: 'settings', iconIdle: '', iconActive: '' },
  )
  return items
})

function isActive(to: string): boolean {
  if (to === '/dashboard') return route.path === to
  return route.path.startsWith(to)
}

function handleSignOut(): void {
  showLogoutConfirm.value = true
}
async function confirmSignOut(): Promise<void> {
  showLogoutConfirm.value = false
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
    class="fixed inset-0 z-40 bg-atelier-ink/40 backdrop-blur-sm transition-opacity duration-200 lg:hidden"
    aria-hidden="true"
    @click="emit('close')"
  />
  <aside
    id="dashboard-navigation"
    class="fixed inset-y-0 left-0 z-50 flex w-[288px] -translate-x-full flex-col border-r border-[#E9ECF2] bg-white transition-transform duration-200 ease-out lg:translate-x-0"
    :class="open ? 'translate-x-0' : ''"
    :aria-hidden="!open ? undefined : false"
  >
    <div class="flex h-[72px] items-center gap-3 border-b border-[#EEF0F5] px-6">
      <NuxtLink to="/dashboard" class="flex items-center gap-3" @click="emit('close')">
        <span class="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-[#5B79FF] to-[#3D55F0] text-white shadow-[0_6px_16px_rgba(74,98,246,.35)]">
          <span class="h-4 w-[9px] rounded-sm border-[1.5px] border-white" />
        </span>
        <span>
          <span class="block font-display text-[1.35rem] leading-none tracking-wide text-[#14161B]">Scentico</span>
          <span class="block text-[9px] font-bold uppercase tracking-[0.3em] text-slate-400">Atelier desk</span>
        </span>
      </NuxtLink>
      <button type="button" class="ml-auto rounded-lg p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-700 lg:hidden" aria-label="Close navigation" @click="emit('close')">
        <DashboardIcon name="close" class="h-4 w-4" />
      </button>
    </div>

    <nav aria-label="Dashboard navigation" class="flex-1 overflow-y-auto px-4 py-6">
      <p class="px-3 text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">Workspace</p>
      <ul class="mt-3 space-y-1">
        <li v-for="item in navigation" :key="item.to">
          <NuxtLink
            :to="item.to"
            class="group relative flex items-center gap-3.5 rounded-xl px-3 py-3 text-[15px] transition-colors"
            :class="isActive(item.to) ? 'bg-[#EDF0FE] font-semibold text-[#4056E8]' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'"
            :aria-current="isActive(item.to) ? 'page' : undefined"
            @click="emit('close')"
          >
            <span v-if="isActive(item.to)" class="absolute -left-4 top-1/2 h-7 w-1 -translate-y-1/2 rounded-r-full bg-[#4056E8]" aria-hidden="true" />
            <DashboardIcon :name="item.icon" class="h-[22px] w-[22px] shrink-0" />
            <span>{{ item.label }}</span>
          </NuxtLink>
        </li>
      </ul>

      <div class="mt-8 rounded-2xl border border-[#EAEDF4] bg-[#F8F9FD] p-4">
        <p class="text-xs font-semibold text-[#14161B]">Need help?</p>
        <p class="mt-1 text-xs leading-5 text-slate-500">Visit the Scentico guide for blending notes and daily operations.</p>
        <button type="button" class="mt-3 text-xs font-bold text-[#4056E8] hover:text-[#3344D6]">Open guide →</button>
      </div>
    </nav>

    <div class="border-t border-[#EEF0F5] p-4">
      <button
        type="button"
        class="flex w-full items-center gap-3.5 rounded-xl px-3 py-3 text-[15px] font-medium text-slate-500 transition hover:bg-rose-50 hover:text-rose-600 disabled:cursor-wait disabled:opacity-50"
        :disabled="signingOut"
        @click="handleSignOut"
      >
        <span class="grid h-8 w-8 place-items-center rounded-lg bg-slate-100 text-slate-500 transition group-hover:bg-rose-50 group-hover:text-rose-600">
          <DashboardIcon name="logout" class="h-5 w-5" />
        </span>
        <span>{{ signingOut ? 'Signing out...' : 'Log out' }}</span>
      </button>
      <p class="mt-3 px-1 text-center text-[10px] font-medium tracking-wide text-slate-400">Scentico operations v1.0</p>
    </div>
  </aside>
  <ScenticoLogoutConfirm v-model="showLogoutConfirm" @confirm="confirmSignOut" />
</template>
