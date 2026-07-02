import { describe, it, expect } from 'vitest'
import { isValidTransition, VALID_TRANSITIONS } from '@/modules/member/transitions'

describe('VALID_TRANSITIONS', () => {
  it('defines sent → approved', () => {
    expect(VALID_TRANSITIONS['sent']).toContain('approved')
  })

  it('defines approved → paid', () => {
    expect(VALID_TRANSITIONS['approved']).toContain('paid')
  })

  it('does not define transitions from draft', () => {
    expect(VALID_TRANSITIONS['draft']).toBeUndefined()
  })

  it('does not define transitions from paid', () => {
    expect(VALID_TRANSITIONS['paid']).toBeUndefined()
  })
})

describe('isValidTransition', () => {
  it('allows sent → approved', () => {
    expect(isValidTransition('sent', 'approved')).toBe(true)
  })

  it('allows approved → paid', () => {
    expect(isValidTransition('approved', 'paid')).toBe(true)
  })

  it('rejects draft → approved (must be sent first)', () => {
    expect(isValidTransition('draft', 'approved')).toBe(false)
  })

  it('rejects sent → paid (must approve first)', () => {
    expect(isValidTransition('sent', 'paid')).toBe(false)
  })

  it('rejects backwards transitions', () => {
    expect(isValidTransition('approved', 'sent')).toBe(false)
    expect(isValidTransition('paid', 'approved')).toBe(false)
  })

  it('rejects same-status transition', () => {
    expect(isValidTransition('sent', 'sent')).toBe(false)
    expect(isValidTransition('approved', 'approved')).toBe(false)
  })

  it('rejects unknown from-status', () => {
    expect(isValidTransition('unknown', 'approved')).toBe(false)
  })
})
