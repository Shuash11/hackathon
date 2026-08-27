<script setup lang="ts">
import { FREE_SHIPPING_MIN, SHIPPING_FEE, addItemToCart } from '~/composables/useShopData'

export interface OrderDialogProduct {
  key: string
  name: string
  category: string
  price: number
  oldPrice: number | null
  image: string
  rating?: string
  sold?: number
}

const props = defineProps<{
  modelValue: boolean
  product: OrderDialogProduct | null
}>()
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()

const isOpen = computed(() => props.modelValue && !!props.product)
const qty = ref(1)
const added = ref(false)
const checkoutPayment = useState<'GCash' | 'COD' | 'Visa'>('shop-checkout-payment', () => 'GCash')
const payment = ref<'GCash' | 'COD' | 'Visa'>('GCash')

watch(isOpen, open => {
  if (open) {
    qty.value = 1
    added.value = false
    payment.value = checkoutPayment.value
  }
})

const lineTotal = computed(() => (props.product ? props.product.price * qty.value : 0))
const freeShipping = computed(() => lineTotal.value >= FREE_SHIPPING_MIN)
const shipping = computed(() => (freeShipping.value ? 0 : SHIPPING_FEE))
const total = computed(() => lineTotal.value + shipping.value)
const discountPct = computed(() => (props.product?.oldPrice ? Math.round((1 - props.product.price / props.product.oldPrice) * 100) : 0))

function close(): void {
  emit('update:modelValue', false)
}

function onEsc(event: KeyboardEvent): void {
  if (event.key === 'Escape' && isOpen.value) close()
}
onMounted(() => document.addEventListener('keydown', onEsc))
onBeforeUnmount(() => document.removeEventListener('keydown', onEsc))

function addToCart(): void {
  if (!props.product) return
  addItemToCart({ key: props.product.key, name: props.product.name, category: props.product.category, price: props.product.price, image: props.product.image }, qty.value)
  added.value = true
  setTimeout(() => { added.value = false }, 1300)
}

