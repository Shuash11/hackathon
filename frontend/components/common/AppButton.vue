<script setup lang="ts">
withDefaults(defineProps<{ type?: 'button' | 'submit'; loading?: boolean }>(), { type: 'button', loading: false })
</script>

<template>
  <button :type="type" :disabled="loading" class="inline-flex min-h-11 items-center justify-center rounded-lg bg-brand-600 px-4 py-2 font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60">
    <slot />
  </button>
</template>
