<script setup lang="ts">
defineProps<{ bottle: string; cap: string }>()
</script>

<template>
  <svg class="w-[46%] drop-shadow-[0_14px_18px_rgba(42,24,16,.28)] transition-transform duration-500 group-hover:scale-[1.06] group-hover:-translate-y-1 group-[.is-expanded]:scale-[1.06] group-[.is-expanded]:-translate-y-1" viewBox="0 0 100 140" aria-hidden="true">
    <rect x="30" y="30" width="40" height="80" rx="10" :fill="bottle" />
    <rect x="38" y="14" width="24" height="18" rx="4" :fill="cap" />
  </svg>
</template>
