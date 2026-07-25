import { describe, expect, it } from 'vitest'
import { safeInternalRedirect } from '../utils/redirect'

describe('safeInternalRedirect', () => {
  it('accepts application-relative paths', () => {
    expect(safeInternalRedirect('/dashboard?tab=profile#security')).toBe('/dashboard?tab=profile#security')
  })

  it.each([
    'https://attacker.example',
    '//attacker.example',
    '/\\attacker.example',
    '/dashboard\r\nLocation: https://attacker.example',
    'dashboard',
    '',
    undefined,
    ['x'],
  ])('rejects unsafe value %#', value => {
    expect(safeInternalRedirect(value)).toBeNull()
  })
})
