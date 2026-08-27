<script setup lang="ts">
import { FREE_SHIPPING_MIN, SHIPPING_FEE, useCartItems, useShopOrders, type ShopOrder } from '~/composables/useShopData'

definePageMeta({ layout: 'user-dashboard', middleware: 'auth' })
useHead({ title: 'Cart — Scentico' })

const { auth } = useAuth()
const cart = useCartItems()
const orders = useShopOrders()
const cartBump = useCartBump()

const addresses = [
  { id: 1, label: 'Home', line: '123 Katipunan Ave, Quezon City, Metro Manila 1108' },
  { id: 2, label: 'Office', line: 'Unit 2107, One Global Place, BGC, Taguig 1634' },
]
const payments = ['GCash', 'COD', 'Visa'] as const

const selectedAddress = ref(addresses[0]!.line)
const checkoutPayment = useState<'GCash' | 'COD' | 'Visa'>('shop-checkout-payment', () => 'GCash')
const selectedPayment = ref<'GCash' | 'COD' | 'Visa'>(checkoutPayment.value)
watch(selectedPayment, value => { checkoutPayment.value = value })
const placing = ref(false)
const placedRef = ref('')

const subtotal = computed(() => cart.value.reduce((sum, item) => sum + item.price * item.qty, 0))
const freeShipping = computed(() => subtotal.value >= FREE_SHIPPING_MIN)
const shipping = computed(() => (subtotal.value === 0 || freeShipping.value ? 0 : SHIPPING_FEE))
const total = computed(() => subtotal.value + shipping.value)

function changeQty(key: string, delta: number): void {
  const item = cart.value.find(c => c.key === key)
  if (!item) return
  item.qty += delta
  if (item.qty <= 0) cart.value = cart.value.filter(c => c.key !== key)
  cartBump.value += 1
}

function removeItem(key: string): void {
  cart.value = cart.value.filter(c => c.key !== key)
  cartBump.value += 1
}

function placeOrder(): void {
  if (!cart.value.length || placing.value) return
  placing.value = true
  const ref = `SN-${Math.floor(8000 + Math.random() * 1999)}`
  const order: ShopOrder = {
    id: Date.now(),
    ref,
    self: true,
    customer: {
      name: auth.user ? `${auth.user.first_name ?? ''} ${auth.user.last_name ?? ''}`.trim() || 'You' : 'You',
      email: auth.user?.email || 'you@scentico.ph',
    },
    items: cart.value.map(c => ({ name: c.name, category: c.category, qty: c.qty, price: c.price, image: c.image })),
    shipping: shipping.value,
    payment: selectedPayment.value,
    status: 'placed',
    placedAt: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }),
    eta: '3–5 days',
    address: selectedAddress.value,
    courier: { name: 'Courier assignment in progress', tracking: '—' },
  }
  orders.value.unshift(order)
  cart.value = []
  placedRef.value = ref
  placing.value = false
  navigateTo('/dashboard/orders?placed=' + ref)
}
</script>

