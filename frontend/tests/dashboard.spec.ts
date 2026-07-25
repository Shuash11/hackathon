import { describe, expect, it } from 'vitest'
import { buildOrderQuery, formatCurrency, orderReference } from '../utils/dashboard'

describe('dashboard utilities', () => {
  it('builds an order query without empty filters', () => {
    expect(buildOrderQuery({
      status: 'shipped',
      search: 'Sasha Reed',
      dateFrom: '',
      dateTo: '2026-07-25',
      page: 2,
      pageSize: 10,
    })).toBe('?status=shipped&search=Sasha+Reed&date_to=2026-07-25&page=2&page_size=10')
  })

  it('formats currency and stable order references', () => {
    expect(formatCurrency('145.5')).toBe('$145.50')
    expect(orderReference(42)).toBe('#SC-00042')
  })
})
