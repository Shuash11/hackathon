<script setup lang="ts">
definePageMeta({ layout: 'user-dashboard', middleware: 'auth' })
useHead({ title: 'Shop — Scentico' })

const { auth } = useAuth()

// Admins land on the AI chat workspace instead of the storefront
onMounted(() => {
  if (auth.user?.role === 'admin') void navigateTo('/dashboard/chat', { replace: true })
})

type AccentKey = 'rose' | 'amber' | 'emerald' | 'violet' | 'sky'
interface ShopProduct {
  id: number
  name: string
  category: string
  price: number
  oldPrice: number | null
  sold: number
  rating: string
  image: string
  accent: AccentKey
}

const accents: Record<AccentKey, { tint: string; tag: string; ring: string }> = {
  rose: { tint: 'from-rose-50 to-white', tag: 'bg-[#FBEFF2] text-[#8A1538]', ring: 'hover:border-[#8A1538]/30' },
  amber: { tint: 'from-amber-50 to-white', tag: 'bg-amber-50 text-amber-700', ring: 'hover:border-amber-300' },
  emerald: { tint: 'from-emerald-50 to-white', tag: 'bg-emerald-50 text-emerald-700', ring: 'hover:border-emerald-300' },
  violet: { tint: 'from-violet-50 to-white', tag: 'bg-violet-50 text-violet-700', ring: 'hover:border-violet-300' },
  sky: { tint: 'from-sky-50 to-white', tag: 'bg-sky-50 text-sky-700', ring: 'hover:border-sky-300' },
}

const products: ShopProduct[] = [
  { id: 1, name: 'Velvet Rose', category: 'Floral', price: 349, oldPrice: 399, sold: 328, rating: '4.9', image: '/scentico/velvet-rose.webp', accent: 'rose' },
  { id: 2, name: 'Amber Noir', category: 'Woody', price: 289, oldPrice: 339, sold: 214, rating: '4.8', image: '/scentico/amber-noir.webp', accent: 'amber' },
  { id: 3, name: 'Cedar Veil', category: 'Fresh', price: 259, oldPrice: null, sold: 176, rating: '4.7', image: '/scentico/cedar-veil.webp', accent: 'emerald' },
  { id: 4, name: 'Smoked Vanilla', category: 'Sweet', price: 275, oldPrice: 315, sold: 259, rating: '4.9', image: '/scentico/smoke-vanilla.webp', accent: 'violet' },
  { id: 5, name: 'Glacé Noir', category: 'Fresh', price: 299, oldPrice: null, sold: 132, rating: '4.8', image: '/scentico/asset1.webp', accent: 'sky' },
]

const categories = ['All', 'Floral', 'Woody', 'Fresh', 'Sweet'] as const
const activeCategory = ref<string>('All')
const filtered = computed(() => activeCategory.value === 'All' ? products : products.filter(p => p.category === activeCategory.value))

// Flash-sale countdown
const remaining = ref(5 * 3600 + 24 * 60 + 59)
const timer = setInterval(() => { remaining.value = Math.max(0, remaining.value - 1) }, 1000)
onBeforeUnmount(() => clearInterval(timer))
const hh = computed(() => String(Math.floor(remaining.value / 3600)).padStart(2, '0'))
const mm = computed(() => String(Math.floor((remaining.value % 3600) / 60)).padStart(2, '0'))
const ss = computed(() => String(remaining.value % 60).padStart(2, '0'))

const justAdded = ref('')
let addedTimer: ReturnType<typeof setTimeout> | undefined
interface DialogProduct { key: string; name: string; category: string; price: number; oldPrice: number | null; image: string; rating?: string; sold?: number }
const dialogProduct = ref<DialogProduct | null>(null)
const dialogOpen = ref(false)

function openOrderDialog(product: { id: number; name: string; category: string; price: number; image: string }): void {
  const source = products.find(p => p.id === product.id)
  dialogProduct.value = {
    key: product.name,
    name: product.name,
    category: product.category,
    price: product.price,
    oldPrice: source?.oldPrice ?? null,
    image: product.image,
    rating: source?.rating,
    sold: source?.sold,
  }
  dialogOpen.value = true
}

function quickAddToCart(product: { id: number; name: string; category: string; price: number; image: string }): void {
  addItemToCart({ key: product.name, name: product.name, category: product.category, price: product.price, image: product.image })
  justAdded.value = product.name
  clearTimeout(addedTimer)
  addedTimer = setTimeout(() => { justAdded.value = '' }, 1400)
}

