<script setup lang="ts">
const images = [
  '1.jpg', '2.jpg', '3.png', '4.png', '5.png',
  '7.jpg', '8.png', '9.png', '10.png', '11.jpg',
  '12.jpg', '13.png', '14.png',
]
</script>

<template>
  <section class="bg-cream py-12 md:py-20"><div class="mx-auto max-w-[1180px] px-6 md:px-8"><div class="reveal mb-10 max-w-[560px]"><span class="mb-3.5 block text-[.72rem] font-bold uppercase tracking-[.22em] text-peach-deep">The Look</span><h2 class="mt-1 font-display text-[2rem] font-medium leading-[1.08] text-espresso md:text-[2.8rem]">Fragrance you can see.</h2><p class="mt-4 text-[1.02rem] text-espresso/70">From bottle to counter — a glimpse of what makes Scentico unmistakable.</p></div><div class="no-scrollbar -mx-6 flex gap-4 overflow-x-auto px-6 pb-4 md:mx-0 md:grid md:grid-cols-3 md:gap-5 md:overflow-visible md:px-0 md:pb-0"><div v-for="(src, i) in images" :key="src" class="reveal aspect-[4/5] w-[200px] shrink-0 overflow-hidden rounded-2xl border border-espresso/[.08] bg-cream-deep shadow-soft md:w-auto" :style="{ transitionDelay: `${(i % 9) * 70}ms` }"><img :src="'/scentico/promotional/' + src" :alt="'Scentico promotional ' + (i + 1)" class="h-full w-full object-cover transition-transform duration-500 hover:scale-105" loading="lazy" /></div></div></div></section>
</template>
