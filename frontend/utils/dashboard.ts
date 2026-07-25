import type { OrderFilters, OrderStatus } from '../types/dashboard'

export const orderStatuses: Array<{ value: OrderStatus, label: string }> = [
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
]

export function formatCurrency(value: string | number): string {
  const amount = Number(value)
  if (!Number.isFinite(amount)) return '$0.00'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount)
}

export function formatCompactCurrency(value: string | number): string {
  const amount = Number(value)
  if (!Number.isFinite(amount)) return '$0'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: amount >= 10000 ? 'compact' : 'standard',
    maximumFractionDigits: amount >= 10000 ? 1 : 0,
  }).format(amount)
}

export function formatDate(value: string, includeTime = false): string {
  const date = new Date(value)
  if (Number.isNaN(date.valueOf())) return 'Unknown date'
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    ...(includeTime ? { hour: 'numeric', minute: '2-digit' } : {}),
  }).format(date)
}

export function orderReference(id: number): string {
  return `#SC-${String(id).padStart(5, '0')}`
}

export function buildOrderQuery(filters: OrderFilters): string {
  const query = new URLSearchParams()
  if (filters.status) query.set('status', filters.status)
  if (filters.search.trim()) query.set('search', filters.search.trim())
  if (filters.dateFrom) query.set('date_from', filters.dateFrom)
  if (filters.dateTo) query.set('date_to', filters.dateTo)
  query.set('page', String(filters.page))
  query.set('page_size', String(filters.pageSize))
  return `?${query.toString()}`
}

export function apiErrorMessage(error: unknown, fallback: string): string {
  const response = (error as { data?: unknown, response?: { _data?: unknown } })?.response?._data
    ?? (error as { data?: unknown })?.data
  if (response && typeof response === 'object' && 'detail' in response) {
    const detail = (response as { detail?: unknown }).detail
    if (typeof detail === 'string') return detail
  }
  return fallback
}
