<script setup lang="ts">
import type { CategoryOrderCount } from '~/types/dashboard'

const props = defineProps<{ data: CategoryOrderCount[] }>()
const maxCount = computed(() => Math.max(...props.data.map(item => item.order_count), 1))

const colors: Record<string, string> = {
  male: 'bg-slate-700',
  female: 'bg-rose-400',
  summer: 'bg-amber-500',
  winter: 'bg-sky-700',
}
</script>

<template>
  <article class="rounded-2xl border border-atelier-line bg-atelier-cream p-5 sm:p-6">
    <div class="flex items-start justify-between gap-4">
      <div>
        <p class="text-[10px] font-bold uppercase tracking-[0.18em] text-atelier-moss">Distribution</p>
        <h2 class="mt-2 font-display text-2xl">Orders by collection</h2>
      </div>
      <span class="rounded-full bg-atelier-canvas px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-atelier-ink/50">All time</span>
    </div>
    <div v-if="data.some(item => item.order_count > 0)" class="mt-8 space-y-5">
      <div v-for="item in data" :key="item.slug" class="grid grid-cols-[4.5rem_1fr_2rem] items-center gap-3">
        <span class="text-sm font-medium">{{ item.name }}</span>
        <span class="h-2.5 overflow-hidden rounded-full bg-atelier-canvas">
          <span class="block h-full rounded-full transition-all duration-700" :class="colors[item.slug] || 'bg-atelier-sage'" :style="{ width: `${item.order_count ? Math.max((item.order_count / maxCount) * 100, 5) : 0}%` }" />
        </span>
        <span class="text-right font-display text-lg">{{ item.order_count }}</span>
      </div>
    </div>
    <DashboardEmpty v-else title="No collection data yet" description="Order distribution will appear once customers begin placing orders." icon="categories" />
  </article>
</template>
