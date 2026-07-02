import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { POST } from '@/modules/concierge/api/proposals-id-send'

vi.mock('@/modules/concierge/email', () => ({
  buildProposalEmailBody: vi.fn(() => 'email body'),
  sendEmail: vi.fn(),
}))

vi.mock('@/lib/db', () => {
  const mockTx = {
    proposal: {
      updateMany: vi.fn(),
      findUniqueOrThrow: vi.fn(),
    },
    sentEmail: {
      create: vi.fn(),
    },
  }

  return {
    prisma: {
      proposal: { findUnique: vi.fn() },
      $transaction: vi.fn((fn: (tx: typeof mockTx) => unknown) => fn(mockTx)),
      _mockTx: mockTx,
    },
  }
})

import { prisma } from '@/lib/db'

const mockTx = (prisma as any)._mockTx

const mockProposalBase = {
  id: 'prop-1',
  status: 'draft',
  notes: null,
  createdAt: new Date(),
  sentAt: null,
  reservation: {
    villa: 'Ocean Villa',
    destination: 'Maldives',
    arrivalDate: new Date('2025-08-01'),
    departureDate: new Date('2025-08-08'),
    member: { id: 'mem-1', name: 'Jane Doe', email: 'jane@example.com' },
  },
  items: [{ id: 'item-1', title: 'Dinner', scheduledAt: new Date('2025-08-03') }],
}

const updatedProposal = { ...mockProposalBase, status: 'sent', sentAt: new Date() }

function makeRequest(id: string) {
  return {
    req: new NextRequest(`http://localhost/api/proposals/${id}/send`, { method: 'POST' }),
    params: Promise.resolve({ id }),
  }
}

beforeEach(() => vi.clearAllMocks())

describe('POST /api/proposals/[id]/send', () => {
  it('returns 404 when proposal does not exist', async () => {
    vi.mocked(prisma.proposal.findUnique).mockResolvedValueOnce(null)

    const { req, params } = makeRequest('prop-1')
    const res = await POST(req, { params })

    expect(res.status).toBe(404)
    const body = await res.json()
    expect(body.error).toMatch(/not found/i)
  })

  it('returns 422 when proposal has no items', async () => {
    vi.mocked(prisma.proposal.findUnique).mockResolvedValueOnce({
      ...mockProposalBase,
      items: [],
    } as any)

    const { req, params } = makeRequest('prop-1')
    const res = await POST(req, { params })

    expect(res.status).toBe(422)
    const body = await res.json()
    expect(body.error).toMatch(/no items/i)
  })

  it('returns 409 when proposal is already sent', async () => {
    vi.mocked(prisma.proposal.findUnique).mockResolvedValueOnce({
      ...mockProposalBase,
      status: 'sent',
    } as any)

    const { req, params } = makeRequest('prop-1')
    const res = await POST(req, { params })

    expect(res.status).toBe(409)
  })

  it('returns 409 on concurrent send (updateMany count === 0)', async () => {
    vi.mocked(prisma.proposal.findUnique).mockResolvedValueOnce(mockProposalBase as any)
    mockTx.proposal.updateMany.mockResolvedValueOnce({ count: 0 })

    const { req, params } = makeRequest('prop-1')
    const res = await POST(req, { params })

    expect(res.status).toBe(409)
    const body = await res.json()
    expect(body.error).toMatch(/already been sent/i)
  })

  it('returns 200 and the updated proposal on success', async () => {
    vi.mocked(prisma.proposal.findUnique).mockResolvedValueOnce(mockProposalBase as any)
    mockTx.proposal.updateMany.mockResolvedValueOnce({ count: 1 })
    mockTx.sentEmail.create.mockResolvedValueOnce({})
    mockTx.proposal.findUniqueOrThrow.mockResolvedValueOnce(updatedProposal)

    const { req, params } = makeRequest('prop-1')
    const res = await POST(req, { params })

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.status).toBe('sent')
  })

  it('returns 500 when prisma throws unexpectedly', async () => {
    vi.mocked(prisma.proposal.findUnique).mockRejectedValueOnce(new Error('DB error'))

    const { req, params } = makeRequest('prop-1')
    const res = await POST(req, { params })

    expect(res.status).toBe(500)
  })
})
