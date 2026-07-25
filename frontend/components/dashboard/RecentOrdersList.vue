<script setup lang="ts">
import type { OrderSummary } from '~/types/dashboard'
import { formatCurrency, formatDate, orderReference } from '~/utils/dashboard'

defineProps<{ orders: OrderSummary[] }>()
</script>

<template>
  <article class="overflow-hidden rounded-2xl border border-atelier-line bg-atelier-cream">
    <div class="flex items-center justify-between border-b border-atelier-line px-5 py-5 sm:px-6">
      <div>
        <p class="text-[10px] font-bold uppercase tracking-[0.18em] text-atelier-moss">Latest activity</p>
        <h2 class="mt-2 font-display text-2xl">Recent orders</h2>
      </div>
      <NuxtLink to="/dashboard/orders" class="inline-flex items-center gap-2 text-xs font-bold text-atelier-moss hover:text-atelier-ink">
        View all <DashboardIcon name="arrow" class="h-4 w-4" />
      </NuxtLink>
    </div>
    <div v-if="orders.length" class="divide-y divide-atelier-line/70">
      <NuxtLink v-for="order in orders" :key="order.id" :to="`/dashboard/orders/${order.id}`" class="grid gap-3 px-5 py-4 transition hover:bg-atelier-canvas/60 sm:grid-cols-[7rem_minmax(0,1fr)_auto_auto] sm:items-center sm:px-6">
        <span class="font-mono text-xs font-semibold text-atelier-moss">{{ orderReference(order.id) }}</span>
        <span class="min-w-0">
          <span class="block truncate text-sm font-semibold">{{ order.customer.name }}</span>
          <span class="mt-0.5 block text-xs text-atelier-ink/45">{{ formatDate(order.created_at) }} &middot; {{ order.items_count }} items</span>
        </span>
        <OrderStatusBadge :status="order.status" class="w-fit" />
        <span class="text-sm font-bold sm:min-w-24 sm:text-right">{{ formatCurrency(order.total) }}</span>
      </NuxtLink>
    </div>
    <DashboardEmpty v-else title="No orders yet" description="New customer orders will appear here as soon as they are placed." />
  </article>
</template>
