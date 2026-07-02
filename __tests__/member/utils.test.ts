import { describe, it, expect } from 'vitest'
import { formatDate, formatDateTime, formatCurrency, groupByDay } from '@/modules/member/utils'

describe('formatCurrency', () => {
  it('formats a whole dollar amount', () => {
    expect(formatCurrency(100)).toBe('$100.00')
  })

  it('formats cents', () => {
    expect(formatCurrency(9.5)).toBe('$9.50')
  })

  it('formats zero', () => {
    expect(formatCurrency(0)).toBe('$0.00')
  })
})

describe('formatDate', () => {
  it('returns a human-readable date string', () => {
    const result = formatDate('2025-08-01T00:00:00Z')
    expect(result).toMatch(/Aug/)
    expect(result).toMatch(/2025/)
  })
})

describe('formatDateTime', () => {
  it('returns a string with month and time', () => {
    const result = formatDateTime('2025-08-01T19:00:00Z')
    expect(result).toMatch(/Aug/)
    expect(typeof result).toBe('string')
  })
})

describe('groupByDay', () => {
  const items = [
    { scheduledAt: '2025-08-01T08:00:00Z', name: 'Breakfast' },
    { scheduledAt: '2025-08-01T18:00:00Z', name: 'Dinner' },
    { scheduledAt: '2025-08-02T10:00:00Z', name: 'Snorkeling' },
  ]

  it('groups items with the same calendar day together', () => {
    const result = groupByDay(items)
    const days = Object.keys(result)
    expect(days).toHaveLength(2)
  })

  it('places both Aug 1 items in the same group', () => {
    const result = groupByDay(items)
    const aug1 = new Date('2025-08-01T08:00:00Z').toDateString()
    expect(result[aug1]).toHaveLength(2)
  })

  it('places Aug 2 item in its own group', () => {
    const result = groupByDay(items)
    const aug2 = new Date('2025-08-02T10:00:00Z').toDateString()
    expect(result[aug2]).toHaveLength(1)
    expect(result[aug2][0].name).toBe('Snorkeling')
  })

  it('returns an empty object for an empty array', () => {
    expect(groupByDay([])).toEqual({})
  })
})
