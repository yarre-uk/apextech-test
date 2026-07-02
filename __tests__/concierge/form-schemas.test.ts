import { describe, it, expect } from 'vitest'
import { ItemFormSchema } from '@/modules/concierge/form-schemas'

const valid = {
  title: 'Wine Tasting',
  description: '',
  scheduledAt: '2025-08-01T18:00',
  price: 80,
}

describe('ItemFormSchema', () => {
  it('accepts valid input', () => {
    expect(ItemFormSchema.parse(valid)).toMatchObject(valid)
  })

  it('accepts empty description', () => {
    expect(() => ItemFormSchema.parse({ ...valid, description: '' })).not.toThrow()
  })

  it('rejects empty title', () => {
    const result = ItemFormSchema.safeParse({ ...valid, title: '' })
    expect(result.success).toBe(false)
  })

  it('rejects empty scheduledAt', () => {
    const result = ItemFormSchema.safeParse({ ...valid, scheduledAt: '' })
    expect(result.success).toBe(false)
  })

  it('rejects zero price', () => {
    const result = ItemFormSchema.safeParse({ ...valid, price: 0 })
    expect(result.success).toBe(false)
  })

  it('rejects negative price', () => {
    const result = ItemFormSchema.safeParse({ ...valid, price: -5 })
    expect(result.success).toBe(false)
  })
})
