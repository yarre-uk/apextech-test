import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET } from '@/modules/concierge/api/reservations'

vi.mock('@/lib/db', () => ({
  prisma: {
    reservation: { findFirst: vi.fn() },
  },
}))

import { prisma } from '@/lib/db'

const mockReservation = {
  id: 'res-1',
  villa: 'Ocean Villa',
  destination: 'Maldives',
  arrivalDate: new Date('2025-08-01'),
  departureDate: new Date('2025-08-08'),
  member: { id: 'mem-1', name: 'Jane Doe', email: 'jane@example.com' },
  proposals: [],
}

beforeEach(() => vi.clearAllMocks())

describe('GET /api/reservations', () => {
  it('returns 200 with the reservation when one exists', async () => {
    vi.mocked(prisma.reservation.findFirst).mockResolvedValueOnce(mockReservation as any)

    const res = await GET()

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.id).toBe('res-1')
  })

  it('returns 404 when no reservation exists', async () => {
    vi.mocked(prisma.reservation.findFirst).mockResolvedValueOnce(null)

    const res = await GET()

    expect(res.status).toBe(404)
    const body = await res.json()
    expect(body.error).toMatch(/no reservation/i)
  })

  it('returns 500 when prisma throws', async () => {
    vi.mocked(prisma.reservation.findFirst).mockRejectedValueOnce(new Error('DB down'))

    const res = await GET()

    expect(res.status).toBe(500)
  })
})
