import { prisma } from '@/lib/db'
import type { NextRequest } from 'next/server'

/**
 * GET /api/proposals/[id]
 * Returns a single proposal with reservation+member, ordered items, and the
 * most recent sent email record. 404 if not found.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params

    const proposal = await prisma.proposal.findUnique({
      where: { id },
      include: {
        reservation: { include: { member: true } },
        items: { orderBy: { scheduledAt: 'asc' } },
        sentEmails: { orderBy: { sentAt: 'desc' }, take: 1 },
      },
    })

    if (!proposal) {
      return Response.json({ error: 'Proposal not found' }, { status: 404 })
    }

    return Response.json(proposal)
  } catch {
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
