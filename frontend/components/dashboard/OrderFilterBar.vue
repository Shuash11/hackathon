<script setup lang="ts">
import type { OrderStatus } from '~/types/dashboard'
import { orderStatuses } from '~/utils/dashboard'

defineProps<{
  search: string
  status: OrderStatus | ''
  dateFrom: string
  dateTo: string
  busy?: boolean
}>()

const emit = defineEmits<{
  'update:search': [value: string]
  'update:status': [value: OrderStatus | '']
  'update:dateFrom': [value: string]
  'update:dateTo': [value: string]
  apply: []
  clear: []
}>()

function inputValue(event: Event): string {
  return (event.target as HTMLInputElement).value
}

function selectValue(event: Event): OrderStatus | '' {
  return (event.target as HTMLSelectElement).value as OrderStatus | ''
}
</script>

<template>
  <form class="rounded-2xl border border-atelier-line bg-atelier-cream p-4 sm:p-5" @submit.prevent="emit('apply')">
    <div class="grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(15rem,1fr)_12rem_11rem_11rem_auto]">
      <label class="relative block">
        <span class="sr-only">Search customers</span>
        <DashboardIcon name="search" class="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-atelier-ink/35" />
        <input :value="search" type="search" placeholder="Search customer name or email" class="h-11 w-full rounded-xl border border-atelier-line bg-white pl-10 pr-3 text-sm placeholder:text-atelier-ink/35 focus:border-atelier-moss focus:ring-atelier-moss" @input="emit('update:search', inputValue($event))">
      </label>
      <label>
        <span class="sr-only">Order status</span>
        <select :value="status" class="h-11 w-full rounded-xl border border-atelier-line bg-white px-3 text-sm focus:border-atelier-moss focus:ring-atelier-moss" @change="emit('update:status', selectValue($event))">
          <option value="">All statuses</option>
          <option v-for="option in orderStatuses" :key="option.value" :value="option.value">{{ option.label }}</option>
        </select>
      </label>
      <label class="relative">
        <span class="absolute -top-2 left-3 bg-atelier-cream px-1 text-[9px] font-bold uppercase tracking-wider text-atelier-ink/45">From</span>
        <input :value="dateFrom" type="date" class="h-11 w-full rounded-xl border border-atelier-line bg-white px-3 text-sm focus:border-atelier-moss focus:ring-atelier-moss" @input="emit('update:dateFrom', inputValue($event))">
      </label>
      <label class="relative">
        <span class="absolute -top-2 left-3 bg-atelier-cream px-1 text-[9px] font-bold uppercase tracking-wider text-atelier-ink/45">To</span>
        <input :value="dateTo" type="date" class="h-11 w-full rounded-xl border border-atelier-line bg-white px-3 text-sm focus:border-atelier-moss focus:ring-atelier-moss" @input="emit('update:dateTo', inputValue($event))">
      </label>
      <div class="flex gap-2 md:col-span-2 xl:col-span-1">
        <button type="submit" class="flex h-11 flex-1 items-center justify-center rounded-xl bg-atelier-ink px-5 text-sm font-semibold text-white transition hover:bg-atelier-moss disabled:cursor-wait disabled:opacity-60" :disabled="busy">Apply</button>
        <button type="button" class="h-11 rounded-xl border border-atelier-line px-4 text-sm font-semibold text-atelier-ink/55 hover:border-atelier-sage hover:text-atelier-ink" @click="emit('clear')">Clear</button>
      </div>
    </div>
  </form>
</template>