function orderNow(): void {
  if (!props.product) return
  checkoutPayment.value = payment.value
  addItemToCart({ key: props.product.key, name: props.product.name, category: props.product.category, price: props.product.price, image: props.product.image }, qty.value)
  close()
  void navigateTo('/dashboard/cart')
}
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 z-[420] flex items-end justify-center bg-[rgba(35,19,24,.55)] p-0 backdrop-blur-md transition-opacity duration-300 sm:items-center sm:p-4"
      :class="isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'"
      @click.self="close"
    >
      <div
        v-if="product"
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-dialog-title"
        class="max-h-[94vh] w-full max-w-[400px] overflow-y-auto rounded-t-3xl border border-[#F0E2E5] bg-white p-6 shadow-[0_32px_80px_-24px_rgba(35,19,24,.5)] transition-transform duration-300 sm:rounded-3xl"
        :class="isOpen ? 'translate-y-0 scale-100' : 'translate-y-6 scale-[.98]'"
      >
        <!-- Header -->
        <div class="flex items-start justify-between">
          <h2 id="order-dialog-title" class="font-display text-xl font-semibold text-[#231318]">Order details</h2>
          <button type="button" aria-label="Close" class="grid h-8 w-8 place-items-center rounded-lg border border-[#EBE3E5] text-slate-500 transition hover:bg-[#FBEFF2] hover:text-[#8A1538]" @click="close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" class="h-4 w-4"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
        </div>

        <!-- Product -->
        <div class="mt-4 flex gap-3.5">
          <div class="relative grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-2xl bg-gradient-to-b from-[#FBEFF2] to-white">
            <img :src="product.image" :alt="product.name" class="h-full w-full object-contain p-2 drop-shadow-[0_10px_14px_rgba(35,19,24,.12)]">
            <span v-if="discountPct" class="absolute left-1.5 top-1.5 rounded-md bg-[#8A1538] px-1.5 py-0.5 text-[9px] font-bold text-white">-{{ discountPct }}%</span>
          </div>
          <div class="min-w-0 flex-1">
            <span class="inline-block rounded-md bg-[#FBEFF2] px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#8A1538]">{{ product.category }}</span>
            <p class="mt-1 truncate text-[15px] font-bold text-[#231318]">{{ product.name }}</p>
            <p v-if="product.rating" class="mt-0.5 text-[11px] font-semibold text-slate-400">★ {{ product.rating }} · {{ product.sold }} sold</p>
            <div class="mt-1.5 flex items-baseline gap-2">
              <span class="font-display text-xl font-bold text-[#8A1538]">₱{{ product.price.toLocaleString() }}</span>
              <s v-if="product.oldPrice" class="text-xs text-slate-400">₱{{ product.oldPrice.toLocaleString() }}</s>
            </div>
          </div>
        </div>

        <!-- Quantity -->
        <div class="mt-5 flex items-center justify-between">
          <span class="text-sm font-bold text-[#231318]">Quantity</span>
          <div class="flex items-center gap-1 rounded-full border border-[#EBE3E5] bg-white p-1">
            <button type="button" aria-label="Decrease quantity" class="grid h-8 w-8 place-items-center rounded-full text-slate-500 transition hover:bg-[#FBEFF2] hover:text-[#8A1538]" @click="qty = Math.max(1, qty - 1)">−</button>
            <span class="w-8 text-center text-sm font-bold tabular-nums text-[#231318]">{{ qty }}</span>
            <button type="button" aria-label="Increase quantity" class="grid h-8 w-8 place-items-center rounded-full text-slate-500 transition hover:bg-[#FBEFF2] hover:text-[#8A1538]" @click="qty++">+</button>
          </div>
        </div>

        <!-- What you pay -->
        <div class="mt-4 rounded-2xl border border-[#F0E2E5] bg-[#FDFAFB] p-4">
          <p class="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">What you pay</p>
          <dl class="mt-2.5 space-y-1.5 text-sm">
            <div class="flex justify-between text-slate-500"><dt>₱{{ product.price.toLocaleString() }} × {{ qty }}</dt><dd class="font-semibold text-[#231318]">₱{{ lineTotal.toLocaleString() }}</dd></div>
            <div class="flex justify-between text-slate-500"><dt>Shipping</dt><dd class="font-semibold" :class="freeShipping ? 'text-emerald-600' : 'text-[#231318]'">{{ freeShipping ? 'FREE' : `₱${shipping}` }}</dd></div>
            <div class="flex justify-between border-t border-[#F1E7EA] pt-2 font-display text-lg font-bold text-[#8A1538]"><dt>Total</dt><dd>₱{{ total.toLocaleString() }}</dd></div>
          </dl>
          <p v-if="!freeShipping" class="mt-2 text-[11px] font-semibold text-slate-400">Spend ₱{{ (FREE_SHIPPING_MIN - lineTotal).toLocaleString() }} more for free shipping</p>
        </div>

        <!-- Payment method -->
        <div class="mt-4">
          <p class="text-sm font-bold text-[#231318]">Payment method</p>
          <div class="mt-2 grid grid-cols-3 gap-2">
            <button
              v-for="p in (['GCash', 'COD', 'Visa'] as const)"
              :key="p"
              type="button"
              class="rounded-xl border py-2.5 text-xs font-bold transition"
              :class="payment === p ? 'border-[#8A1538] bg-[#FBEFF2] text-[#8A1538]' : 'border-[#EBE3E5] text-slate-500 hover:text-[#231318]'"
              @click="payment = p"
            >{{ p }}</button>
          </div>
          <p class="mt-1.5 text-[11px] text-slate-400">{{ payment === 'COD' ? 'Pay cash when the parcel arrives.' : 'You can change this at checkout.' }}</p>
        </div>

        <!-- Actions -->
        <div class="mt-5 grid grid-cols-2 gap-2.5">
          <button type="button" class="rounded-2xl border border-[#8A1538]/35 bg-white py-3.5 text-sm font-bold text-[#8A1538] transition hover:bg-[#FBEFF2]" @click="addToCart">
            {{ added ? 'Added ✓' : 'Add to cart' }}
          </button>
          <button type="button" class="rounded-2xl bg-gradient-to-br from-[#9E2B47] to-[#6E1226] py-3.5 text-sm font-bold text-white shadow-[0_12px_26px_-10px_rgba(110,18,38,.6)] transition hover:brightness-110" @click="orderNow">
            Order now
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>