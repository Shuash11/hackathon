<script setup lang="ts">
import { scenticoProducts, type ScenticoProduct } from '~/data/scentico'

definePageMeta({ layout: 'dashboard', middleware: 'auth' })

interface ProductDraft {
  mood: string
  name: string
  price: string
  top: string
  heart: string
  base: string
  effect: string
  gradient: string
  bottle: string
  cap: string
}

interface CheckoutDetails {
  name: string
  email: string
  address: string
}

const { auth, signOut } = useAuth()
const products = ref<ScenticoProduct[]>(scenticoProducts.map(product => ({ ...product })))
const cart = ref<Record<string, number>>({})
const editorOpen = ref(false)
const checkoutOpen = ref(false)
const checkoutComplete = ref(false)
const editingId = ref<string | null>(null)
const notice = ref('')
const storageKey = 'scentico-dashboard-state'

const draft = reactive<ProductDraft>({
  mood: 'New release',
  name: '',
  price: '',
  top: '',
  heart: '',
  base: '',
  effect: '',
  gradient: 'linear-gradient(160deg, #E39B6B, #5C3826)',
  bottle: '#F0C39A',
  cap: '#2A1810',
})

const checkoutDetails = reactive<CheckoutDetails>({ name: '', email: '', address: '' })

const cartLines = computed(() => products.value.flatMap(product => {
  const quantity = cart.value[product.id] || 0
  return quantity > 0 ? [{ product, quantity }] : []
}))
const cartCount = computed(() => cartLines.value.reduce((total, line) => total + line.quantity, 0))
const subtotal = computed(() => cartLines.value.reduce((total, line) => total + priceToNumber(line.product.price) * line.quantity, 0))
const modalOpen = computed(() => editorOpen.value || checkoutOpen.value)

useScenticoBodyLock(modalOpen)
useHead({
  title: 'Scentico Atelier',
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,600;1,600&family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600;9..144,700&family=Manrope:wght@400;500;600;700;800&display=swap' },
  ],
})

function priceToNumber(price: string): number {
  return Number(price.replace(/[^0-9.]/g, '')) || 0
}

function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount)
}

function resetDraft(): void {
  Object.assign(draft, {
    mood: 'New release',
    name: '',
    price: '',
    top: '',
    heart: '',
    base: '',
    effect: '',
    gradient: 'linear-gradient(160deg, #E39B6B, #5C3826)',
    bottle: '#F0C39A',
    cap: '#2A1810',
  })
}

function productId(name: string): string {
  const base = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'scent'
  const ids = new Set(products.value.map(product => product.id))
  let candidate = base
  let suffix = 2
  while (ids.has(candidate)) {
    candidate = `${base}-${suffix}`
    suffix += 1
  }
  return candidate
}

function openCreate(): void {
  resetDraft()
  editingId.value = null
  editorOpen.value = true
}

function openEdit(product: ScenticoProduct): void {
  Object.assign(draft, product)
  editingId.value = product.id
  editorOpen.value = true
}

function closeEditor(): void {
  editorOpen.value = false
  editingId.value = null
}

function saveProduct(): void {
  const amount = priceToNumber(draft.price)
  if (!draft.name.trim() || !amount) return

  const product: ScenticoProduct = {
    id: editingId.value || productId(draft.name),
    mood: draft.mood.trim() || 'New release',
    name: draft.name.trim(),
    price: formatPrice(amount),
    top: draft.top.trim(),
    heart: draft.heart.trim(),
    base: draft.base.trim(),
    effect: draft.effect.trim(),
    gradient: draft.gradient.trim(),
    bottle: draft.bottle,
    cap: draft.cap,
  }

  if (editingId.value) {
    products.value = products.value.map(item => item.id === editingId.value ? product : item)
    notice.value = `${product.name} was updated.`
  } else {
    products.value = [product, ...products.value]
    notice.value = `${product.name} was added to the collection.`
  }
  closeEditor()
}

function deleteProduct(product: ScenticoProduct): void {
  if (!window.confirm(`Delete ${product.name} from the collection?`)) return
  products.value = products.value.filter(item => item.id !== product.id)
  delete cart.value[product.id]
  cart.value = { ...cart.value }
  notice.value = `${product.name} was deleted.`
}

function addToBag(productId: string): void {
  cart.value = { ...cart.value, [productId]: (cart.value[productId] || 0) + 1 }
  notice.value = 'Added to your bag.'
}

