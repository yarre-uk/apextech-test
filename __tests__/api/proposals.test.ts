import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { GET, POST } from '@/modules/concierge/api/proposals'

vi.mock('@/lib/db', () => ({
  prisma: {
    proposal: {
      findMany: vi.fn(),
      create: vi.fn(),
    },
    reservation: {
      findUnique: vi.fn(),
    },
  },
}))

import { prisma } from '@/lib/db'

const mockProposal = {
  id: 'prop-1',
  reservationId: 'res-1',
  status: 'draft',
  notes: null,
  createdAt: new Date(),
  sentAt: null,
  items: [],
}

const mockReservation = {
  id: 'res-1',
  arrivalDate: new Date('2025-08-01'),
  departureDate: new Date('2025-08-08'),
}

const validItem = {
  category: 'Dining',
  title: 'Dinner at the Terrace',
  description: '',
  scheduledAt: '2025-08-03T19:00:00Z',
  price: 150,
}

function makeRequest(body?: unknown, search = '') {
  return new NextRequest(`http://localhost/api/proposals${search}`, {
    method: body ? 'POST' : 'GET',
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  })
}

beforeEach(() => vi.clearAllMocks())

describe('GET /api/proposals', () => {
  it('returns 200 with proposal list', async () => {
    vi.mocked(prisma.proposal.findMany).mockResolvedValueOnce([mockProposal] as any)

    const res = await GET(makeRequest())

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toHaveLength(1)
    expect(body[0].id).toBe('prop-1')
  })

  it('filters by reservationId query param', async () => {
    vi.mocked(prisma.proposal.findMany).mockResolvedValueOnce([] as any)

    await GET(makeRequest(undefined, '?reservationId=res-1'))

    expect(prisma.proposal.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: expect.objectContaining({ reservationId: 'res-1' }) }),
    )
  })

  it('returns 500 when prisma throws', async () => {
    vi.mocked(prisma.proposal.findMany).mockRejectedValueOnce(new Error('DB error'))

    const res = await GET(makeRequest())

    expect(res.status).toBe(500)
  })
})

describe('POST /api/proposals', () => {
  it('returns 400 on invalid JSON', async () => {
    const req = new NextRequest('http://localhost/api/proposals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'not json',
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it('returns 400 on schema validation failure', async () => {
    const res = await POST(makeRequest({ reservationId: '', items: [] }))
    expect(res.status).toBe(400)
  })

  it('returns 404 when reservation does not exist', async () => {
    vi.mocked(prisma.reservation.findUnique).mockResolvedValueOnce(null)

    const res = await POST(makeRequest({ reservationId: 'res-1', items: [validItem] }))

    expect(res.status).toBe(404)
  })

  it('returns 422 when item is outside reservation dates', async () => {
    vi.mocked(prisma.reservation.findUnique).mockResolvedValueOnce(mockReservation as any)

    const outOfRangeItem = { ...validItem, scheduledAt: '2025-09-01T10:00:00Z' }
    const res = await POST(makeRequest({ reservationId: 'res-1', items: [outOfRangeItem] }))

    expect(res.status).toBe(422)
  })

  it('returns 201 with the created proposal on success', async () => {
    vi.mocked(prisma.reservation.findUnique).mockResolvedValueOnce(mockReservation as any)
    vi.mocked(prisma.proposal.create).mockResolvedValueOnce(mockProposal as any)

    const res = await POST(makeRequest({ reservationId: 'res-1', items: [validItem] }))

    expect(res.status).toBe(201)
    const body = await res.json()
    expect(body.id).toBe('prop-1')
  })

  it('returns 500 when prisma throws', async () => {
    vi.mocked(prisma.reservation.findUnique).mockResolvedValueOnce(mockReservation as any)
    vi.mocked(prisma.proposal.create).mockRejectedValueOnce(new Error('DB error'))

    const res = await POST(makeRequest({ reservationId: 'res-1', items: [validItem] }))

    expect(res.status).toBe(500)
  })
})
