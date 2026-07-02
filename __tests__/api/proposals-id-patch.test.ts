import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { PATCH } from '@/modules/member/api/proposals-id'

vi.mock('@/lib/db', () => ({
  prisma: {
    proposal: {
      findUnique: vi.fn(),
      updateMany: vi.fn(),
      findUniqueOrThrow: vi.fn(),
    },
  },
}))

import { prisma } from '@/lib/db'

const mockSentProposal = { id: 'prop-1', status: 'sent' }
const mockApprovedProposal = { id: 'prop-1', status: 'approved' }

function makeRequest(id: string, body: unknown) {
  return {
    req: new NextRequest(`http://localhost/api/proposals/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }),
    params: Promise.resolve({ id }),
  }
}

beforeEach(() => vi.clearAllMocks())

describe('PATCH /api/proposals/[id]', () => {
  it('returns 400 on invalid JSON', async () => {
    const req = new NextRequest('http://localhost/api/proposals/prop-1', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: 'not json',
    })
    const res = await PATCH(req, { params: Promise.resolve({ id: 'prop-1' }) })

    expect(res.status).toBe(400)
  })

  it('returns 400 on schema validation failure (unknown status)', async () => {
    const { req, params } = makeRequest('prop-1', { status: 'draft' })
    const res = await PATCH(req, { params })

    expect(res.status).toBe(400)
  })

  it('returns 404 when proposal does not exist', async () => {
    vi.mocked(prisma.proposal.findUnique).mockResolvedValueOnce(null)

    const { req, params } = makeRequest('missing', { status: 'approved' })
    const res = await PATCH(req, { params })

    expect(res.status).toBe(404)
    const body = await res.json()
    expect(body.error).toMatch(/not found/i)
  })

  it('returns 409 when transition is not allowed', async () => {
    vi.mocked(prisma.proposal.findUnique).mockResolvedValueOnce({ id: 'prop-1', status: 'draft' } as any)

    const { req, params } = makeRequest('prop-1', { status: 'approved' })
    const res = await PATCH(req, { params })

    expect(res.status).toBe(409)
    const body = await res.json()
    expect(body.error).toMatch(/cannot transition/i)
  })

  it('returns 409 on concurrent modification (updateMany count === 0)', async () => {
    vi.mocked(prisma.proposal.findUnique).mockResolvedValueOnce(mockSentProposal as any)
    vi.mocked(prisma.proposal.updateMany).mockResolvedValueOnce({ count: 0 })

    const { req, params } = makeRequest('prop-1', { status: 'approved' })
    const res = await PATCH(req, { params })

    expect(res.status).toBe(409)
    const body = await res.json()
    expect(body.error).toMatch(/concurrently/i)
  })

  it('returns 200 with updated proposal on sent → approved', async () => {
    vi.mocked(prisma.proposal.findUnique).mockResolvedValueOnce(mockSentProposal as any)
    vi.mocked(prisma.proposal.updateMany).mockResolvedValueOnce({ count: 1 })
    vi.mocked(prisma.proposal.findUniqueOrThrow).mockResolvedValueOnce(mockApprovedProposal as any)

    const { req, params } = makeRequest('prop-1', { status: 'approved' })
    const res = await PATCH(req, { params })

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.status).toBe('approved')
  })

  it('returns 200 with updated proposal on approved → paid', async () => {
    const paidProposal = { id: 'prop-1', status: 'paid' }
    vi.mocked(prisma.proposal.findUnique).mockResolvedValueOnce(mockApprovedProposal as any)
    vi.mocked(prisma.proposal.updateMany).mockResolvedValueOnce({ count: 1 })
    vi.mocked(prisma.proposal.findUniqueOrThrow).mockResolvedValueOnce(paidProposal as any)

    const { req, params } = makeRequest('prop-1', { status: 'paid' })
    const res = await PATCH(req, { params })

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.status).toBe('paid')
  })

  it('returns 500 when prisma throws', async () => {
    vi.mocked(prisma.proposal.findUnique).mockRejectedValueOnce(new Error('DB error'))

    const { req, params } = makeRequest('prop-1', { status: 'approved' })
    const res = await PATCH(req, { params })

    expect(res.status).toBe(500)
  })
})