<template>
  <div>
    <header class="pb-5">
      <p class="text-xs font-bold uppercase tracking-[0.2em] text-[#8A1538]">Checkout</p>
      <h1 class="mt-2 font-display text-3xl font-semibold leading-tight text-[#231318] sm:text-4xl">Your cart</h1>
      <p class="mt-2 text-sm text-slate-500">Review your fragrances, then place your order.</p>
    </header>

    <div v-if="placedRef" class="mb-5 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
      <span class="grid h-9 w-9 place-items-center rounded-full bg-emerald-500 text-sm font-bold text-white">✓</span>
      <div>
        <p class="text-sm font-bold text-emerald-800">Order {{ placedRef }} placed!</p>
        <p class="text-xs text-emerald-700">Track it anytime from My Orders.</p>
      </div>
      <NuxtLink to="/dashboard/orders" class="ml-auto rounded-xl border border-emerald-300 bg-white px-4 py-2 text-xs font-bold text-emerald-700 transition hover:bg-emerald-50">View orders</NuxtLink>
    </div>

    <div v-if="!cart.length" class="rounded-2xl border border-[#F0E2E5] bg-white p-14 text-center shadow-[0_1px_2px_rgba(35,19,24,.04)]">
      <span class="mx-auto block h-14 w-14 rounded-2xl bg-[#FBEFF2]" />
      <p class="mt-4 font-display text-xl font-semibold text-[#231318]">Your cart is empty</p>
      <p class="mt-1 text-sm text-slate-500">Add a perfume (or the ₱529 bundle) to get started.</p>
      <NuxtLink to="/dashboard" class="mt-5 inline-flex rounded-xl bg-gradient-to-br from-[#9E2B47] to-[#6E1226] px-6 py-3 text-sm font-bold text-white shadow-[0_10px_24px_-10px_rgba(110,18,38,.6)] transition hover:brightness-105">Back to shop</NuxtLink>
    </div>

    <div v-else class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <!-- Items -->
      <section class="space-y-3" aria-label="Cart items">
        <TransitionGroup name="list" tag="div" class="space-y-3">
          <article v-for="item in cart" :key="item.key" class="flex items-center gap-4 rounded-2xl border border-[#F0E2E5] bg-white p-4 shadow-[0_1px_2px_rgba(35,19,24,.04)]">
            <div class="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-xl bg-[#FBEFF2]">
              <img :src="item.image" :alt="item.name" class="h-full w-full object-contain p-1.5">
            </div>
            <div class="min-w-0 flex-1">
              <p class="truncate text-[15px] font-bold text-[#231318]">{{ item.name }}</p>
              <p class="mt-0.5 text-xs text-slate-500">{{ item.category }}</p>
              <p class="mt-1 font-display text-lg font-bold text-[#8A1538]">₱{{ item.price.toLocaleString() }}</p>
            </div>
            <div class="flex flex-col items-end gap-2">
              <div class="flex items-center gap-1 rounded-full border border-[#EBE3E5] bg-white p-1">
                <button type="button" aria-label="Decrease quantity" class="grid h-7 w-7 place-items-center rounded-full text-slate-500 transition hover:bg-[#FBEFF2] hover:text-[#8A1538]" @click="changeQty(item.key, -1)">−</button>
                <span class="w-7 text-center text-sm font-bold tabular-nums text-[#231318]">{{ item.qty }}</span>
                <button type="button" aria-label="Increase quantity" class="grid h-7 w-7 place-items-center rounded-full text-slate-500 transition hover:bg-[#FBEFF2] hover:text-[#8A1538]" @click="changeQty(item.key, 1)">+</button>
              </div>
              <button type="button" class="text-xs font-semibold text-slate-400 transition hover:text-rose-600" @click="removeItem(item.key)">Remove</button>
            </div>
          </article>
        </TransitionGroup>
      </section>

      <!-- Summary -->
      <aside class="h-fit space-y-4 lg:sticky lg:top-24">
        <section class="rounded-2xl border border-[#F0E2E5] bg-white p-5 shadow-[0_1px_2px_rgba(35,19,24,.04)]" aria-label="Order summary">
          <h2 class="font-display text-lg font-semibold text-[#231318]">Order summary</h2>
          <dl class="mt-4 space-y-2 text-sm">
            <div class="flex justify-between text-slate-500"><dt>Subtotal</dt><dd class="font-semibold text-[#231318]">₱{{ subtotal.toLocaleString() }}</dd></div>
            <div class="flex justify-between text-slate-500"><dt>Shipping</dt><dd class="font-semibold" :class="freeShipping ? 'text-emerald-600' : 'text-[#231318]'">{{ shipping === 0 ? 'FREE' : `₱${shipping}` }}</dd></div>
          </dl>
          <p v-if="!freeShipping" class="mt-3 rounded-xl bg-[#FBEFF2] px-3 py-2 text-xs font-semibold text-[#8A1538]">Add ₱{{ (FREE_SHIPPING_MIN - subtotal).toLocaleString() }} more for free shipping</p>
          <div class="mt-4 flex items-baseline justify-between border-t border-[#F1E7EA] pt-3">
            <span class="text-sm font-semibold text-slate-500">Total</span>
            <span class="font-display text-2xl font-bold text-[#8A1538]">₱{{ total.toLocaleString() }}</span>
          </div>
        </section>

        <section class="rounded-2xl border border-[#F0E2E5] bg-white p-5 shadow-[0_1px_2px_rgba(35,19,24,.04)]" aria-label="Delivery address">
          <h2 class="font-display text-lg font-semibold text-[#231318]">Deliver to</h2>
          <div class="mt-3 space-y-2">
            <label v-for="a in addresses" :key="a.id" class="flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition" :class="selectedAddress === a.line ? 'border-[#8A1538]/40 bg-[#FDF7F8]' : 'border-[#EBE3E5] hover:border-[#8A1538]/25'">
              <input v-model="selectedAddress" type="radio" name="address" :value="a.line" class="mt-0.5 accent-[#8A1538]">
              <span class="min-w-0">
                <span class="block text-sm font-bold text-[#231318]">{{ a.label }}</span>
                <span class="block text-xs leading-5 text-slate-500">{{ a.line }}</span>
              </span>
            </label>
          </div>
        </section>

        <section class="rounded-2xl border border-[#F0E2E5] bg-white p-5 shadow-[0_1px_2px_rgba(35,19,24,.04)]" aria-label="Payment method">
          <h2 class="font-display text-lg font-semibold text-[#231318]">Payment</h2>
          <div class="mt-3 grid grid-cols-3 gap-2">
            <button v-for="p in payments" :key="p" type="button" class="rounded-xl border py-2.5 text-xs font-bold transition" :class="selectedPayment === p ? 'border-[#8A1538] bg-[#FBEFF2] text-[#8A1538]' : 'border-[#EBE3E5] text-slate-500 hover:text-[#231318]'" @click="selectedPayment = p">{{ p }}</button>
          </div>
          <p class="mt-2 text-xs text-slate-400">{{ selectedPayment === 'COD' ? 'Pay cash when your parcel arrives.' : 'You will be redirected after placing the order.' }}</p>
        </section>

        <button type="button" class="w-full rounded-2xl bg-gradient-to-br from-[#9E2B47] to-[#6E1226] py-4 text-[15px] font-bold text-white shadow-[0_14px_30px_-10px_rgba(110,18,38,.65)] transition hover:brightness-110 disabled:opacity-60" :disabled="placing" @click="placeOrder">
          {{ placing ? 'Placing order...' : `Place order · ₱${total.toLocaleString()}` }}
        </button>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.list-enter-active, .list-leave-active { transition: all .25s ease; }
.list-enter-from { opacity: 0; transform: translateY(8px); }
.list-leave-to { opacity: 0; transform: scale(.97); }
.list-move { transition: transform .25s ease; }
</style>