import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { GET } from '@/modules/concierge/api/proposals-id'

vi.mock('@/lib/db', () => ({
  prisma: {
    proposal: { findUnique: vi.fn() },
  },
}))

import { prisma } from '@/lib/db'

const mockProposal = {
  id: 'prop-1',
  status: 'sent',
  notes: null,
  createdAt: new Date(),
  sentAt: new Date(),
  reservation: {
    villa: 'Ocean Villa',
    destination: 'Maldives',
    arrivalDate: new Date('2025-08-01'),
    departureDate: new Date('2025-08-08'),
    member: { id: 'mem-1', name: 'Jane Doe', email: 'jane@example.com' },
  },
  items: [],
  sentEmails: [],
}

function makeRequest(id: string) {
  return {
    req: new NextRequest(`http://localhost/api/proposals/${id}`),
    params: Promise.resolve({ id }),
  }
}

beforeEach(() => vi.clearAllMocks())

describe('GET /api/proposals/[id]', () => {
  it('returns 200 with the proposal when found', async () => {
    vi.mocked(prisma.proposal.findUnique).mockResolvedValueOnce(mockProposal as any)

    const { req, params } = makeRequest('prop-1')
    const res = await GET(req, { params })

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.id).toBe('prop-1')
  })

  it('returns 404 when proposal does not exist', async () => {
    vi.mocked(prisma.proposal.findUnique).mockResolvedValueOnce(null)

    const { req, params } = makeRequest('missing')
    const res = await GET(req, { params })

    expect(res.status).toBe(404)
    const body = await res.json()
    expect(body.error).toMatch(/not found/i)
  })

  it('returns 500 when prisma throws', async () => {
    vi.mocked(prisma.proposal.findUnique).mockRejectedValueOnce(new Error('DB error'))

    const { req, params } = makeRequest('prop-1')
    const res = await GET(req, { params })

    expect(res.status).toBe(500)
  })
})
