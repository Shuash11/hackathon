import { describe, expect, it } from 'vitest'
import { hasUniqueProductIds, scenticoProducts } from '../data/scentico'

describe('Scentico collection data', () => {
  it('contains the six uniquely keyed signature scents', () => {
    expect(scenticoProducts).toHaveLength(6)
    expect(hasUniqueProductIds(scenticoProducts)).toBe(true)
  })

  it('rejects duplicate product identifiers', () => {
    expect(hasUniqueProductIds([{ id: 'amber-noir' }, { id: 'amber-noir' }])).toBe(false)
  })
})
