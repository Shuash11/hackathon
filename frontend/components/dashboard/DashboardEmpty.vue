<script setup lang="ts">
withDefaults(defineProps<{
  title: string
  description: string
  icon?: 'orders' | 'products' | 'categories' | 'search'
}>(), { icon: 'orders' })
</script>

<template>
  <div class="grid min-h-56 place-items-center px-5 py-10 text-center">
    <div>
      <span class="mx-auto grid h-12 w-12 place-items-center rounded-full bg-atelier-canvas text-atelier-moss">
        <DashboardIcon :name="icon" class="h-5 w-5" />
      </span>
      <h3 class="mt-4 font-display text-xl">{{ title }}</h3>
      <p class="mx-auto mt-2 max-w-sm text-sm leading-6 text-atelier-ink/55">{{ description }}</p>
      <slot />
    </div>
  </div>
</template>
