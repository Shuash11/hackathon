<script setup lang="ts">
import { orderTotal, shopOrderSteps, statusMeta, useShopOrders, type ShopOrder } from '~/composables/useShopData'

const props = defineProps<{ isAdmin: boolean; id: number }>()

const orders = useShopOrders()
const order = computed<ShopOrder | undefined>(() => orders.value.find(o => o.id === props.id))

const copied = ref(false)
async function copyTracking(): Promise<void> {
  if (!order.value || order.value.courier.tracking === '—') return
  try { await navigator.clipboard.writeText(order.value.courier.tracking) } catch {}
  copied.value = true
  setTimeout(() => { copied.value = false }, 1600)
}

const justReordered = ref(false)
function reorder(): void {
  if (!order.value) return
  order.value.items.forEach(item => addItemToCart({ key: item.name, name: item.name, category: item.category, price: item.price, image: item.image }, item.qty))
  justReordered.value = true
  setTimeout(() => { justReordered.value = false }, 1400)
}

const adminStatus = ref(order.value?.status ?? 'placed')
const savedFlash = ref(false)
function saveStatus(): void {
  if (!order.value) return
  order.value.status = adminStatus.value
  savedFlash.value = true
  setTimeout(() => { savedFlash.value = false }, 2000)
}
</script>

