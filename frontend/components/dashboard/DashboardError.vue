<script setup lang="ts">
defineProps<{ message: string }>()
defineEmits<{ retry: [] }>()
</script>

<template>
  <div class="rounded-2xl border border-atelier-clay/30 bg-atelier-clay/10 p-6 sm:flex sm:items-center sm:justify-between">
    <div class="flex gap-4">
      <span class="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-atelier-clay/15 text-atelier-clay">
        <DashboardIcon name="alert" class="h-5 w-5" />
      </span>
      <div>
        <h2 class="font-semibold">We could not load this view</h2>
        <p class="mt-1 text-sm text-atelier-ink/60">{{ message }}</p>
      </div>
    </div>
    <button type="button" class="mt-4 inline-flex items-center gap-2 rounded-xl border border-atelier-clay/30 bg-atelier-cream px-4 py-2 text-sm font-semibold text-atelier-clay transition hover:bg-white sm:mt-0" @click="$emit('retry')">
      <DashboardIcon name="refresh" class="h-4 w-4" /> Retry
    </button>
  </div>
</template>
