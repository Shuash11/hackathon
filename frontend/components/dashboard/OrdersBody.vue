<script setup lang="ts">
import { addItemToCart, orderTotal, statusMeta, useShopOrders, type ShopOrder, type ShopOrderStatus } from '~/composables/useShopData'

const props = defineProps<{ isAdmin: boolean }>()

const route = useRoute()
const orders = useShopOrders()

const search = ref('')
const statusFilter = ref<ShopOrderStatus | ''>('')
const statuses: ShopOrderStatus[] = ['placed', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled']

const justReordered = ref<number | null>(null)
function reorder(order: ShopOrder): void {
  order.items.forEach(item => addItemToCart({ key: item.name, name: item.name, category: item.category, price: item.price, image: item.image }, item.qty))
  justReordered.value = order.id
  setTimeout(() => { justReordered.value = null }, 1400)
}

function itemsLabel(order: ShopOrder): string {
  return order.items.map(i => `${i.name} ×${i.qty}`).join(', ')
}

const placedRef = computed(() => {
  const value = route.query.placed
  return typeof value === 'string' ? value : Array.isArray(value) ? String(value[0] ?? '') : ''
})

const filtered = computed(() => {
  let list = props.isAdmin ? orders.value : orders.value.filter(o => o.self)
  if (statusFilter.value) list = list.filter(o => o.status === statusFilter.value)
  const q = search.value.trim().toLowerCase()
  if (q) list = list.filter(o => o.ref.toLowerCase().includes(q) || o.customer.name.toLowerCase().includes(q))
  return list
})

const counts = computed(() => {
  const base = props.isAdmin ? orders.value : orders.value.filter(o => o.self)
  return {
    all: base.length,
    active: base.filter(o => !['delivered', 'cancelled'].includes(o.status)).length,
    delivered: base.filter(o => o.status === 'delivered').length,
    revenue: base.filter(o => o.status !== 'cancelled').reduce((sum, o) => sum + orderTotal(o), 0),
  }
})
</script>

<template>
  <div>
    <header class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p class="text-xs font-bold uppercase tracking-[0.2em]" :class="isAdmin ? 'text-[#4056E8]' : 'text-[#8A1538]'">Order desk</p>
        <h1 class="mt-2 font-display text-3xl font-semibold leading-tight text-[#14161B] sm:text-4xl">{{ isAdmin ? 'Customer orders' : 'My orders' }}</h1>
        <p class="mt-2 text-sm leading-6 text-slate-500">{{ isAdmin ? 'Search, review, and follow every order through fulfillment.' : 'Track your parcels and reorder your favourites in one tap.' }}</p>
      </div>
      <span class="inline-flex w-fit items-center gap-2 rounded-xl border bg-white px-4 py-2.5 text-[13px] font-semibold text-slate-600 shadow-[0_1px_2px_rgba(23,26,63,.05)]" :class="isAdmin ? 'border-[#E9ECF2]' : 'border-[#F0E2E5]'">
        {{ counts.all }} {{ counts.all === 1 ? 'order' : 'orders' }} · ₱{{ counts.revenue.toLocaleString() }} total
      </span>
    </header>

    <div v-if="placedRef" class="mt-5 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
      <span class="grid h-9 w-9 place-items-center rounded-full bg-emerald-500 text-sm font-bold text-white">✓</span>
      <div>
        <p class="text-sm font-bold text-emerald-800">Order {{ placedRef }} placed!</p>
        <p class="text-xs text-emerald-700">We packed it in the order queue below — tracking updates live.</p>
      </div>
    </div>

    <section class="mt-6 grid grid-cols-3 gap-4">
      <div class="dash-card p-4">
        <p class="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">Active</p>
        <p class="mt-1 font-display text-xl font-semibold leading-none text-[#14161B]">{{ counts.active }}</p>
      </div>
      <div class="dash-card p-4">
        <p class="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">Delivered</p>
        <p class="mt-1 font-display text-xl font-semibold leading-none text-[#14161B]">{{ counts.delivered }}</p>
      </div>
      <div class="dash-card p-4">
        <p class="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">Value</p>
        <p class="mt-1 font-display text-xl font-semibold leading-none text-[#14161B]">₱{{ counts.revenue.toLocaleString() }}</p>
      </div>
    </section>

    <div class="mt-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div class="relative w-full lg:max-w-xs">
        <input v-model="search" type="text" placeholder="Search ref or customer..." class="w-full rounded-xl border border-[#E9ECF2] bg-white px-4 py-2.5 pl-10 text-sm text-[#14161B] placeholder:text-slate-400 focus:border-[#4056E8] focus:outline-none focus:ring-2 focus:ring-[#4056E8]/15" />
        <DashboardIcon name="search" class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      </div>
      <div class="flex flex-wrap gap-2">
        <button type="button" class="rounded-full border px-3.5 py-1.5 text-xs font-semibold transition" :class="statusFilter === '' ? 'border-[#4056E8] bg-[#4056E8] text-white' : 'border-[#E9ECF2] bg-white text-slate-600 hover:text-[#14161B]'" @click="statusFilter = ''">All</button>
        <button v-for="s in statuses" :key="s" type="button" class="rounded-full border px-3.5 py-1.5 text-xs font-semibold capitalize transition" :class="statusFilter === s ? 'border-[#4056E8] bg-[#4056E8] text-white' : 'border-[#E9ECF2] bg-white text-slate-600 hover:text-[#14161B]'" @click="statusFilter = statusFilter === s ? '' : s">{{ statusMeta[s].label }}</button>
      </div>
    </div>

    <TransitionGroup tag="section" name="list" class="mt-5 space-y-3">
      <article v-for="o in filtered" :key="o.id" class="dash-card p-5 transition-shadow hover:shadow-[0_10px_28px_-14px_rgba(23,26,63,.16)]">
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div class="min-w-0">
            <div class="flex flex-wrap items-center gap-2.5">
              <p class="font-mono text-xs font-bold tracking-wide text-[#4056E8]">{{ o.ref }}</p>
              <span class="rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide" :class="statusMeta[o.status].pill">{{ statusMeta[o.status].label }}</span>
            </div>
            <p class="mt-1.5 truncate text-[15px] font-semibold text-[#14161B]">{{ isAdmin ? o.customer.name : itemsLabel(o) }}</p>
            <p class="mt-0.5 text-xs text-slate-500">{{ isAdmin ? itemsLabel(o) : `Placed ${o.placedAt} · ${o.payment}` }}</p>
          </div>
          <div class="text-right">
            <p class="font-display text-xl font-semibold text-[#14161B]">₱{{ orderTotal(o).toLocaleString() }}</p>
            <p class="text-[11px] text-slate-400">{{ o.items.reduce((s, i) => s + i.qty, 0) }} items · {{ o.payment }}</p>
          </div>
        </div>

        <div v-if="o.status !== 'cancelled'" class="mt-4">
          <div class="h-1.5 overflow-hidden rounded-full bg-[#EEF0F5]">
            <div class="h-full rounded-full bg-gradient-to-r from-[#93A7FF] to-[#3D55F0] transition-all duration-700" :style="{ width: `${((statusMeta[o.status].step + 1) / 5) * 100}%` }" />
          </div>
          <div class="mt-1.5 flex justify-between text-[10px] font-semibold text-slate-400">
            <span>Placed</span><span>Packed</span><span>Shipped</span><span>Out</span><span>Delivered</span>
          </div>
        </div>
        <p v-else class="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-600">This order was cancelled. No charges were made.</p>

        <div class="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#F1F3F7] pt-4">
          <p class="text-xs text-slate-500"><span class="font-semibold text-[#14161B]">ETA:</span> {{ o.eta }}</p>
          <div class="flex gap-2">
            <NuxtLink :to="`/dashboard/orders/${o.id}`" class="rounded-xl border border-[#E9ECF2] bg-white px-4 py-2 text-xs font-bold text-[#4056E8] transition hover:border-[#4056E8]/40">Track order</NuxtLink>
            <button v-if="!isAdmin" type="button" class="rounded-xl bg-gradient-to-br from-[#9E2B47] to-[#6E1226] px-4 py-2 text-xs font-bold text-white shadow-[0_8px_18px_-8px_rgba(110,18,38,.55)] transition hover:brightness-105" @click="reorder(o)">
              {{ justReordered === o.id ? 'Added to cart ✓' : 'Reorder' }}
            </button>
          </div>
        </div>
      </article>
    </TransitionGroup>

    <div v-if="!filtered.length" class="dash-card mt-5 p-12 text-center">
      <p class="font-display text-lg font-semibold text-[#14161B]">No matching orders</p>
      <p class="mt-1 text-sm text-slate-500">Try a different search or clear the status filter.</p>
    </div>
  </div>
</template>

<style scoped>
.dash-card {
  border-radius: 16px;
  border: 1px solid #E9ECF2;
  background: #fff;
  box-shadow: 0 1px 2px rgba(23, 26, 63, .04);
}
.list-enter-active, .list-leave-active { transition: all .3s ease; }
.list-enter-from { opacity: 0; transform: translateY(10px); }
.list-leave-to { opacity: 0; transform: scale(.98); }
.list-leave-active { position: absolute; }
.list-move { transition: transform .3s ease; }
</style>