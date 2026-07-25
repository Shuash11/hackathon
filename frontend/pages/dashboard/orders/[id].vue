<script setup lang="ts">
import type { OrderStatus } from '~/types/dashboard'
import { apiErrorMessage, formatCurrency, formatDate, orderReference, orderStatuses } from '~/utils/dashboard'

definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const route = useRoute()
const orderId = Number(route.params.id)
if (!Number.isInteger(orderId) || orderId < 1) {
  throw createError({ statusCode: 404, statusMessage: 'Order not found' })
}

useHead({ title: `${orderReference(orderId)} | Scentico` })

const { getOrder, updateOrderStatus, deleteOrder } = useDashboardApi()
const { data: order, status, error, refresh } = await useAsyncData(
  `dashboard-order-${orderId}`,
  () => getOrder(orderId),
)

const selectedStatus = ref<OrderStatus>('pending')
const saving = ref(false)
const deleting = ref(false)
const actionError = ref('')
const saved = ref(false)
const loading = computed(() => status.value === 'pending')
const errorMessage = computed(() => apiErrorMessage(error.value, 'This order could not be loaded.'))

watch(order, value => {
  if (value) selectedStatus.value = value.status
}, { immediate: true })

async function saveStatus(): Promise<void> {
  if (!order.value || selectedStatus.value === order.value.status) return
  saving.value = true
  saved.value = false
  actionError.value = ''
  try {
    order.value = await updateOrderStatus(orderId, selectedStatus.value)
    saved.value = true
    window.setTimeout(() => { saved.value = false }, 2500)
  } catch (caught) {
    actionError.value = apiErrorMessage(caught, 'The status update failed. Please try again.')
  } finally {
    saving.value = false
  }
}

async function removeOrder(): Promise<void> {
  if (!order.value || !window.confirm(`Delete ${orderReference(order.value.id)}? This cannot be undone.`)) return
  deleting.value = true
  actionError.value = ''
  try {
    await deleteOrder(orderId)
    await navigateTo('/dashboard/orders')
  } catch (caught) {
    actionError.value = apiErrorMessage(caught, 'The order could not be deleted.')
    deleting.value = false
  }
}
</script>

