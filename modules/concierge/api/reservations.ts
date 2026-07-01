import { prisma } from '@/lib/db'

/**
 * GET /api/reservations
 * Returns the first upcoming reservation with its member.
 * 404 if no reservation exists.
 */
export async function GET() {
  try {
    const reservation = await prisma.reservation.findFirst({
      include: { member: true },
      orderBy: { arrivalDate: 'asc' },
    })

    if (!reservation) {
      return Response.json({ error: 'No reservation found' }, { status: 404 })
    }

    return Response.json(reservation)
  } catch {
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