function changeQuantity(productId: string, change: number): void {
  const quantity = (cart.value[productId] || 0) + change
  const nextCart = { ...cart.value }
  if (quantity <= 0) delete nextCart[productId]
  else nextCart[productId] = quantity
  cart.value = nextCart
}

function openCheckout(): void {
  if (!cartLines.value.length) return
  checkoutComplete.value = false
  checkoutOpen.value = true
}

function completeCheckout(): void {
  if (!cartLines.value.length) return
  cart.value = {}
  checkoutComplete.value = true
  notice.value = 'Your Scentico order is confirmed.'
}

async function handleSignOut(): Promise<void> {
  await signOut()
  await navigateTo('/')
}

function saveState(): void {
  if (!import.meta.client) return
  localStorage.setItem(storageKey, JSON.stringify({ products: products.value, cart: cart.value }))
}

onMounted(() => {
  const saved = localStorage.getItem(storageKey)
  if (saved) {
    try {
      const state = JSON.parse(saved) as { products?: ScenticoProduct[]; cart?: Record<string, number> }
      if (Array.isArray(state.products)) products.value = state.products
      if (state.cart && typeof state.cart === 'object') cart.value = state.cart
    } catch {
      localStorage.removeItem(storageKey)
    }
  }
  checkoutDetails.name = [auth.user?.first_name, auth.user?.last_name].filter(Boolean).join(' ')
  checkoutDetails.email = auth.user?.email || ''
})

watch([products, cart], saveState, { deep: true })
</script>

