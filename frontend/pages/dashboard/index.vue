<script setup lang="ts">
import type { CategorySummary, ProductSummary } from '~/types/dashboard'

definePageMeta({ layout: 'dashboard', middleware: 'auth' })
useHead({ title: 'Scentico' })

const { getCategories, getProducts } = useDashboardApi()
const { auth } = useAuth()
const isAdmin = computed(() => auth.user?.role === 'admin')
const selectedCategory = ref('')

const { data: categories } = await useAsyncData('categories', () => getCategories())
const { data: products, status, error, refresh } = await useAsyncData(
  'products',
  () => getProducts(selectedCategory.value || undefined),
  { watch: [selectedCategory] },
)

const loading = computed(() => status.value === 'pending')
</script>

<template>
  <div>
    <header class="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p class="text-[10px] font-bold uppercase tracking-[0.22em] text-atelier-moss">Scentico</p>
        <h1 class="mt-2 font-display text-4xl leading-tight sm:text-5xl">Our fragrances</h1>
        <p class="mt-3 max-w-2xl text-sm leading-6 text-atelier-ink/55 sm:text-base">Discover our carefully curated collection of small-batch fragrances, blended slowly in warm tones.</p>
      </div>
      <NuxtLink to="/dashboard/orders" class="inline-flex w-fit items-center gap-2 rounded-xl bg-atelier-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-atelier-moss">
        {{ isAdmin ? 'Customer orders' : 'My orders' }} <DashboardIcon name="arrow" class="h-4 w-4" />
      </NuxtLink>
    </header>

    <DashboardError v-if="error && !loading" class="mt-8" message="Could not load products. Check the API connection and try again." @retry="refresh" />

    <section v-if="categories && categories.length" aria-label="Collections" class="mt-8">
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
          {{ cat.name }} ({{ cat.product_count }})
        </button>
      </div>
    </section>

    <template v-if="loading">
      <div class="mt-8 grid animate-pulse gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <div v-for="index in 8" :key="index" class="h-64 rounded-2xl bg-atelier-line/60" />
      </div>
    </template>

    <section v-else-if="products && products.length" aria-label="Products" class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <article
        v-for="product in products"
        :key="product.id"
        class="group overflow-hidden rounded-2xl border border-atelier-line bg-white transition hover:shadow-lg"
      >
        <div class="aspect-square overflow-hidden bg-gradient-to-br from-atelier-cream to-atelier-warm/30">
          <img
            v-if="product.image"
            :src="product.image"
            :alt="product.name"
            class="h-full w-full object-cover transition group-hover:scale-105"
          />
          <div v-else class="flex h-full items-center justify-center">
            <span class="text-5xl opacity-20">&#x2618;</span>
          </div>
        </div>
        <div class="p-4">
          <p class="text-[10px] font-bold uppercase tracking-[0.2em] text-atelier-moss">{{ product.category_name }}</p>
          <h3 class="mt-1 font-display text-xl">{{ product.name }}</h3>
          <p v-if="product.scent_summary" class="mt-2 line-clamp-2 text-xs leading-5 text-atelier-ink/50">{{ product.scent_summary }}</p>
          <div class="mt-4 flex items-end justify-between">
            <p class="font-display text-2xl">&#8377;{{ Number(product.price).toFixed(0) }}</p>
            <span
              class="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider"
              :class="product.stock > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'"
            >
              {{ product.stock > 0 ? 'In stock' : 'Sold out' }}
            </span>
          </div>
        </div>
      </article>
    </section>

    <div v-else-if="!loading" class="mt-16 text-center">
      <p class="text-sm text-atelier-ink/45">No products available yet.</p>
    </div>
  </div>
</template>
