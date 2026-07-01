import { prisma } from '@/lib/db';
import { CreateProposalSchema } from '@/modules/concierge/schemas';
import type { NextRequest } from 'next/server';
import { z } from 'zod';

/**
 * GET /api/proposals
 * Returns proposals ordered by creation date (newest first),
 * each including the reservation+member and item count.
 * @param ?reservationId - filters proposals to a single reservation
 * @param ?proposalId    - narrows to a single proposal by id
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const reservationId = searchParams.get('reservationId') ?? undefined;
    const proposalId = searchParams.get('proposalId') ?? undefined;

    const proposals = await prisma.proposal.findMany({
      where: {
        ...(reservationId && { reservationId }),
        ...(proposalId && { id: proposalId }),
      },
      include: {
        reservation: { include: { member: true } },
        _count: { select: { items: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return Response.json(proposals);
  } catch {
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/proposals
 * Creates a new draft proposal with items.
 * Validates body against CreateProposalSchema and ensures every item's
 * scheduledAt falls within the reservation's arrival–departure window.
 * 400 — malformed JSON or schema validation failure
 * 404 — reservationId not found
 * 422 — one or more items outside the reservation date range
 */
export async function POST(request: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return Response.json(
        { error: 'Request body must be valid JSON' },
        { status: 400 },
      );
    }

    const result = CreateProposalSchema.safeParse(body);

    if (!result.success) {
      return Response.json(
        {
          error: 'Invalid request body',
          details: z.prettifyError(result.error),
        },
        { status: 400 },
      );
    }

    const { reservationId, notes, items } = result.data;

    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
    });

    if (!reservation) {
      return Response.json({ error: 'Reservation not found' }, { status: 404 });
    }

    const outOfRange = items.filter((item) => {
      const date = new Date(item.scheduledAt);

      return date < reservation.arrivalDate || date > reservation.departureDate;
    });

    if (outOfRange.length > 0) {
      return Response.json(
        {
          error:
            'One or more items are scheduled outside the reservation dates',
          invalid: outOfRange.map((item) => ({
            title: item.title,
            scheduledAt: item.scheduledAt,
          })),
        },
        { status: 422 },
      );
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
    });

    return Response.json(proposal, { status: 201 });
  } catch {
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
