<script setup lang="ts">
import { scenticoProducts, type ScenticoProduct } from '~/data/scentico'

const products = ref<ScenticoProduct[]>(scenticoProducts.map(product => ({ ...product })))

onMounted(() => {
  const saved = localStorage.getItem('scentico-dashboard-state')
  if (!saved) return
  try {
    const state = JSON.parse(saved) as { products?: ScenticoProduct[] }
    if (Array.isArray(state.products)) products.value = state.products
  } catch {
    localStorage.removeItem('scentico-dashboard-state')
  }
})
</script>

<template>
  <section id="products" class="py-16 md:py-24"><div class="mx-auto max-w-[1180px] px-6 md:px-8"><div class="reveal mb-12 max-w-[560px] md:mb-14"><span class="mb-3.5 block text-[.72rem] font-bold uppercase tracking-[.22em] text-peach-deep">The Collection</span><h2 class="mt-1 font-display text-[2rem] font-medium leading-[1.08] text-espresso md:text-[2.8rem]">Six scents, six moods.</h2><p class="mt-4 text-[1.02rem] text-espresso/70">Hover a bottle to see its notes and the effect it's made to create.</p></div><div class="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3"><ScenticoProductCard v-for="product in products" :key="product.id" :product="product" /></div></div></section>
</template>