const bundleDialogProduct: DialogProduct = {
  key: 'duo-bundle',
  name: 'Duo Bundle — Velvet Rose + Amber Noir',
  category: 'Bundle',
  price: 529,
  oldPrice: 688,
  image: '/scentico/glacier.webp',
}
function openBundleDialog(): void {
  dialogProduct.value = bundleDialogProduct
  dialogOpen.value = true
}
</script>

<template>
  <div>
    <!-- Hero promo banner · recycled scentico WebM -->
    <section class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#5E0F20] via-[#7A1230] to-[#9E2B47] text-white shadow-[0_20px_50px_-20px_rgba(110,18,38,.55)]">
      <video autoplay muted loop playsinline class="absolute inset-0 h-full w-full object-cover opacity-45" aria-hidden="true">
        <source src="/scentico/velvet-rose-bg.webm" type="video/webm" />
      </video>
      <div class="absolute inset-0 bg-gradient-to-r from-[#4A0B18]/90 via-[#6E1226]/55 to-transparent" aria-hidden="true" />

      <div class="relative grid gap-6 p-7 sm:p-10 md:grid-cols-[1.3fr_1fr] md:items-center">
        <div>
          <span class="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] backdrop-blur">
            <span class="relative flex h-2 w-2"><span class="absolute h-full w-full animate-ping rounded-full bg-amber-300 opacity-70" /><span class="relative h-2 w-2 rounded-full bg-amber-300" /></span>
            Mega bundle · flash sale
          </span>
          <h1 class="mt-4 font-display text-[2.1rem] font-bold leading-[1.05] sm:text-5xl">
            2 perfumes
            <span class="block bg-gradient-to-r from-amber-200 via-white to-amber-200 bg-clip-text text-transparent [background-size:200%_100%] motion-safe:animate-[shine_3s_linear_infinite]">for only ₱529</span>
          </h1>
          <p class="mt-3 max-w-md text-sm leading-6 text-white/80">Pick any two signature scents — Velvet Rose, Amber Noir and more. Free shipping on every bundle today.</p>
          <div class="mt-5 flex flex-wrap items-center gap-3">
            <button type="button" class="rounded-full bg-white px-6 py-3 text-sm font-bold text-[#6E1226] shadow-[0_10px_26px_-8px_rgba(0,0,0,.45)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-8px_rgba(0,0,0,.5)]" @click="openBundleDialog">
              Order the bundle · ₱529
            </button>
            <span class="text-sm font-semibold text-white/70"><s class="opacity-70">₱688</s> — save ₱159</span>
          </div>
        </div>

        <div class="relative mx-auto hidden md:block">
          <div class="absolute -inset-5 rounded-full border-2 border-dashed border-white/25 motion-safe:animate-[spin_24s_linear_infinite]" aria-hidden="true" />
          <div class="grid h-44 w-44 rotate-6 place-items-center rounded-3xl bg-white/10 backdrop-blur-md ring-1 ring-white/30 motion-safe:animate-[floaty_5s_ease-in-out_infinite]">
            <div class="text-center">
              <p class="text-[11px] font-bold uppercase tracking-[0.22em] text-amber-200">Save</p>
              <p class="font-display text-4xl font-bold leading-none">₱159</p>
              <p class="mt-1 text-[11px] font-semibold text-white/70">23% off</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Flash deals strip -->
    <section class="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#F0E2E5] bg-white p-4 shadow-[0_1px_2px_rgba(35,19,24,.04)]">
      <div class="flex items-center gap-3">
        <span class="grid h-9 w-9 place-items-center rounded-xl bg-[#FBEFF2] text-[#8A1538]">
          <svg viewBox="0 0 24 24" fill="currentColor" class="h-5 w-5"><path d="M13 2 4.5 13.5H11l-1 8.5L19.5 10H13l1-8Z" /></svg>
        </span>
        <div>
          <p class="text-sm font-bold text-[#231318]">Flash deals</p>
          <p class="text-xs text-slate-500">Prices snap back at midnight</p>
        </div>
      </div>
      <div class="flex items-center gap-2 text-sm font-semibold text-slate-600">
        <span class="hidden sm:inline">Ends in</span>
        <span class="rounded-lg bg-[#231318] px-2.5 py-1.5 font-mono text-xs font-bold tabular-nums text-white">{{ hh }}</span>:
        <span class="rounded-lg bg-[#231318] px-2.5 py-1.5 font-mono text-xs font-bold tabular-nums text-white">{{ mm }}</span>:
        <span class="rounded-lg bg-[#231318] px-2.5 py-1.5 font-mono text-xs font-bold tabular-nums text-white">{{ ss }}</span>
      </div>
    </section>

    <!-- Category chips -->
    <div class="mt-5 flex flex-wrap gap-2">
      <button
        v-for="c in categories"
        :key="c"
        type="button"
        class="rounded-full border px-4 py-2 text-[13px] font-semibold transition"
        :class="activeCategory === c ? 'border-[#8A1538] bg-[#8A1538] text-white shadow-[0_6px_16px_-6px_rgba(122,25,55,.5)]' : 'border-[#EBE3E5] bg-white text-slate-600 hover:border-[#8A1538]/40 hover:text-[#8A1538]'"
        @click="activeCategory = c"
      >{{ c }}</button>
    </div>

    <!-- Product grid -->
    <TransitionGroup tag="section" name="grid" class="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
      <article
        v-for="p in filtered"
        :key="p.id"
        class="group relative flex flex-col overflow-hidden rounded-2xl border border-[#F0E2E5] bg-white shadow-[0_1px_2px_rgba(35,19,24,.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_38px_-18px_rgba(110,18,38,.25)]"
        :class="accents[p.accent].ring"
      >
        <div :class="`relative aspect-square overflow-hidden bg-gradient-to-b ${accents[p.accent].tint}`">
          <img :src="p.image" :alt="p.name" class="h-full w-full object-contain p-4 drop-shadow-[0_14px_18px_rgba(35,19,24,.14)] transition-transform duration-300 group-hover:scale-105" draggable="false" />
          <span v-if="p.oldPrice" class="absolute left-3 top-3 rounded-md bg-[#8A1538] px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow">-{{ Math.round((1 - p.price / p.oldPrice) * 100) }}%</span>
        </div>
        <div class="flex flex-1 flex-col gap-1.5 border-t border-[#F6EEF0] p-3.5">
          <div class="flex items-center justify-between gap-2">
            <span class="rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide" :class="accents[p.accent].tag">{{ p.category }}</span>
            <span class="text-[11px] font-semibold text-slate-400">★ {{ p.rating }} · {{ p.sold }} sold</span>
          </div>
          <h3 class="font-display text-[15px] font-semibold leading-tight text-[#231318]">{{ p.name }}</h3>
          <div class="mt-auto flex items-baseline gap-2">
            <p class="font-display text-lg font-bold text-[#8A1538]">₱{{ p.price }}</p>
            <s v-if="p.oldPrice" class="text-xs text-slate-400">₱{{ p.oldPrice }}</s>
          </div>
          <button type="button" class="mt-1 w-full rounded-xl bg-gradient-to-br from-[#9E2B47] to-[#6E1226] py-2.5 text-[13px] font-bold text-white shadow-[0_8px_18px_-8px_rgba(110,18,38,.55)] transition hover:brightness-110" @click="openOrderDialog(p)">Order</button>
          <button
            type="button"
            :aria-label="`Add ${p.name} to cart`"
            class="mt-1 w-full rounded-xl border border-[#8A1538]/30 bg-[#FBEFF2] py-2 text-[13px] font-bold text-[#8A1538] transition hover:bg-[#8A1538] hover:text-white"
            @click="quickAddToCart(p)"
          >
            {{ justAdded === p.name ? 'Added to cart ✓' : 'Add to cart' }}
          </button>
        </div>
      </article>
    </TransitionGroup>

    <!-- Order dialog -->
    <ProductOrderDialog v-model="dialogOpen" :product="dialogProduct" />
  </div>
</template>

<style scoped>
.grid-enter-active, .grid-leave-active { transition: all .3s ease; }
.grid-enter-from { opacity: 0; transform: translateY(12px); }
.grid-leave-to { opacity: 0; transform: scale(.96); }
.grid-leave-active { position: absolute; }
.grid-move { transition: transform .3s ease; }
</style>

<style>
@keyframes shine {
  from { background-position: 200% 0; }
  to { background-position: -200% 0; }
}
@keyframes floaty {
  0%, 100% { transform: rotate(6deg) translateY(0); }
  50% { transform: rotate(6deg) translateY(-10px); }
}
</style>