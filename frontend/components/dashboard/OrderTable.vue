<script setup lang="ts">
import type { OrderSummary } from '~/types/dashboard'
import { formatCurrency, formatDate, orderReference } from '~/utils/dashboard'

defineProps<{ orders: OrderSummary[] }>()
</script>

<template>
  <div class="overflow-hidden rounded-2xl border border-atelier-line bg-atelier-cream">
    <div class="hidden overflow-x-auto md:block">
      <table class="w-full min-w-[760px] border-collapse text-left">
        <thead class="border-b border-atelier-line bg-atelier-canvas/60 text-[10px] font-bold uppercase tracking-[0.15em] text-atelier-ink/45">
          <tr>
            <th class="px-5 py-4 sm:px-6">Order</th>
            <th class="px-5 py-4">Customer</th>
            <th class="px-5 py-4">Items</th>
            <th class="px-5 py-4">Total</th>
            <th class="px-5 py-4">Status</th>
            <th class="px-5 py-4">Date</th>
            <th class="px-5 py-4"><span class="sr-only">Open</span></th>
          </tr>
        </thead>
        <tbody class="divide-y divide-atelier-line/70">
          <tr v-for="order in orders" :key="order.id" class="group transition hover:bg-atelier-canvas/60">
            <td class="px-5 py-4 font-mono text-xs font-semibold text-atelier-moss sm:px-6">{{ orderReference(order.id) }}</td>
            <td class="px-5 py-4">
              <p class="max-w-52 truncate text-sm font-semibold">{{ order.customer.name }}</p>
              <p class="mt-0.5 max-w-52 truncate text-xs text-atelier-ink/40">{{ order.customer.email || 'Guest checkout' }}</p>
            </td>
            <td class="px-5 py-4 text-sm text-atelier-ink/60">{{ order.items_count }}</td>
            <td class="px-5 py-4 text-sm font-bold">{{ formatCurrency(order.total) }}</td>
            <td class="px-5 py-4"><OrderStatusBadge :status="order.status" /></td>
            <td class="whitespace-nowrap px-5 py-4 text-sm text-atelier-ink/55">{{ formatDate(order.created_at) }}</td>
            <td class="px-5 py-4 text-right">
              <NuxtLink :to="`/dashboard/orders/${order.id}`" class="inline-flex rounded-full p-2 text-atelier-ink/35 transition hover:bg-white hover:text-atelier-moss" :aria-label="`Open ${orderReference(order.id)}`">
                <DashboardIcon name="chevron-right" class="h-4 w-4" />
              </NuxtLink>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="divide-y divide-atelier-line/70 md:hidden">
      <NuxtLink v-for="order in orders" :key="order.id" :to="`/dashboard/orders/${order.id}`" class="block p-4 transition hover:bg-atelier-canvas/60">
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <p class="font-mono text-xs font-semibold text-atelier-moss">{{ orderReference(order.id) }}</p>
            <p class="mt-2 truncate text-sm font-semibold">{{ order.customer.name }}</p>
            <p class="mt-0.5 text-xs text-atelier-ink/45">{{ formatDate(order.created_at) }} &middot; {{ order.items_count }} items</p>
          </div>
          <OrderStatusBadge :status="order.status" />
        </div>
        <div class="mt-4 flex items-center justify-between border-t border-atelier-line/60 pt-3">
          <span class="text-xs text-atelier-ink/45">Order total</span>
          <span class="font-display text-lg">{{ formatCurrency(order.total) }}</span>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>
