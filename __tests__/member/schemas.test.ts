import { describe, it, expect } from 'vitest'
import { UpdateProposalStatusSchema } from '@/modules/member/schemas'

describe('UpdateProposalStatusSchema', () => {
  it('accepts "approved"', () => {
    expect(UpdateProposalStatusSchema.parse({ status: 'approved' })).toEqual({ status: 'approved' })
  })

  it('accepts "paid"', () => {
    expect(UpdateProposalStatusSchema.parse({ status: 'paid' })).toEqual({ status: 'paid' })
  })

  it('rejects "draft" — cannot revert to draft', () => {
    expect(() => UpdateProposalStatusSchema.parse({ status: 'draft' })).toThrow()
  })

  it('rejects "sent" — member cannot re-send', () => {
    expect(() => UpdateProposalStatusSchema.parse({ status: 'sent' })).toThrow()
  })

  it('rejects unknown status', () => {
    expect(() => UpdateProposalStatusSchema.parse({ status: 'cancelled' })).toThrow()
  })

  it('rejects missing status field', () => {
    expect(() => UpdateProposalStatusSchema.parse({})).toThrow()
  })
})
