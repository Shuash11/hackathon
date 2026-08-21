<script setup lang="ts">
import type { OrderFilters, OrderStatus } from '~/types/dashboard'
import { apiErrorMessage } from '~/utils/dashboard'

definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const { auth } = useAuth()
const isAdmin = computed(() => auth.user?.role === 'admin')
useHead({ title: computed(() => `${isAdmin.value ? 'Customer Orders' : 'My Orders'} | Scentico`) })

const route = useRoute()
const { getOrders } = useDashboardApi()
const validStatuses = new Set<OrderStatus>(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])

function routeString(value: unknown): string {
  return Array.isArray(value) ? String(value[0] ?? '') : typeof value === 'string' ? value : ''
}

const initialStatus = routeString(route.query.status)
const initialPage = Number(routeString(route.query.page))
const draft = reactive({
  search: routeString(route.query.search),
  status: validStatuses.has(initialStatus as OrderStatus) ? initialStatus as OrderStatus : '' as const,
  dateFrom: routeString(route.query.date_from),
  dateTo: routeString(route.query.date_to),
})
const applied = ref({ ...draft })
const page = ref(Number.isInteger(initialPage) && initialPage > 0 ? initialPage : 1)
const pageSize = 10
const filterError = ref('')

const requestFilters = computed<OrderFilters>(() => ({
  ...applied.value,
  page: page.value,
  pageSize,
}))

const { data: orders, status, error, refresh } = await useAsyncData(
  'dashboard-orders',
  () => getOrders(requestFilters.value),
)

const loading = computed(() => status.value === 'pending')
const totalPages = computed(() => Math.max(1, Math.ceil((orders.value?.count ?? 0) / pageSize)))
const errorMessage = computed(() => apiErrorMessage(error.value, 'Orders could not be loaded. Please try again.'))

async function syncRoute(): Promise<void> {
  const query: Record<string, string> = {}
  if (applied.value.search) query.search = applied.value.search
  if (applied.value.status) query.status = applied.value.status
  if (applied.value.dateFrom) query.date_from = applied.value.dateFrom
  if (applied.value.dateTo) query.date_to = applied.value.dateTo
  if (page.value > 1) query.page = String(page.value)
  await navigateTo({ path: '/dashboard/orders', query }, { replace: true })
}

async function applyFilters(): Promise<void> {
  if (draft.dateFrom && draft.dateTo && draft.dateFrom > draft.dateTo) {
    filterError.value = 'The end date must be on or after the start date.'
    return
  }
  filterError.value = ''
  page.value = 1
  applied.value = { ...draft, search: draft.search.trim() }
  await syncRoute()
  await refresh()
}

async function clearFilters(): Promise<void> {
  draft.search = ''
  draft.status = ''
  draft.dateFrom = ''
  draft.dateTo = ''
  await applyFilters()
}

async function changePage(nextPage: number): Promise<void> {
  if (nextPage < 1 || nextPage > totalPages.value || nextPage === page.value) return
  page.value = nextPage
  await syncRoute()
  await refresh()
  if (import.meta.client) window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <div>
    <header class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p class="text-[10px] font-bold uppercase tracking-[0.22em] text-atelier-moss">Order desk</p>
        <h1 class="mt-2 font-display text-4xl sm:text-5xl">{{ isAdmin ? 'Customer orders' : 'My orders' }}</h1>
        <p class="mt-3 text-sm leading-6 text-atelier-ink/55">{{ isAdmin ? 'Search, review, and move every order through fulfillment.' : 'Track the status of your orders.' }}</p>
      </div>
      <div v-if="orders && !error" class="rounded-full border border-atelier-line bg-atelier-cream px-4 py-2 text-xs text-atelier-ink/55">
        <span class="font-bold text-atelier-ink">{{ orders.count }}</span> {{ orders.count === 1 ? 'order' : 'orders' }} found
      </div>
    </header>

    <OrderFilterBar
      class="mt-8"
      :search="draft.search"
      :status="draft.status"
      :date-from="draft.dateFrom"
      :date-to="draft.dateTo"
      :busy="loading"
      @update:search="draft.search = $event"
      @update:status="draft.status = $event"
      @update:date-from="draft.dateFrom = $event"
      @update:date-to="draft.dateTo = $event"
      @apply="applyFilters"
      @clear="clearFilters"
    />
    <p v-if="filterError" class="mt-3 text-sm font-medium text-atelier-clay" role="alert">{{ filterError }}</p>

    <DashboardError v-if="error && !loading" class="mt-6" :message="errorMessage" @retry="refresh" />
    <div v-else-if="loading" class="mt-6 overflow-hidden rounded-2xl border border-atelier-line bg-atelier-cream">
      <div class="h-12 animate-pulse border-b border-atelier-line bg-atelier-line/50" />
      <div v-for="index in 6" :key="index" class="grid animate-pulse grid-cols-5 gap-8 border-b border-atelier-line/60 px-6 py-5 last:border-0">
        <span v-for="cell in 5" :key="cell" class="h-4 rounded bg-atelier-line/60" />
      </div>
    </div>
    <div v-else-if="orders?.results.length" class="mt-6">
      <OrderTable :orders="orders.results" />
      <nav v-if="totalPages > 1" class="mt-5 flex items-center justify-between" aria-label="Order pagination">
        <p class="hidden text-xs text-atelier-ink/45 sm:block">Page {{ page }} of {{ totalPages }}</p>
        <div class="ml-auto flex items-center gap-2">
          <button type="button" class="inline-flex h-10 items-center gap-2 rounded-xl border border-atelier-line bg-atelier-cream px-3 text-xs font-semibold transition hover:border-atelier-sage disabled:cursor-not-allowed disabled:opacity-40" :disabled="page <= 1" @click="changePage(page - 1)">
            <DashboardIcon name="chevron-left" class="h-4 w-4" /> Previous
          </button>
          <span class="grid h-10 min-w-10 place-items-center rounded-xl bg-atelier-ink px-3 text-xs font-bold text-white">{{ page }}</span>
          <button type="button" class="inline-flex h-10 items-center gap-2 rounded-xl border border-atelier-line bg-atelier-cream px-3 text-xs font-semibold transition hover:border-atelier-sage disabled:cursor-not-allowed disabled:opacity-40" :disabled="page >= totalPages" @click="changePage(page + 1)">
            Next <DashboardIcon name="chevron-right" class="h-4 w-4" />
          </button>
        </div>
      </nav>
    </div>
    <div v-else class="mt-6 rounded-2xl border border-atelier-line bg-atelier-cream">
      <DashboardEmpty title="No matching orders" description="Try clearing a filter or changing the search terms to see more results." icon="search">
        <button type="button" class="mt-5 rounded-xl bg-atelier-ink px-4 py-2.5 text-sm font-semibold text-white hover:bg-atelier-moss" @click="clearFilters">Clear filters</button>
      </DashboardEmpty>
    </div>
  </div>
</template>