<template>
  <div v-if="order">
    <NuxtLink to="/dashboard/orders" class="inline-flex items-center gap-1.5 text-xs font-bold text-[#4056E8] hover:text-[#3344D6]">
      <DashboardIcon name="chevron-left" class="h-4 w-4" /> Back to orders
    </NuxtLink>

    <header class="mt-4 flex flex-wrap items-start justify-between gap-4">
      <div>
        <div class="flex flex-wrap items-center gap-2.5">
          <p class="font-mono text-xs font-bold tracking-wide text-[#4056E8]">{{ order.ref }}</p>
          <span class="rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide" :class="statusMeta[order.status].pill">{{ statusMeta[order.status].label }}</span>
        </div>
        <h1 class="mt-2.5 font-display text-3xl font-semibold text-[#14161B] sm:text-4xl">{{ isAdmin ? 'Order details' : 'Track your order' }}</h1>
        <p class="mt-2 text-sm text-slate-500">Placed {{ order.placedAt }} · {{ order.payment }}</p>
      </div>
      <div class="flex gap-2">
        <button v-if="!isAdmin && order.status !== 'cancelled' && statusMeta[order.status].step < 4" type="button" class="rounded-xl border border-[#E9ECF2] bg-white px-4 py-2.5 text-xs font-bold text-slate-600 transition hover:border-[#4056E8]/40 hover:text-[#4056E8]">Contact support</button>
        <button v-if="!isAdmin" type="button" class="rounded-xl bg-gradient-to-br from-[#9E2B47] to-[#6E1226] px-4 py-2.5 text-xs font-bold text-white shadow-[0_8px_18px_-8px_rgba(110,18,38,.55)] transition hover:brightness-105" @click="reorder">
          {{ justReordered ? 'Added to cart ✓' : 'Buy again' }}
        </button>
      </div>
    </header>

    <div class="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <div class="space-y-6">
        <!-- Tracking timeline -->
        <section class="dash-card p-6" aria-label="Delivery tracking">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <h2 class="font-display text-lg font-semibold text-[#14161B]">Delivery tracking</h2>
            <span v-if="order.status !== 'cancelled'" class="rounded-full bg-[#EDF0FE] px-3 py-1 text-xs font-bold text-[#4056E8]">ETA {{ order.eta }}</span>
          </div>

          <div v-if="order.status !== 'cancelled'" class="mt-5">
            <div class="h-2 overflow-hidden rounded-full bg-[#EEF0F5]">
              <div class="h-full rounded-full bg-gradient-to-r from-[#93A7FF] to-[#3D55F0] transition-all duration-1000" :style="{ width: `${((statusMeta[order.status].step + 1) / 5) * 100}%` }" />
            </div>
            <ol class="mt-6">
              <li v-for="(label, i) in shopOrderSteps" :key="label" class="relative flex gap-4 pb-7 last:pb-0">
                <span v-if="i < shopOrderSteps.length - 1" class="absolute left-[15px] top-8 h-[calc(100%-2rem)] w-0.5" :class="i < statusMeta[order.status].step ? 'bg-[#3D55F0]' : 'bg-[#E9ECF2]'" aria-hidden="true" />
                <span class="relative grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-bold"
                  :class="i < statusMeta[order.status].step ? 'bg-[#3D55F0] text-white' : i === statusMeta[order.status].step ? 'bg-[#EDF0FE] text-[#4056E8] ring-2 ring-[#4056E8]' : 'bg-[#F1F3F7] text-slate-400'">
                  <template v-if="i < statusMeta[order.status].step">✓</template>
                  <template v-else-if="i === statusMeta[order.status].step">
                    <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#4056E8]/30" aria-hidden="true" />
                    <span class="relative h-2 w-2 rounded-full bg-[#4056E8]" />
                  </template>
                  <template v-else>{{ i + 1 }}</template>
                </span>
                <div class="min-w-0 pt-1">
                  <p class="text-sm font-semibold" :class="i <= statusMeta[order.status].step ? 'text-[#14161B]' : 'text-slate-400'">{{ label }}</p>
                  <p class="mt-0.5 text-xs text-slate-400">
                    <template v-if="i < statusMeta[order.status].step">Completed</template>
                    <template v-else-if="i === statusMeta[order.status].step">{{ i === 3 ? `Arriving ${order.eta}` : 'In progress right now' }}</template>
                    <template v-else>Pending</template>
                  </p>
                </div>
              </li>
            </ol>
          </div>
          <p v-else class="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600">This order was cancelled — nothing is on the way.</p>

          <!-- Courier card -->
          <div v-if="order.status !== 'cancelled'" class="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#E9ECF2] bg-[#F8F9FD] p-4">
            <div class="flex items-center gap-3">
              <span class="grid h-11 w-11 place-items-center rounded-xl bg-white text-[#4056E8] shadow-sm"><DashboardIcon name="arrow" class="h-5 w-5" /></span>
              <div>
                <p class="text-sm font-bold text-[#14161B]">{{ order.courier.name }}</p>
                <p class="font-mono text-xs text-slate-500">{{ order.courier.tracking }}</p>
              </div>
            </div>
            <button type="button" class="rounded-xl border border-[#E9ECF2] bg-white px-4 py-2 text-xs font-bold text-slate-600 transition hover:border-[#4056E8]/40 hover:text-[#4056E8]" @click="copyTracking">
              {{ copied ? 'Copied ✓' : 'Copy tracking no.' }}
            </button>
          </div>
        </section>

        <!-- Items -->
        <section class="dash-card overflow-hidden" aria-label="Order items">
          <div class="flex items-center justify-between border-b border-[#F1F3F7] px-6 py-4">
            <h2 class="font-display text-lg font-semibold text-[#14161B]">Order items</h2>
            <span class="text-xs text-slate-400">{{ order.items.reduce((s, i) => s + i.qty, 0) }} units</span>
          </div>
          <ul class="divide-y divide-[#F1F3F7]">
            <li v-for="item in order.items" :key="item.name" class="flex items-center gap-4 px-6 py-4">
              <div class="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-xl bg-[#F8F9FD]">
                <img :src="item.image" :alt="item.name" class="h-full w-full object-contain p-1.5">
              </div>
              <div class="min-w-0 flex-1">
                <p class="text-sm font-semibold text-[#14161B]">{{ item.name }}</p>
                <p class="mt-0.5 text-xs text-slate-400">{{ item.category }} · ₱{{ item.price.toLocaleString() }} × {{ item.qty }}</p>
              </div>
              <p class="font-display text-base font-semibold text-[#14161B]">₱{{ (item.price * item.qty).toLocaleString() }}</p>
            </li>
          </ul>
          <dl class="space-y-1.5 border-t border-[#F1F3F7] px-6 py-4 text-sm">
            <div class="flex justify-between text-slate-500"><dt>Subtotal</dt><dd>₱{{ (orderTotal(order) - order.shipping).toLocaleString() }}</dd></div>
            <div class="flex justify-between text-slate-500"><dt>Shipping</dt><dd>{{ order.shipping === 0 ? 'Free' : `₱${order.shipping}` }}</dd></div>
            <div class="flex justify-between border-t border-[#F1F3F7] pt-2 font-display text-lg font-semibold text-[#14161B]"><dt>Total</dt><dd>₱{{ orderTotal(order).toLocaleString() }}</dd></div>
          </dl>
        </section>
      </div>

      <!-- Sidebar -->
      <aside class="h-fit space-y-5 lg:sticky lg:top-28">
        <section class="dash-card p-5">
          <p class="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">Deliver to</p>
          <p class="mt-2 text-sm font-semibold text-[#14161B]">{{ isAdmin ? order.customer.name : 'My address' }}</p>
          <p class="mt-1 text-[13px] leading-5 text-slate-500">{{ order.address }}</p>
          <p v-if="isAdmin" class="mt-1 text-[13px] text-slate-500">{{ order.customer.email }}</p>
        </section>

        <section v-if="isAdmin" class="dash-card p-5">
          <p class="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">Fulfillment</p>
          <label class="mt-3 block">
            <span class="mb-1.5 block text-xs font-semibold text-slate-600">Update status</span>
            <select v-model="adminStatus" class="h-11 w-full rounded-xl border border-[#E9ECF2] bg-white px-3 text-sm text-[#14161B] focus:border-[#4056E8] focus:outline-none">
              <option v-for="(meta, key) in statusMeta" :key="key" :value="key">{{ meta.label }}</option>
            </select>
          </label>
          <button type="button" class="mt-3 h-11 w-full rounded-xl bg-gradient-to-br from-[#5B79FF] to-[#3D55F0] text-sm font-bold text-white transition hover:brightness-105 disabled:opacity-50" :disabled="adminStatus === order.status" @click="saveStatus">
            Save status
          </button>
          <p v-if="savedFlash" class="mt-2 text-center text-xs font-bold text-emerald-600">Status updated ✓</p>
        </section>

        <section class="dash-card p-5">
          <p class="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">Payment</p>
          <div class="mt-2 flex items-center gap-2.5">
            <span class="grid h-9 w-9 place-items-center rounded-lg bg-[#F1F3F7] text-xs font-bold text-slate-600">{{ order.payment === 'COD' ? 'COD' : order.payment.slice(0, 2) }}</span>
            <p class="text-sm font-semibold text-[#14161B]">{{ order.payment }}</p>
          </div>
          <p class="mt-2 text-xs text-slate-500">{{ order.status === 'cancelled' ? 'No charge was made.' : order.payment === 'COD' ? 'Pay cash on delivery.' : 'Paid in full.' }}</p>
        </section>
      </aside>
    </div>
  </div>
  <div v-else class="dash-card p-12 text-center">
    <p class="font-display text-lg font-semibold text-[#14161B]">Order not found</p>
    <NuxtLink to="/dashboard/orders" class="mt-2 inline-block text-sm font-bold text-[#4056E8]">← Back to orders</NuxtLink>
  </div>
</template>

<style scoped>
.dash-card {
  border-radius: 16px;
  border: 1px solid #E9ECF2;
  background: #fff;
  box-shadow: 0 1px 2px rgba(23, 26, 63, .04);
}
</style>