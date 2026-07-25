<script setup lang="ts">
import type { BestSeller } from '~/types/dashboard'

defineProps<{ products: BestSeller[] }>()
</script>

<template>
  <article class="rounded-2xl border border-atelier-line bg-atelier-cream p-5 sm:p-6">
    <div class="flex items-end justify-between gap-4">
      <div>
        <p class="text-[10px] font-bold uppercase tracking-[0.18em] text-atelier-moss">Top performers</p>
        <h2 class="mt-2 font-display text-2xl">Best sellers</h2>
      </div>
      <span v-if="products.length" class="text-xs text-atelier-ink/45">By units sold</span>
    </div>
    <ol v-if="products.length" class="mt-5 divide-y divide-atelier-line/70">
      <li v-for="(product, index) in products" :key="product.id" class="flex items-center gap-4 py-3.5 first:pt-0 last:pb-0">
        <span class="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-atelier-canvas font-display text-sm text-atelier-moss">{{ String(index + 1).padStart(2, '0') }}</span>
        <div class="min-w-0 flex-1">
          <p class="truncate text-sm font-semibold">{{ product.name }}</p>
          <p class="mt-0.5 text-xs text-atelier-ink/45">{{ product.category }} collection</p>
        </div>
        <div class="text-right">
          <p class="font-display text-lg">{{ product.quantity_sold }}</p>
          <p class="text-[10px] uppercase tracking-wider text-atelier-ink/40">sold</p>
        </div>
      </li>
    </ol>
    <DashboardEmpty v-else title="No sales ranked yet" description="Best-selling fragrances will be ranked here after the first order." icon="products" />
  </article>
</template>
