<script setup lang="ts">
defineProps<{
  label: string
  value: string | number
  detail: string
  icon: 'products' | 'orders' | 'revenue' | 'trend'
  accent?: boolean
}>()
</script>

<template>
  <article class="relative overflow-hidden rounded-2xl border p-5 sm:p-6" :class="accent ? 'border-atelier-moss bg-atelier-moss text-white' : 'border-atelier-line bg-atelier-cream'">
    <span class="absolute -right-8 -top-8 h-28 w-28 rounded-full border" :class="accent ? 'border-white/10' : 'border-atelier-line/50'" />
    <div class="relative flex items-start justify-between gap-4">
      <div>
        <p class="text-[10px] font-bold uppercase tracking-[0.18em]" :class="accent ? 'text-white/60' : 'text-atelier-ink/45'">{{ label }}</p>
        <p class="mt-4 font-display text-3xl leading-none sm:text-[2.15rem]">{{ value }}</p>
        <p class="mt-3 text-xs" :class="accent ? 'text-white/65' : 'text-atelier-ink/50'">{{ detail }}</p>
      </div>
      <span class="grid h-10 w-10 shrink-0 place-items-center rounded-full" :class="accent ? 'bg-white/12 text-white' : 'bg-atelier-canvas text-atelier-moss'">
        <DashboardIcon :name="icon" class="h-[18px] w-[18px]" />
      </span>
    </div>
  </article>
</template>
