<script setup lang="ts">
defineProps<{
  name: 'home' | 'products' | 'categories' | 'orders' | 'settings' | 'logout' | 'menu' | 'close' | 'bell' | 'revenue' | 'trend' | 'alert' | 'search' | 'arrow' | 'refresh' | 'trash' | 'user' | 'chevron-left' | 'chevron-right'
}>()
</script>

<template>
  <svg aria-hidden="true" fill="none" focusable="false" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <template v-if="name === 'home'">
      <path d="m3 11 9-8 9 8" /><path d="M5 10v10h14V10" /><path d="M9 20v-6h6v6" />
    </template>
    <template v-else-if="name === 'products'">
      <path d="M9 3h6" /><path d="M10 3v4l-3 3v10h10V10l-3-3V3" /><path d="M7 13h10" />
    </template>
    <template v-else-if="name === 'categories'">
      <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" />
    </template>
    <template v-else-if="name === 'orders'">
      <path d="M6 3h12v18H6z" /><path d="M9 8h6M9 12h6M9 16h4" />
    </template>
    <template v-else-if="name === 'settings'">
      <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1A1.7 1.7 0 0 0 9 4.6 1.7 1.7 0 0 0 10 3V2.8h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z" />
    </template>
    <template v-else-if="name === 'logout'">
      <path d="M10 5H4v14h6M14 8l4 4-4 4M8 12h10" />
    </template>
    <template v-else-if="name === 'menu'">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </template>
    <template v-else-if="name === 'close'">
      <path d="m6 6 12 12M18 6 6 18" />
    </template>
    <template v-else-if="name === 'bell'">
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" />
    </template>
    <template v-else-if="name === 'revenue'">
      <circle cx="12" cy="12" r="9" /><path d="M15 8.5c-.6-.6-1.6-1-3-1-1.7 0-3 .8-3 2s1.1 1.8 3 2.3 3 1 3 2.2-1.3 2-3 2c-1.4 0-2.5-.5-3-1.2M12 5.5v13" />
    </template>
    <template v-else-if="name === 'trend'">
      <path d="m4 16 5-5 4 3 7-8" /><path d="M15 6h5v5" />
    </template>
    <template v-else-if="name === 'alert'">
      <path d="M12 3 2.5 20h19L12 3Z" /><path d="M12 9v5M12 17.5h.01" />
    </template>
    <template v-else-if="name === 'search'">
      <circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" />
    </template>
    <template v-else-if="name === 'arrow'">
      <path d="M5 12h14M14 7l5 5-5 5" />
    </template>
    <template v-else-if="name === 'refresh'">
      <path d="M20 6v5h-5M4 18v-5h5" /><path d="M18 9a7 7 0 0 0-12-2L4 11M6 15a7 7 0 0 0 12 2l2-4" />
    </template>
    <template v-else-if="name === 'trash'">
      <path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14M10 11v6M14 11v6" />
    </template>
    <template v-else-if="name === 'user'">
      <circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" />
    </template>
    <template v-else-if="name === 'chevron-left'">
      <path d="m15 18-6-6 6-6" />
    </template>
    <template v-else-if="name === 'chevron-right'">
      <path d="m9 18 6-6-6-6" />
    </template>
  </svg>
</template>
