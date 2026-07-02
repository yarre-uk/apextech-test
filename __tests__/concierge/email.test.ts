import { describe, it, expect, vi, beforeEach } from 'vitest'
import { buildProposalEmailBody, sendEmail } from '@/modules/concierge/email'

const baseParams = {
  proposalId: 'prop-42',
  memberName: 'Jane Doe',
  villa: 'Ocean Villa',
  destination: 'Maldives',
  arrivalDate: new Date('2025-08-01'),
  departureDate: new Date('2025-08-08'),
  itemCount: 3,
}

describe('buildProposalEmailBody', () => {
  it('includes the member name', () => {
    expect(buildProposalEmailBody(baseParams)).toContain('Jane Doe')
  })

  it('includes the villa and destination', () => {
    const body = buildProposalEmailBody(baseParams)
    expect(body).toContain('Ocean Villa')
    expect(body).toContain('Maldives')
  })

  it('includes the proposal URL', () => {
    expect(buildProposalEmailBody(baseParams)).toContain('/proposal/prop-42')
  })

  it('uses singular experience when itemCount is 1', () => {
    expect(buildProposalEmailBody({ ...baseParams, itemCount: 1 })).toContain('1 experience')
    expect(buildProposalEmailBody({ ...baseParams, itemCount: 1 })).not.toContain('experiences')
  })

  it('uses plural experiences when itemCount is not 1', () => {
    expect(buildProposalEmailBody({ ...baseParams, itemCount: 3 })).toContain('3 experiences')
    expect(buildProposalEmailBody({ ...baseParams, itemCount: 0 })).toContain('0 experiences')
  })
})

describe('sendEmail', () => {
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  it('logs the recipient and body', () => {
    sendEmail({ to: 'guest@example.com', body: 'Your proposal is ready.' })
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('guest@example.com'))
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Your proposal is ready.'))
  })
})
