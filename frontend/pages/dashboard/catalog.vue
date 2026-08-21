<script setup lang="ts">
import type { CategorySummary, ProductSummary } from '~/types/dashboard'

definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const { getCategories, getProducts } = useDashboardApi()
const selectedCategory = ref('')
const searchQuery = ref('')

const { data: categories } = await useAsyncData('catalog-categories', () => getCategories())
const { data: products, status, error, refresh } = await useAsyncData(
  'catalog-products',
  () => getProducts(selectedCategory.value || undefined),
  { watch: [selectedCategory] },
)

const loading = computed(() => status.value === 'pending')

const filteredProducts = computed(() => {
  if (!products.value) return []
  if (!searchQuery.value) return products.value
  const q = searchQuery.value.toLowerCase()
  return products.value.filter(p =>
    p.name.toLowerCase().includes(q)
    || p.category_name.toLowerCase().includes(q)
    || p.scent_summary.toLowerCase().includes(q),
  )
})

const formatPrice = (price: string) => Number(price).toLocaleString('en-IN')
</script>

<template>
  <div>
    <header class="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p class="text-[10px] font-bold uppercase tracking-[0.22em] text-atelier-moss">Collection</p>
        <h1 class="mt-2 font-display text-4xl leading-tight sm:text-5xl">All products</h1>
        <p class="mt-3 max-w-2xl text-sm leading-6 text-atelier-ink/55 sm:text-base">Browse every fragrance in the Scentico lineup, organized by collection.</p>
      </div>
    </header>

    <DashboardError v-if="error && !loading" class="mt-8" message="Could not load products." @retry="refresh" />

    <div class="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="flex flex-wrap gap-2">
        <button
          type="button"
          class="rounded-full border px-4 py-2 text-xs font-semibold transition"
          :class="selectedCategory === '' ? 'border-atelier-ink bg-atelier-ink text-white' : 'border-atelier-line bg-white text-atelier-ink/60 hover:border-atelier-ink/30'"
          @click="selectedCategory = ''"
        >
          All
        </button>
        <button
          v-for="cat in categories"
          :key="cat.id"
          type="button"
          class="rounded-full border px-4 py-2 text-xs font-semibold transition"
          :class="selectedCategory === cat.slug ? 'border-atelier-ink bg-atelier-ink text-white' : 'border-atelier-line bg-white text-atelier-ink/60 hover:border-atelier-ink/30'"
          @click="selectedCategory = cat.slug"
        >
          {{ cat.name }}
        </button>
      </div>
      <div class="relative">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search fragrances..."
          class="w-full rounded-xl border border-atelier-line bg-white py-2.5 pl-10 pr-4 text-sm text-atelier-ink placeholder:text-atelier-ink/35 focus:border-atelier-moss focus:outline-none focus:ring-1 focus:ring-atelier-moss sm:w-72"
        />
        <DashboardIcon name="search" class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-atelier-ink/35" />
      </div>
    </div>

    <template v-if="loading">
      <div class="mt-8 grid animate-pulse gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="index in 6" :key="index" class="h-80 rounded-2xl bg-atelier-line/60" />
      </div>
    </template>

    <section v-else-if="filteredProducts.length" aria-label="Product catalog" class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <article
        v-for="product in filteredProducts"
        :key="product.id"
        class="group overflow-hidden rounded-2xl border border-atelier-line bg-white transition hover:shadow-lg"
      >
        <div class="aspect-[4/3] overflow-hidden bg-gradient-to-br from-atelier-cream to-atelier-warm/30">
          <img
            v-if="product.image"
            :src="product.image"
            :alt="product.name"
            class="h-full w-full object-cover transition group-hover:scale-105"
          />
          <div v-else class="flex h-full items-center justify-center">
            <span class="text-6xl opacity-15">&#x2618;</span>
          </div>
        </div>
        <div class="p-5">
          <p class="text-[10px] font-bold uppercase tracking-[0.2em] text-atelier-moss">{{ product.category_name }}</p>
          <h3 class="mt-1 font-display text-xl">{{ product.name }}</h3>
          <p v-if="product.scent_summary" class="mt-2 line-clamp-2 text-xs leading-5 text-atelier-ink/50">{{ product.scent_summary }}</p>
          <div class="mt-4 flex items-end justify-between">
            <p class="font-display text-2xl">&#8377;{{ formatPrice(product.price) }}</p>
            <div class="flex items-center gap-2">
              <span class="text-xs text-atelier-ink/40">{{ product.stock }} in stock</span>
              <span
                class="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider"
                :class="product.stock > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'"
              >
                {{ product.stock > 0 ? 'Available' : 'Sold out' }}
              </span>
            </div>
          </div>
        </div>
      </article>
    </section>

    <div v-else-if="!loading" class="mt-16 text-center">
      <p class="text-sm text-atelier-ink/45">No products found.</p>
    </div>
  </div>
</template>
