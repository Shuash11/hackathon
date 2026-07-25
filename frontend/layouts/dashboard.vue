<script setup lang="ts">
const route = useRoute()
const drawerOpen = ref(false)

watch(() => route.fullPath, () => {
  drawerOpen.value = false
})

watch(drawerOpen, open => {
  if (import.meta.client) document.body.style.overflow = open ? 'hidden' : ''
})

onBeforeUnmount(() => {
  if (import.meta.client) document.body.style.overflow = ''
})
</script>

<template>
  <div class="min-h-screen bg-atelier-canvas text-atelier-ink">
    <DashboardSidebar :open="drawerOpen" @close="drawerOpen = false" />
    <div class="min-h-screen lg:pl-64">
      <DashboardTopbar @open-menu="drawerOpen = true" />
      <main class="mx-auto w-full max-w-[1560px] px-4 py-6 sm:px-6 sm:py-8 xl:px-10">
        <slot />
      </main>
    </div>
  </div>
</template>