<template>
  <div>
    <NuxtLink to="/dashboard/orders" class="inline-flex items-center gap-1.5 text-xs font-bold text-atelier-moss hover:text-atelier-ink">
      <DashboardIcon name="chevron-left" class="h-4 w-4" /> Back to orders
    </NuxtLink>

    <DashboardError v-if="error && !loading" class="mt-6" :message="errorMessage" @retry="refresh" />
    <div v-else-if="loading || !order" class="mt-6 grid animate-pulse gap-6 lg:grid-cols-[1fr_21rem]">
      <div class="h-[34rem] rounded-2xl bg-atelier-line/60" />
      <div class="h-80 rounded-2xl bg-atelier-line/60" />
    </div>

    <template v-else>
      <header class="mt-5 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div class="flex flex-wrap items-center gap-3">
            <p class="font-mono text-xs font-bold tracking-wide text-atelier-moss">{{ orderReference(order.id) }}</p>
            <OrderStatusBadge :status="order.status" />
          </div>
          <h1 class="mt-3 font-display text-4xl sm:text-5xl">Order details</h1>
          <p class="mt-3 text-sm text-atelier-ink/50">Placed {{ formatDate(order.created_at, true) }}</p>
        </div>
        <button type="button" class="inline-flex w-fit items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 disabled:cursor-wait disabled:opacity-50" :disabled="deleting" @click="removeOrder">
          <DashboardIcon name="trash" class="h-4 w-4" /> {{ deleting ? 'Deleting...' : 'Delete order' }}
        </button>
      </header>

      <p v-if="actionError" class="mt-5 rounded-xl border border-atelier-clay/25 bg-atelier-clay/10 px-4 py-3 text-sm font-medium text-atelier-clay" role="alert">{{ actionError }}</p>

      <div class="mt-7 grid gap-6 lg:grid-cols-[minmax(0,1fr)_21rem]">
        <div class="space-y-6">
          <section aria-labelledby="items-heading" class="overflow-hidden rounded-2xl border border-atelier-line bg-atelier-cream">
            <div class="flex items-end justify-between border-b border-atelier-line px-5 py-5 sm:px-6">
              <div>
                <p class="text-[10px] font-bold uppercase tracking-[0.18em] text-atelier-moss">Contents</p>
                <h2 id="items-heading" class="mt-2 font-display text-2xl">Order items</h2>
              </div>
              <span class="text-xs text-atelier-ink/45">{{ order.items_count }} units</span>
            </div>
            <ul class="divide-y divide-atelier-line/70">
              <li v-for="item in order.items" :key="item.id" class="flex gap-4 p-5 sm:items-center sm:px-6">
                <div class="relative grid h-20 w-16 shrink-0 place-items-center overflow-hidden rounded-xl bg-atelier-canvas">
                  <img v-if="item.product.image" :src="item.product.image" :alt="item.product.name" class="h-full w-full object-cover">
                  <span v-else class="relative h-10 w-5 rounded-b-md rounded-t-sm bg-atelier-moss/75"><span class="absolute -top-2 left-1 h-2 w-3 bg-atelier-ink/70" /></span>
                </div>
                <div class="min-w-0 flex-1">
                  <p class="font-semibold">{{ item.product.name }}</p>
                  <p class="mt-1 text-xs capitalize text-atelier-ink/45">{{ item.product.category }} collection</p>
                  <p class="mt-2 text-xs text-atelier-ink/55">{{ formatCurrency(item.price) }} x {{ item.quantity }}</p>
                </div>
                <p class="shrink-0 font-display text-lg">{{ formatCurrency(item.line_total) }}</p>
              </li>
            </ul>
            <div class="flex items-center justify-between border-t border-atelier-line bg-atelier-canvas/50 px-5 py-5 sm:px-6">
              <span class="text-sm font-semibold text-atelier-ink/55">Order total</span>
              <span class="font-display text-3xl">{{ formatCurrency(order.total) }}</span>
            </div>
          </section>

          <section aria-labelledby="customer-heading" class="rounded-2xl border border-atelier-line bg-atelier-cream p-5 sm:p-6">
            <p class="text-[10px] font-bold uppercase tracking-[0.18em] text-atelier-moss">Customer</p>
            <h2 id="customer-heading" class="mt-2 font-display text-2xl">Contact information</h2>
            <div class="mt-5 flex items-center gap-4 rounded-xl bg-atelier-canvas p-4">
              <span class="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-atelier-moss text-white"><DashboardIcon name="user" class="h-5 w-5" /></span>
              <div class="min-w-0">
                <p class="truncate text-sm font-semibold">{{ order.customer.name }}</p>
                <a v-if="order.customer.email" :href="`mailto:${order.customer.email}`" class="mt-1 block truncate text-sm text-atelier-moss hover:underline">{{ order.customer.email }}</a>
                <p v-else class="mt-1 text-sm text-atelier-ink/45">Guest checkout</p>
              </div>
            </div>
          </section>
        </div>

        <aside class="h-fit rounded-2xl border border-atelier-line bg-atelier-cream p-5 sm:p-6 lg:sticky lg:top-28">
          <p class="text-[10px] font-bold uppercase tracking-[0.18em] text-atelier-moss">Fulfillment</p>
          <h2 class="mt-2 font-display text-2xl">Update status</h2>
          <p class="mt-2 text-xs leading-5 text-atelier-ink/50">Keep the customer order state aligned with your fulfillment workflow.</p>
          <label class="mt-6 block">
            <span class="mb-2 block text-xs font-semibold">Order status</span>
            <select v-model="selectedStatus" class="h-11 w-full rounded-xl border border-atelier-line bg-white px-3 text-sm focus:border-atelier-moss focus:ring-atelier-moss">
              <option v-for="option in orderStatuses" :key="option.value" :value="option.value">{{ option.label }}</option>
            </select>
          </label>
          <button type="button" class="mt-3 flex h-11 w-full items-center justify-center rounded-xl bg-atelier-ink px-4 text-sm font-semibold text-white transition hover:bg-atelier-moss disabled:cursor-not-allowed disabled:opacity-45" :disabled="saving || selectedStatus === order.status" @click="saveStatus">
            {{ saving ? 'Saving...' : 'Save status' }}
          </button>
          <p v-if="saved" class="mt-3 text-center text-xs font-semibold text-emerald-700" role="status">Status updated successfully.</p>
          <dl class="mt-6 divide-y divide-atelier-line border-t border-atelier-line text-xs">
            <div class="flex justify-between gap-3 py-3"><dt class="text-atelier-ink/45">Created</dt><dd class="text-right font-medium">{{ formatDate(order.created_at) }}</dd></div>
            <div class="flex justify-between gap-3 py-3"><dt class="text-atelier-ink/45">Last updated</dt><dd class="text-right font-medium">{{ formatDate(order.updated_at, true) }}</dd></div>
            <div class="flex justify-between gap-3 py-3"><dt class="text-atelier-ink/45">Line items</dt><dd class="font-medium">{{ order.items.length }}</dd></div>
          </dl>
        </aside>
      </div>
    </template>
  </div>
</template>
