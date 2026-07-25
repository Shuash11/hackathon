<script setup lang="ts">
import type { OrderStatus } from '~/types/dashboard'

defineProps<{ status: OrderStatus }>()

const labels: Record<OrderStatus, string> = {
  pending: 'Pending',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}

const classes: Record<OrderStatus, string> = {
  pending: 'bg-amber-50 text-amber-800 ring-amber-600/20',
  processing: 'bg-sky-50 text-sky-800 ring-sky-600/20',
  shipped: 'bg-violet-50 text-violet-800 ring-violet-600/20',
  delivered: 'bg-emerald-50 text-emerald-800 ring-emerald-600/20',
  cancelled: 'bg-rose-50 text-rose-800 ring-rose-600/20',
}
</script>

<template>
  <span class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset" :class="classes[status]">
    <span class="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
    {{ labels[status] }}
  </span>
</template>
