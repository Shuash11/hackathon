<script setup lang="ts">
import type { CategorySummary } from '~/types/dashboard'

const props = defineProps<{ category: CategorySummary }>()

const defaultPalette = { shell: 'bg-slate-100', halo: 'bg-slate-300/50', bottle: 'bg-slate-700' }
const palettes: Record<string, { shell: string, halo: string, bottle: string }> = {
  male: defaultPalette,
  female: { shell: 'bg-rose-50', halo: 'bg-rose-200/60', bottle: 'bg-rose-400' },
  summer: { shell: 'bg-amber-50', halo: 'bg-amber-200/60', bottle: 'bg-amber-500' },
  winter: { shell: 'bg-sky-50', halo: 'bg-sky-200/60', bottle: 'bg-sky-700' },
}

const palette = computed(() => palettes[props.category.slug] ?? defaultPalette)
</script>

<template>
  <NuxtLink
    :to="{ path: '/products', query: { category: category.slug } }"
    class="group relative flex min-h-48 overflow-hidden rounded-2xl border border-atelier-line p-5 transition duration-300 hover:-translate-y-1 hover:border-atelier-sage hover:shadow-xl hover:shadow-atelier-ink/5"
    :class="palette.shell"
  >
    <div class="relative z-10 flex flex-col justify-between">
      <div>
        <p class="text-[10px] font-bold uppercase tracking-[0.18em] text-atelier-ink/45">Collection</p>
        <h3 class="mt-2 font-display text-2xl">{{ category.name }}</h3>
      </div>
      <div>
        <p class="text-sm font-semibold">{{ category.product_count }} {{ category.product_count === 1 ? 'perfume' : 'perfumes' }}</p>
        <span class="mt-2 inline-flex items-center gap-2 text-xs font-semibold text-atelier-ink/50 transition group-hover:text-atelier-ink">
          View collection <DashboardIcon name="arrow" class="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </div>
    <span class="absolute -right-7 top-5 h-36 w-36 rounded-full blur-[1px]" :class="palette.halo" />
    <span class="absolute right-8 top-[4.15rem] h-[5.5rem] w-11 rounded-b-lg rounded-t-sm opacity-90 shadow-lg transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-105" :class="palette.bottle">
      <span class="absolute -top-5 left-2.5 h-5 w-6 rounded-t-sm bg-atelier-ink/75" />
      <span class="absolute left-2 top-8 h-7 w-7 border border-white/50 bg-white/20" />
    </span>
  </NuxtLink>
</template>
