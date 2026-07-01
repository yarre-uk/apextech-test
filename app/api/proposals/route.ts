import { prisma } from '@/lib/db'
import { CreateProposalSchema } from '@/modules/concierge/schemas'
import type { NextRequest } from 'next/server'
import { z } from 'zod'

export async function GET() {
  try {
    const proposals = await prisma.proposal.findMany({
      include: {
        reservation: { include: { member: true } },
        _count: { select: { items: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return Response.json(proposals)
  } catch {
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const result = CreateProposalSchema.safeParse(body)

    if (!result.success) {
      return Response.json(
        { error: 'Invalid request body', details: z.prettifyError(result.error) },
        { status: 400 },
      )
    }

    const { reservationId, notes, items } = result.data

    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
    })

    if (!reservation) {
      return Response.json({ error: 'Reservation not found' }, { status: 404 })
    }

    const proposal = await prisma.proposal.create({
      data: {
        reservationId,
        notes,
        items: {
          create: items.map((item) => ({
            ...item,
            scheduledAt: new Date(item.scheduledAt),
          })),
        },
      },
      include: { items: true },
    })

    return Response.json(proposal, { status: 201 })
  } catch {
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
