import { describe, it, expect } from 'vitest'
import { ProposalStatus, ProposalItemSchema, CreateProposalSchema } from '@/modules/concierge/schemas'

describe('ProposalStatus', () => {
  it('accepts valid statuses', () => {
    for (const s of ['draft', 'sent', 'approved', 'paid']) {
      expect(ProposalStatus.parse(s)).toBe(s)
    }
  })

  it('rejects unknown status', () => {
    expect(() => ProposalStatus.parse('cancelled')).toThrow()
  })
})

const validItem = {
  category: 'Dining',
  title: 'Dinner at the Terrace',
  description: '',
  scheduledAt: '2025-08-01T19:00:00Z',
  price: 150,
}

describe('ProposalItemSchema', () => {
  it('accepts a valid item', () => {
    expect(ProposalItemSchema.parse(validItem)).toMatchObject(validItem)
  })

  it('accepts an empty description', () => {
    expect(() => ProposalItemSchema.parse({ ...validItem, description: '' })).not.toThrow()
  })

  it('rejects missing title', () => {
    expect(() => ProposalItemSchema.parse({ ...validItem, title: '' })).toThrow()
  })

  it('rejects invalid category', () => {
    expect(() => ProposalItemSchema.parse({ ...validItem, category: 'Food' })).toThrow()
  })

  it('rejects non-positive price', () => {
    expect(() => ProposalItemSchema.parse({ ...validItem, price: 0 })).toThrow()
    expect(() => ProposalItemSchema.parse({ ...validItem, price: -10 })).toThrow()
  })

  it('rejects non-ISO datetime', () => {
    expect(() => ProposalItemSchema.parse({ ...validItem, scheduledAt: '2025-08-01' })).toThrow()
  })
})

describe('CreateProposalSchema', () => {
  const validPayload = {
    reservationId: 'res-1',
    notes: 'Please prepare a welcome gift',
    items: [validItem],
  }

  it('accepts a valid payload', () => {
    expect(CreateProposalSchema.parse(validPayload)).toMatchObject(validPayload)
  })

  it('accepts optional notes being absent', () => {
    const { notes: _, ...withoutNotes } = validPayload
    expect(CreateProposalSchema.parse(withoutNotes)).toMatchObject(withoutNotes)
  })

  it('rejects empty reservationId', () => {
    expect(() => CreateProposalSchema.parse({ ...validPayload, reservationId: '' })).toThrow()
  })

  it('rejects empty items array', () => {
    expect(() => CreateProposalSchema.parse({ ...validPayload, items: [] })).toThrow()
  })
})
