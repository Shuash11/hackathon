<script setup lang="ts">
import { apiErrorMessage, formatCompactCurrency, formatCurrency } from '~/utils/dashboard'

definePageMeta({ layout: 'dashboard', middleware: 'auth' })
useHead({ title: 'Dashboard | Scentico' })

const { getAnalytics, getCategories } = useDashboardApi()
const { data: overview, status, error, refresh } = await useAsyncData(
  'dashboard-overview',
  async () => {
    const [analytics, categories] = await Promise.all([getAnalytics(), getCategories()])
    return { analytics, categories }
  },
)

const loading = computed(() => status.value === 'pending')
const errorMessage = computed(() => apiErrorMessage(error.value, 'Check the API connection and try again.'))
</script>

<template>
  <div>
    <header class="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p class="text-[10px] font-bold uppercase tracking-[0.22em] text-atelier-moss">Daily brief</p>
        <h1 class="mt-2 max-w-3xl font-display text-4xl leading-tight sm:text-5xl">Your atelier, at a glance.</h1>
        <p class="mt-3 max-w-2xl text-sm leading-6 text-atelier-ink/55 sm:text-base">Track every collection, order, and top-performing fragrance from one focused workspace.</p>
      </div>
      <NuxtLink to="/dashboard/orders" class="inline-flex w-fit items-center gap-2 rounded-xl bg-atelier-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-atelier-moss">
        Manage orders <DashboardIcon name="arrow" class="h-4 w-4" />
      </NuxtLink>
    </header>

    <DashboardError v-if="error && !loading" class="mt-8" :message="errorMessage" @retry="refresh" />

    <template v-else-if="loading || !overview">
      <div class="mt-8 grid animate-pulse gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div v-for="index in 4" :key="index" class="h-40 rounded-2xl bg-atelier-line/60" />
      </div>
      <div class="mt-8 grid animate-pulse gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <div class="h-96 rounded-2xl bg-atelier-line/60" />
        <div class="h-96 rounded-2xl bg-atelier-line/60" />
      </div>
    </template>

    <template v-else>
      <section aria-label="Business summary" class="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Products" :value="overview.analytics.total_products" detail="Across four collections" icon="products" />
        <StatCard label="All orders" :value="overview.analytics.total_orders" :detail="`${overview.analytics.orders_this_month} received this month`" icon="orders" />
        <StatCard label="Total revenue" :value="formatCompactCurrency(overview.analytics.total_revenue)" detail="Excludes cancelled orders" icon="revenue" accent />
        <StatCard label="Monthly revenue" :value="formatCompactCurrency(overview.analytics.revenue_this_month)" detail="Current calendar month" icon="trend" />
      </section>

      <section aria-labelledby="collections-heading" class="mt-10">
        <div class="mb-5 flex items-end justify-between gap-4">
          <div>
            <p class="text-[10px] font-bold uppercase tracking-[0.2em] text-atelier-moss">Inventory lens</p>
            <h2 id="collections-heading" class="mt-2 font-display text-3xl">Shop by collection</h2>
          </div>
          <p class="hidden text-xs text-atelier-ink/45 sm:block">Select a collection to view its products</p>
        </div>
        <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <CategoryCard v-for="category in overview.categories" :key="category.id" :category="category" />
        </div>
      </section>

      <section aria-label="Sales analysis" class="mt-8 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <CategoryBreakdownChart :data="overview.analytics.orders_by_category" />
        <BestSellersList :products="overview.analytics.best_sellers" />
      </section>

      <section aria-label="Order activity" class="mt-8 grid gap-6 2xl:grid-cols-[1fr_19rem]">
        <RecentOrdersList :orders="overview.analytics.recent_orders" />
        <article class="overflow-hidden rounded-2xl border border-atelier-line bg-atelier-ink p-5 text-white sm:p-6">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">Inventory watch</p>
              <h2 class="mt-2 font-display text-2xl">Low stock</h2>
            </div>
            <span class="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-amber-300"><DashboardIcon name="alert" class="h-5 w-5" /></span>
          </div>
          <ul v-if="overview.analytics.low_stock.length" class="mt-6 divide-y divide-white/10">
            <li v-for="product in overview.analytics.low_stock" :key="product.id" class="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
              <div class="min-w-0">
                <p class="truncate text-sm font-semibold">{{ product.name }}</p>
                <p class="mt-0.5 text-xs text-white/40">{{ product.category }}</p>
              </div>
              <span class="rounded-full bg-white/10 px-2.5 py-1 text-xs font-semibold text-amber-200">{{ product.stock }} left</span>
            </li>
          </ul>
          <div v-else class="mt-6 rounded-xl border border-white/10 bg-white/5 p-4">
            <p class="text-sm font-semibold">Inventory looks healthy</p>
            <p class="mt-1 text-xs leading-5 text-white/45">No products are at or below the five-unit threshold.</p>
          </div>
          <div class="mt-6 border-t border-white/10 pt-5">
            <p class="text-[10px] uppercase tracking-[0.14em] text-white/35">Booked revenue</p>
            <p class="mt-2 font-display text-2xl">{{ formatCurrency(overview.analytics.total_revenue) }}</p>
          </div>
        </article>
      </section>
    </template>
  </div>
</template>
