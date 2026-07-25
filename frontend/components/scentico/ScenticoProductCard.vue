<script setup lang="ts">
import type { ScenticoProduct } from '~/data/scentico'

const props = defineProps<{ product: ScenticoProduct }>()
const expanded = ref(false)
const detailsId = computed(() => `product-details-${props.product.id}`)

function toggleDetails(): void {
  expanded.value = !expanded.value
}
</script>

<template>
  <article class="reveal group relative aspect-[3/4.1] cursor-pointer overflow-hidden rounded-[22px] shadow-card transition-all duration-500 hover:-translate-y-2 hover:shadow-card-hover" :class="{ 'is-expanded': expanded }" tabindex="0" role="button" :aria-label="`${expanded ? 'Hide' : 'Show'} details for ${product.name}`" :aria-expanded="expanded" :aria-controls="detailsId" @click="toggleDetails" @keydown.enter.prevent="toggleDetails" @keydown.space.prevent="toggleDetails">
    <div class="absolute inset-0 flex items-center justify-center p-5" :style="{ background: product.gradient }"><ScenticoBottleArt :bottle="product.bottle" :cap="product.cap" /></div>
    <span v-for="delay in [0, 0.5, 1]" :key="delay" class="absolute bottom-16 left-1/2 h-[60px] w-[60px] -translate-x-1/2 scale-[.6] rounded-full border-[1.5px] border-cream-soft/55 opacity-0 group-hover:animate-[diffuse_2.6s_ease-in-out_infinite] group-[.is-expanded]:animate-[diffuse_2.6s_ease-in-out_infinite]" :style="{ animationDelay: `${delay}s` }"></span>
    <span class="absolute left-4 top-4 rounded-full bg-espresso/35 px-3 py-1.5 text-[.66rem] font-bold uppercase tracking-[.14em] text-cream-soft backdrop-blur-sm">{{ product.mood }}</span>
    <div class="absolute bottom-0 left-0 right-0 translate-y-[calc(100%-78px)] bg-[linear-gradient(to_top,rgba(20,11,7,.94)_10%,rgba(20,11,7,.75)_55%,transparent_100%)] px-[22px] pb-[22px] pt-5 text-cream-soft transition-transform duration-500 ease-out group-hover:translate-y-0 group-[.is-expanded]:translate-y-0"><div class="font-display text-[1.3rem]">{{ product.name }}</div><div class="mt-1 text-[.82rem] font-bold text-peach-light">{{ product.price }}</div><div :id="detailsId" class="mt-3.5 -translate-y-1 opacity-0 transition-all delay-100 duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-[.is-expanded]:translate-y-0 group-[.is-expanded]:opacity-100"><p class="text-[.78rem] leading-relaxed text-cream-soft/85"><b class="font-bold text-peach-light">Top:</b> {{ product.top }} &nbsp;·&nbsp; <b class="font-bold text-peach-light">Heart:</b> {{ product.heart }} &nbsp;·&nbsp; <b class="font-bold text-peach-light">Base:</b> {{ product.base }}</p><p class="mt-2.5 border-t border-cream-soft/20 pt-2.5 text-[.86rem] italic text-cream-soft">{{ product.effect }}</p></div></div>
  </article>
</template>