<template>
  <div class="min-h-screen bg-cream">
    <header class="border-b border-espresso/[.12] bg-cream-soft/90 backdrop-blur">
      <nav aria-label="Dashboard navigation" class="mx-auto flex max-w-[1320px] items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <NuxtLink to="/" class="flex items-center gap-3" aria-label="Scentico home">
          <img src="/scentico/logo.png" alt="Scentico" class="h-9 w-9 rounded-full object-cover" />
          <span class="font-display text-xl tracking-[.08em] text-espresso">SCENTICO</span>
        </NuxtLink>
        <div class="flex items-center gap-3 text-sm">
          <span class="hidden text-espresso/65 sm:inline">{{ auth.user?.email }}</span>
          <button type="button" class="rounded-full border border-espresso/[.18] px-4 py-2 font-bold text-espresso transition-colors hover:bg-espresso hover:text-cream-soft" @click="handleSignOut">Sign out</button>
        </div>
      </nav>
    </header>

    <main class="mx-auto max-w-[1320px] px-5 py-10 sm:px-8 md:py-14">
      <section class="flex flex-col justify-between gap-7 border-b border-espresso/[.12] pb-10 lg:flex-row lg:items-end">
        <div>
          <span class="text-[.72rem] font-bold uppercase tracking-[.22em] text-peach-deep">Atelier dashboard</span>
          <h1 class="mt-3 font-display text-4xl leading-none text-espresso sm:text-5xl">Your collection,<br><em class="font-glyphic text-peach-deep">your rules.</em></h1>
          <p class="mt-4 max-w-[52ch] text-espresso/70">Build the next fragrance release, tune the details, and prepare a private order from the same collection.</p>
        </div>
        <div class="flex flex-wrap gap-3">
          <NuxtLink to="/#products" class="inline-flex items-center justify-center rounded-full border border-espresso/[.2] px-5 py-3 text-sm font-bold text-espresso transition hover:bg-espresso hover:text-cream-soft">View storefront</NuxtLink>
          <button type="button" class="inline-flex items-center justify-center rounded-full bg-espresso px-5 py-3 text-sm font-bold text-cream-soft transition hover:bg-coffee hover:shadow-soft" @click="openCreate">Add a scent</button>
        </div>
      </section>

      <p v-if="notice" role="status" class="mt-6 rounded-xl border border-peach-deep/20 bg-peach-light/30 px-4 py-3 text-sm font-semibold text-espresso">{{ notice }}</p>

      <section class="mt-8 grid gap-4 sm:grid-cols-3">
        <div class="rounded-2xl border border-espresso/[.12] bg-cream-soft p-5"><span class="block text-[.68rem] font-bold uppercase tracking-[.16em] text-espresso/55">Active scents</span><strong class="mt-2 block font-display text-3xl text-espresso">{{ products.length }}</strong></div>
        <div class="rounded-2xl border border-espresso/[.12] bg-cream-soft p-5"><span class="block text-[.68rem] font-bold uppercase tracking-[.16em] text-espresso/55">In your bag</span><strong class="mt-2 block font-display text-3xl text-espresso">{{ cartCount }}</strong></div>
        <div class="rounded-2xl border border-espresso/[.12] bg-cream-soft p-5"><span class="block text-[.68rem] font-bold uppercase tracking-[.16em] text-espresso/55">Bag total</span><strong class="mt-2 block font-display text-3xl text-espresso">{{ formatPrice(subtotal) }}</strong></div>
      </section>

      <div class="mt-12 grid gap-10 xl:grid-cols-[minmax(0,1fr)_340px]">
        <section aria-labelledby="collection-title">
          <div class="mb-6 flex items-end justify-between gap-4"><div><span class="text-[.72rem] font-bold uppercase tracking-[.22em] text-peach-deep">Product management</span><h2 id="collection-title" class="mt-2 font-display text-3xl text-espresso">The collection</h2></div><button type="button" class="text-sm font-bold text-peach-deep underline decoration-peach-deep/40 underline-offset-4" @click="openCreate">New scent</button></div>
          <div class="grid gap-5 sm:grid-cols-2 2xl:grid-cols-3">
            <article v-for="product in products" :key="product.id" class="overflow-hidden rounded-[22px] border border-espresso/[.12] bg-cream-soft shadow-card">
              <div class="relative flex aspect-[5/4] items-center justify-center overflow-hidden" :style="{ background: product.gradient }">
                <ScenticoBottleArt :bottle="product.bottle" :cap="product.cap" />
                <span class="absolute left-4 top-4 rounded-full bg-espresso/35 px-3 py-1 text-[.64rem] font-bold uppercase tracking-[.15em] text-cream-soft backdrop-blur">{{ product.mood }}</span>
              </div>
              <div class="p-5"><div class="flex items-start justify-between gap-3"><div><h3 class="font-display text-2xl leading-none text-espresso">{{ product.name }}</h3><p class="mt-2 text-sm font-bold text-peach-deep">{{ product.price }}</p></div><div class="flex gap-1"><button type="button" class="rounded-full p-2 text-espresso/60 transition hover:bg-cream-deep hover:text-espresso" :aria-label="`Edit ${product.name}`" @click="openEdit(product)"><svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg></button><button type="button" class="rounded-full p-2 text-espresso/60 transition hover:bg-red-100 hover:text-red-800" :aria-label="`Delete ${product.name}`" @click="deleteProduct(product)"><svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 6h18M8 6V4h8v2m-9 0 1 15h8l1-15"/></svg></button></div></div><p class="mt-4 min-h-[44px] text-sm leading-relaxed text-espresso/70">{{ product.effect }}</p><button type="button" class="mt-5 inline-flex w-full items-center justify-center rounded-full bg-espresso px-4 py-3 text-sm font-bold text-cream-soft transition hover:bg-coffee" @click="addToBag(product.id)">Add to bag</button></div>
            </article>
          </div>
        </section>

        <aside aria-labelledby="bag-title" class="self-start xl:sticky xl:top-6">
          <div class="overflow-hidden rounded-[24px] bg-espresso text-cream-soft shadow-soft"><div class="border-b border-cream-soft/[.14] p-6"><div class="flex items-center justify-between"><div><span class="text-[.68rem] font-bold uppercase tracking-[.18em] text-peach-light">Private order</span><h2 id="bag-title" class="mt-2 font-display text-3xl">Your bag</h2></div><span class="flex h-10 min-w-10 items-center justify-center rounded-full bg-cream-soft/10 px-2 text-sm font-bold">{{ cartCount }}</span></div></div><div class="max-h-[430px] overflow-y-auto p-6"><p v-if="!cartLines.length" class="py-9 text-center text-sm leading-relaxed text-cream-soft/65">Your bag is waiting for a scent.<br>Start with one from the collection.</p><ul v-else class="grid gap-5"><li v-for="line in cartLines" :key="line.product.id" class="border-b border-cream-soft/[.12] pb-5 last:border-0 last:pb-0"><div class="flex items-start justify-between gap-4"><div><h3 class="font-display text-xl">{{ line.product.name }}</h3><p class="mt-1 text-sm text-peach-light">{{ line.product.price }} · {{ line.product.mood }}</p></div><strong class="text-sm">{{ formatPrice(priceToNumber(line.product.price) * line.quantity) }}</strong></div><div class="mt-3 flex items-center justify-between"><div class="flex items-center rounded-full border border-cream-soft/[.2]"><button type="button" class="h-8 w-8 text-lg transition hover:bg-cream-soft/10" :aria-label="`Remove one ${line.product.name}`" @click="changeQuantity(line.product.id, -1)">−</button><span class="w-7 text-center text-sm font-bold">{{ line.quantity }}</span><button type="button" class="h-8 w-8 text-lg transition hover:bg-cream-soft/10" :aria-label="`Add one ${line.product.name}`" @click="changeQuantity(line.product.id, 1)">+</button></div><button type="button" class="text-xs font-bold text-cream-soft/55 underline underline-offset-4 hover:text-cream-soft" @click="changeQuantity(line.product.id, -line.quantity)">Remove</button></div></li></ul></div><div class="border-t border-cream-soft/[.14] p-6"><div class="flex items-center justify-between text-sm text-cream-soft/70"><span>Subtotal</span><strong class="text-lg text-cream-soft">{{ formatPrice(subtotal) }}</strong></div><button type="button" class="mt-5 inline-flex w-full items-center justify-center rounded-full bg-peach-light px-5 py-3.5 text-sm font-bold text-espresso transition hover:bg-gold-light disabled:cursor-not-allowed disabled:opacity-40" :disabled="!cartLines.length" @click="openCheckout">Checkout</button></div></div>
        </aside>
      </div>
    </main>

    <div v-if="editorOpen" class="fixed inset-0 z-[500] overflow-y-auto bg-espresso/65 p-4 backdrop-blur-sm sm:p-8" @click.self="closeEditor">
      <form class="mx-auto my-6 w-full max-w-3xl rounded-[28px] bg-cream-soft p-6 shadow-[0_40px_90px_-35px_rgba(20,11,7,.75)] sm:p-9" @submit.prevent="saveProduct"><div class="flex items-start justify-between gap-4"><div><span class="text-[.7rem] font-bold uppercase tracking-[.2em] text-peach-deep">Product management</span><h2 class="mt-2 font-display text-3xl text-espresso">{{ editingId ? 'Edit a scent' : 'Add a scent' }}</h2></div><button type="button" class="flex h-9 w-9 items-center justify-center rounded-full border border-espresso/[.18] text-xl text-espresso transition hover:bg-espresso hover:text-cream-soft" aria-label="Close product editor" @click="closeEditor">×</button></div><div class="mt-8 grid gap-5 sm:grid-cols-2"><label class="grid gap-2 text-sm font-bold text-espresso">Name<input v-model.trim="draft.name" required class="rounded-xl border border-espresso/[.18] bg-white/60 px-4 py-3 font-normal outline-none transition focus:border-peach-deep" placeholder="Midnight Saffron" /></label><label class="grid gap-2 text-sm font-bold text-espresso">Price<input v-model.trim="draft.price" required inputmode="decimal" class="rounded-xl border border-espresso/[.18] bg-white/60 px-4 py-3 font-normal outline-none transition focus:border-peach-deep" placeholder="148" /></label><label class="grid gap-2 text-sm font-bold text-espresso">Mood<input v-model.trim="draft.mood" required class="rounded-xl border border-espresso/[.18] bg-white/60 px-4 py-3 font-normal outline-none transition focus:border-peach-deep" placeholder="Evening" /></label><label class="grid gap-2 text-sm font-bold text-espresso">Effect<input v-model.trim="draft.effect" required class="rounded-xl border border-espresso/[.18] bg-white/60 px-4 py-3 font-normal outline-none transition focus:border-peach-deep" placeholder="A candlelit entrance." /></label><label class="grid gap-2 text-sm font-bold text-espresso">Top notes<input v-model.trim="draft.top" required class="rounded-xl border border-espresso/[.18] bg-white/60 px-4 py-3 font-normal outline-none transition focus:border-peach-deep" placeholder="saffron, bergamot" /></label><label class="grid gap-2 text-sm font-bold text-espresso">Heart notes<input v-model.trim="draft.heart" required class="rounded-xl border border-espresso/[.18] bg-white/60 px-4 py-3 font-normal outline-none transition focus:border-peach-deep" placeholder="rose, incense" /></label><label class="grid gap-2 text-sm font-bold text-espresso sm:col-span-2">Base notes<input v-model.trim="draft.base" required class="rounded-xl border border-espresso/[.18] bg-white/60 px-4 py-3 font-normal outline-none transition focus:border-peach-deep" placeholder="sandalwood, dark musk" /></label><label class="grid gap-2 text-sm font-bold text-espresso sm:col-span-2">Card gradient<input v-model.trim="draft.gradient" required class="rounded-xl border border-espresso/[.18] bg-white/60 px-4 py-3 font-mono text-xs font-normal outline-none transition focus:border-peach-deep" /></label><label class="flex items-center justify-between gap-4 rounded-xl border border-espresso/[.18] bg-white/60 px-4 py-3 text-sm font-bold text-espresso">Bottle color<input v-model="draft.bottle" type="color" class="h-8 w-12 cursor-pointer rounded border-0 bg-transparent" /></label><label class="flex items-center justify-between gap-4 rounded-xl border border-espresso/[.18] bg-white/60 px-4 py-3 text-sm font-bold text-espresso">Cap color<input v-model="draft.cap" type="color" class="h-8 w-12 cursor-pointer rounded border-0 bg-transparent" /></label></div><div class="mt-8 flex flex-col-reverse justify-end gap-3 sm:flex-row"><button type="button" class="rounded-full border border-espresso/[.2] px-6 py-3 text-sm font-bold text-espresso transition hover:bg-cream-deep" @click="closeEditor">Cancel</button><button type="submit" class="rounded-full bg-espresso px-6 py-3 text-sm font-bold text-cream-soft transition hover:bg-coffee">{{ editingId ? 'Save changes' : 'Add to collection' }}</button></div></form>
    </div>

    <div v-if="checkoutOpen" class="fixed inset-0 z-[500] overflow-y-auto bg-espresso/65 p-4 backdrop-blur-sm sm:p-8" @click.self="checkoutOpen = false">
      <section role="dialog" aria-modal="true" aria-labelledby="checkout-title" class="mx-auto my-6 w-full max-w-xl rounded-[28px] bg-cream-soft p-6 shadow-[0_40px_90px_-35px_rgba(20,11,7,.75)] sm:p-9"><div class="flex items-start justify-between gap-4"><div><span class="text-[.7rem] font-bold uppercase tracking-[.2em] text-peach-deep">Private order</span><h2 id="checkout-title" class="mt-2 font-display text-3xl text-espresso">{{ checkoutComplete ? 'It is on its way.' : 'Checkout' }}</h2></div><button type="button" class="flex h-9 w-9 items-center justify-center rounded-full border border-espresso/[.18] text-xl text-espresso transition hover:bg-espresso hover:text-cream-soft" aria-label="Close checkout" @click="checkoutOpen = false">×</button></div><div v-if="checkoutComplete" class="mt-8 rounded-2xl bg-cream-deep p-6"><p class="font-display text-2xl text-espresso">Thank you, {{ checkoutDetails.name || 'friend' }}.</p><p class="mt-3 text-espresso/70">Your order has been confirmed. A delivery note will be sent to {{ checkoutDetails.email }}.</p><button type="button" class="mt-6 rounded-full bg-espresso px-5 py-3 text-sm font-bold text-cream-soft transition hover:bg-coffee" @click="checkoutOpen = false">Back to collection</button></div><form v-else class="mt-8 grid gap-5" @submit.prevent="completeCheckout"><div class="rounded-2xl bg-espresso p-5 text-cream-soft"><div v-for="line in cartLines" :key="line.product.id" class="flex justify-between gap-4 py-2 text-sm"><span>{{ line.quantity }} × {{ line.product.name }}</span><strong>{{ formatPrice(priceToNumber(line.product.price) * line.quantity) }}</strong></div><div class="mt-3 flex justify-between border-t border-cream-soft/[.18] pt-4 font-display text-xl"><span>Total</span><strong>{{ formatPrice(subtotal) }}</strong></div></div><label class="grid gap-2 text-sm font-bold text-espresso">Full name<input v-model.trim="checkoutDetails.name" required class="rounded-xl border border-espresso/[.18] bg-white/60 px-4 py-3 font-normal outline-none transition focus:border-peach-deep" /></label><label class="grid gap-2 text-sm font-bold text-espresso">Email<input v-model.trim="checkoutDetails.email" required type="email" class="rounded-xl border border-espresso/[.18] bg-white/60 px-4 py-3 font-normal outline-none transition focus:border-peach-deep" /></label><label class="grid gap-2 text-sm font-bold text-espresso">Delivery address<textarea v-model.trim="checkoutDetails.address" required rows="3" class="resize-y rounded-xl border border-espresso/[.18] bg-white/60 px-4 py-3 font-normal outline-none transition focus:border-peach-deep" placeholder="Street, city, postal code" /></label><button type="submit" class="mt-2 rounded-full bg-espresso px-6 py-3.5 text-sm font-bold text-cream-soft transition hover:bg-coffee">Place order · {{ formatPrice(subtotal) }}</button></form></section>
    </div>
  </div>
</template>
