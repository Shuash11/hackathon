<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' })
useHead({ title: 'Products — Scentico Admin' })

type AccentKey = 'amber' | 'emerald' | 'sky' | 'violet' | 'rose'

interface ProductLocal {
  id: number
  name: string
  category: string
  price: number
  stock: number
  description: string
  image: string
  accent: AccentKey
}

const accents: Record<AccentKey, { pill: string; tint: string; ring: string; dot: string; label: string }> = {
  amber: { pill: 'bg-amber-50 text-amber-700 border-amber-100', tint: 'from-amber-50 to-white', ring: 'hover:border-amber-200', dot: 'bg-amber-500', label: 'Amber Noir' },
  emerald: { pill: 'bg-emerald-50 text-emerald-700 border-emerald-100', tint: 'from-emerald-50 to-white', ring: 'hover:border-emerald-200', dot: 'bg-emerald-500', label: 'Cedar Veil' },
  sky: { pill: 'bg-sky-50 text-sky-700 border-sky-100', tint: 'from-sky-50 to-white', ring: 'hover:border-sky-200', dot: 'bg-sky-500', label: 'Glacé Noir' },
  violet: { pill: 'bg-violet-50 text-violet-700 border-violet-100', tint: 'from-violet-50 to-white', ring: 'hover:border-violet-200', dot: 'bg-violet-500', label: 'Smoked Vanilla' },
  rose: { pill: 'bg-rose-50 text-rose-700 border-rose-100', tint: 'from-rose-50 to-white', ring: 'hover:border-rose-200', dot: 'bg-rose-500', label: 'Velvet Rose' },
}

const products = ref<ProductLocal[]>([
  { id: 1, name: 'Amber Noir', category: 'Woody', price: 289, stock: 24, description: 'Dark amber resin wrapped in smoked oud and warm vanilla.', image: '/scentico/amber-noir.webp', accent: 'amber' },
  { id: 2, name: 'Cedar Veil', category: 'Fresh', price: 259, stock: 41, description: 'White cedar and sea salt veiled in quiet vetiver mist.', image: '/scentico/cedar-veil.webp', accent: 'emerald' },
  { id: 3, name: 'Glacé Noir', category: 'Fresh', price: 299, stock: 0, description: 'Cold glacier air over black currant and frosted musk.', image: '/scentico/asset1.webp', accent: 'sky' },
  { id: 4, name: 'Smoked Vanilla', category: 'Sweet', price: 275, stock: 18, description: 'Madagascar vanilla slow-smoked over tonka embers.', image: '/scentico/smoke-vanilla.webp', accent: 'violet' },
  { id: 5, name: 'Velvet Rose', category: 'Floral', price: 310, stock: 33, description: 'Midnight Damask roses pressed into velvet oud cream.', image: '/scentico/velvet-rose.webp', accent: 'rose' },
])

const searchQuery = ref('')
const activeAccent = ref<AccentKey | ''>('')

const filtered = computed(() => {
  let list = products.value
  if (activeAccent.value) list = list.filter(p => p.accent === activeAccent.value)
  const q = searchQuery.value.trim().toLowerCase()
  if (q) list = list.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))
  return list
})

const totalStock = computed(() => products.value.reduce((sum, p) => sum + p.stock, 0))
const soldOutCount = computed(() => products.value.filter(p => p.stock === 0).length)

const showAddModal = ref(false)
const form = reactive({
  name: '',
  category: '',
  price: '',
  stock: '',
  description: '',
  accent: 'amber' as AccentKey,
})
const formError = ref('')
const formImage = ref('')
const formImageName = ref('')

function onImagePick(event: Event): void {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  formImageName.value = file.name
  const reader = new FileReader()
  reader.onload = () => { formImage.value = String(reader.result) }
  reader.readAsDataURL(file)
}

function clearImage(): void {
  formImage.value = ''
  formImageName.value = ''
}

function openAdd(): void {
  Object.assign(form, { name: '', category: '', price: '', stock: '', description: '', accent: 'amber' })
  formError.value = ''
  clearImage()
  showAddModal.value = true
}

function submitAdd(): void {
  if (!form.name.trim() || !form.price || !form.stock) {
    formError.value = 'Name, price, and stock are required.'
    return
  }
  products.value.unshift({
    id: Date.now(),
    name: form.name.trim(),
    category: accents[form.accent].label,
    price: Number(form.price),
    stock: Number(form.stock),
    description: form.description.trim(),
    image: formImage.value || `/scentico/${form.accent === 'sky' ? 'asset1' : form.accent === 'amber' ? 'amber-noir' : form.accent === 'emerald' ? 'cedar-veil' : form.accent === 'violet' ? 'smoke-vanilla' : 'velvet-rose'}.webp`,
    accent: form.accent,
  })
  showAddModal.value = false
}

function removeProduct(id: number): void {
  products.value = products.value.filter(p => p.id !== id)
}

function stockBadge(stock: number): { text: string; cls: string } {
  if (stock === 0) return { text: 'Sold out', cls: 'bg-rose-50 text-rose-600 border-rose-100' }
  if (stock < 20) return { text: `Low · ${stock}`, cls: 'bg-amber-50 text-amber-700 border-amber-100' }
  return { text: `In stock · ${stock}`, cls: 'bg-emerald-50 text-emerald-700 border-emerald-100' }
}
</script>

<template>
  <div>
    <header class="flex flex-col gap-4 pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p class="text-xs font-bold uppercase tracking-[0.2em] text-[#4056E8]">Catalog</p>
        <h1 class="mt-2 font-display text-3xl font-semibold leading-tight text-[#14161B] sm:text-4xl">Products</h1>
        <p class="mt-2 text-sm leading-6 text-slate-500">Every fragrance in the lineup. Add products locally — changes stay on this device.</p>
      </div>
      <button type="button" class="inline-flex w-fit items-center gap-2 rounded-xl bg-gradient-to-br from-[#5B79FF] to-[#3D55F0] px-5 py-3 text-sm font-bold text-white shadow-[0_10px_24px_-10px_rgba(64,86,232,.6)] transition hover:brightness-105" @click="openAdd">
        + Add product
      </button>
    </header>

    <!-- Mini stats -->
    <section class="mb-5 grid grid-cols-3 gap-4">
      <div class="dash-card p-4">
        <p class="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">Products</p>
        <p class="mt-1 font-display text-xl font-semibold leading-none text-[#14161B]">{{ products.length }}</p>
      </div>
      <div class="dash-card p-4">
        <p class="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">Units in stock</p>
        <p class="mt-1 font-display text-xl font-semibold leading-none text-[#14161B]">{{ totalStock }}</p>
      </div>
      <div class="dash-card p-4">
        <p class="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">Sold out</p>
        <p class="mt-1 font-display text-xl font-semibold leading-none" :class="soldOutCount ? 'text-rose-600' : 'text-[#14161B]'">{{ soldOutCount }}</p>
      </div>
    </section>

    <!-- Search + filters -->
    <div class="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div class="relative w-full sm:max-w-xs">
        <input v-model="searchQuery" type="text" placeholder="Search fragrances..." class="w-full rounded-xl border border-[#E9ECF2] bg-white px-4 py-2.5 pl-10 text-sm text-[#14161B] placeholder:text-slate-400 focus:border-[#4056E8] focus:outline-none focus:ring-2 focus:ring-[#4056E8]/15" />
        <DashboardIcon name="search" class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      </div>
      <div class="flex flex-wrap gap-2">
        <button type="button" class="rounded-full border px-3.5 py-1.5 text-xs font-semibold transition" :class="activeAccent === '' ? 'border-[#4056E8] bg-[#4056E8] text-white' : 'border-[#E9ECF2] bg-white text-slate-600 hover:text-[#14161B]'" @click="activeAccent = ''">All</button>
        <button v-for="(v, key) in accents" :key="key" type="button" class="inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition" :class="activeAccent === key ? v.pill : 'border-[#E9ECF2] bg-white text-slate-600 hover:text-[#14161B]'" @click="activeAccent = activeAccent === key ? '' : (key as AccentKey)">
          <span class="h-1.5 w-1.5 rounded-full" :class="v.dot" />{{ v.label }}
        </button>
      </div>
    </div>

    <!-- Product grid -->
    <TransitionGroup tag="section" name="grid" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <article v-for="p in filtered" :key="p.id" class="group relative overflow-hidden rounded-2xl border border-[#E9ECF2] bg-white shadow-[0_1px_2px_rgba(23,26,63,.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_36px_-16px_rgba(23,26,63,.16)]" :class="accents[p.accent].ring">
        <div :class="`aspect-square overflow-hidden bg-gradient-to-b ${accents[p.accent].tint}`">
          <img :src="p.image" :alt="p.name" class="h-full w-full object-contain p-5 drop-shadow-[0_16px_20px_rgba(23,26,63,.16)] transition-transform duration-300 group-hover:scale-105" draggable="false" />
          <span class="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur" :class="accents[p.accent].pill">
            <span class="h-1.5 w-1.5 rounded-full" :class="accents[p.accent].dot" />{{ p.category }}
          </span>
          <span class="absolute right-3 top-3 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide" :class="stockBadge(p.stock).cls">{{ stockBadge(p.stock).text }}</span>
          <button type="button" aria-label="Remove product" class="absolute bottom-3 right-3 grid h-8 w-8 place-items-center rounded-lg border border-slate-200 bg-white/90 text-slate-400 opacity-0 shadow-sm backdrop-blur transition group-hover:opacity-100 hover:border-rose-200 hover:text-rose-600" @click="removeProduct(p.id)">
            <DashboardIcon name="trash" class="h-3.5 w-3.5" />
          </button>
        </div>
        <div class="border-t border-[#F1F3F7] p-4">
          <h3 class="font-display text-lg font-semibold leading-tight text-[#14161B]">{{ p.name }}</h3>
          <p class="mt-1 line-clamp-2 min-h-8 text-[13px] leading-5 text-slate-500">{{ p.description }}</p>
          <div class="mt-3 flex items-baseline justify-between">
            <p class="font-display text-xl font-semibold text-[#14161B]">₱{{ p.price.toLocaleString() }}</p>
            <span class="text-[10px] font-semibold uppercase tracking-wider text-slate-400">per bottle</span>
          </div>
        </div>
      </article>
    </TransitionGroup>

    <div v-if="!filtered.length" class="dash-card mt-4 p-12 text-center">
      <span class="mx-auto block h-12 w-12 rounded-2xl bg-slate-100" />
      <p class="mt-3 font-display text-lg font-semibold text-[#14161B]">Nothing here yet</p>
      <p class="mt-1 text-sm text-slate-500">Try a different search or add a new product.</p>
    </div>

    <!-- Add product modal -->
    <Teleport to="body">
      <div class="fixed inset-0 z-[400] flex items-center justify-center bg-[rgba(23,26,43,.5)] p-4 backdrop-blur-md transition-opacity duration-300" :class="showAddModal ? 'opacity-100' : 'pointer-events-none opacity-0'" @click.self="showAddModal = false">
        <div role="dialog" aria-modal="true" aria-labelledby="add-product-title" class="nice-scroll max-h-[92vh] w-full max-w-[480px] overflow-y-auto rounded-2xl border border-[#E9ECF2] bg-white p-7 shadow-[0_32px_80px_-30px_rgba(23,26,63,.45)] transition-transform duration-300" :class="showAddModal ? 'translate-y-0 scale-100' : 'translate-y-4 scale-[.97]'">
          <div class="flex items-start justify-between">
            <div>
              <h2 id="add-product-title" class="font-display text-[1.45rem] font-semibold text-[#14161B]">Add product</h2>
              <p class="mt-1 text-sm text-slate-500">Saved locally for this demo session.</p>
            </div>
            <button type="button" aria-label="Close" class="grid h-9 w-9 place-items-center rounded-lg border border-[#E9ECF2] text-slate-500 transition hover:bg-slate-50 hover:text-[#14161B]" @click="showAddModal = false">
              <DashboardIcon name="close" class="h-4 w-4" />
            </button>
          </div>

          <div class="mt-6 space-y-5">
            <label class="block">
              <span class="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Fragrance line</span>
              <div class="flex flex-wrap gap-2">
                <button v-for="(v, key) in accents" :key="key" type="button" class="inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-[13px] font-semibold transition" :class="form.accent === key ? v.pill : 'border-[#E9ECF2] text-slate-600 hover:text-[#14161B]'" @click="form.accent = key as AccentKey">
                  <span class="h-1.5 w-1.5 rounded-full" :class="v.dot" />{{ v.label }}
                </button>
              </div>
            </label>

            <!-- Local image upload -->
            <div>
              <span class="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Product image <span class="font-medium normal-case tracking-normal text-slate-400">(from your device)</span></span>
              <label v-if="!formImage" class="flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-[#DFE4EE] bg-[#F8F9FD] px-4 py-6 text-center transition hover:border-[#4056E8]/60 hover:bg-[#F4F6FF]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6 text-slate-400"><rect x="3" y="3" width="18" height="18" rx="3" /><circle cx="9" cy="9" r="2" /><path d="m21 15-4.5-4.5L7 20" /></svg>
                <span class="text-sm font-semibold text-slate-600">Click to upload a photo</span>
                <span class="text-xs text-slate-400">PNG or JPG · stays on this device only</span>
                <input type="file" accept="image/*" class="hidden" @change="onImagePick" />
              </label>
              <div v-else class="flex items-center gap-3 rounded-xl border border-[#E9ECF2] bg-[#F8F9FD] p-3">
                <img :src="formImage" alt="Selected product preview" class="h-16 w-16 rounded-lg border border-[#E9ECF2] bg-white object-contain p-1" />
                <div class="min-w-0 flex-1">
                  <p class="truncate text-sm font-semibold text-[#14161B]">{{ formImageName }}</p>
                  <p class="text-xs font-semibold text-emerald-600">Ready — this image will be used.</p>
                </div>
                <button type="button" class="rounded-lg border border-[#E9ECF2] bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-rose-200 hover:text-rose-600" @click="clearImage">Remove</button>
              </div>
            </div>

            <label class="block">
              <span class="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Name</span>
              <input v-model="form.name" type="text" placeholder="e.g. Amber Noir Intense" class="w-full rounded-xl border border-[#E9ECF2] bg-white px-4 py-3 text-[15px] text-[#14161B] placeholder:text-slate-400 focus:border-[#4056E8] focus:outline-none focus:ring-2 focus:ring-[#4056E8]/15" />
            </label>

            <div class="grid grid-cols-2 gap-3">
              <label class="block">
                <span class="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Price (₱)</span>
                <input v-model="form.price" type="number" min="0" placeholder="0" class="w-full rounded-xl border border-[#E9ECF2] bg-white px-4 py-3 text-[15px] text-[#14161B] placeholder:text-slate-400 focus:border-[#4056E8] focus:outline-none focus:ring-2 focus:ring-[#4056E8]/15" />
              </label>
              <label class="block">
                <span class="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Stock</span>
                <input v-model="form.stock" type="number" min="0" placeholder="0" class="w-full rounded-xl border border-[#E9ECF2] bg-white px-4 py-3 text-[15px] text-[#14161B] placeholder:text-slate-400 focus:border-[#4056E8] focus:outline-none focus:ring-2 focus:ring-[#4056E8]/15" />
              </label>
            </div>

            <label class="block">
              <span class="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Description <span class="font-medium normal-case tracking-normal text-slate-400">(optional)</span></span>
              <textarea v-model="form.description" rows="2" placeholder="Short scent story..." class="w-full resize-none rounded-xl border border-[#E9ECF2] bg-white px-4 py-3 text-[15px] text-[#14161B] placeholder:text-slate-400 focus:border-[#4056E8] focus:outline-none focus:ring-2 focus:ring-[#4056E8]/15" />
            </label>

            <p v-if="formError" role="alert" class="text-[13px] font-semibold text-rose-600">{{ formError }}</p>

            <button type="button" class="w-full rounded-xl bg-gradient-to-br from-[#5B79FF] to-[#3D55F0] py-3.5 text-[15px] font-bold text-white shadow-[0_10px_24px_-10px_rgba(64,86,232,.55)] transition hover:brightness-105" @click="submitAdd">Add to catalog</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.dash-card {
  border-radius: 16px;
  border: 1px solid #E9ECF2;
  background: #fff;
  box-shadow: 0 1px 2px rgba(23, 26, 63, .04);
}
.grid-enter-active, .grid-leave-active { transition: all .3s ease; }
.grid-enter-from { opacity: 0; transform: translateY(12px); }
.grid-leave-to { opacity: 0; transform: scale(.96); }
.grid-leave-active { position: absolute; }
.grid-move { transition: transform .3s ease; }
</style>