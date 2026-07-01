import { prisma } from '@/lib/db';
import { UpdateProposalStatusSchema } from '@/modules/concierge/schemas';
import type { NextRequest } from 'next/server';
import { z } from 'zod';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const proposal = await prisma.proposal.findUnique({
      where: { id },
      include: {
        reservation: { include: { member: true } },
        items: { orderBy: { scheduledAt: 'asc' } },
        sentEmails: { orderBy: { sentAt: 'desc' }, take: 1 },
      },
    });

    if (!proposal) {
      return Response.json({ error: 'Proposal not found' }, { status: 404 });
    }

    return Response.json(proposal);
  } catch {
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const result = UpdateProposalStatusSchema.safeParse(body);

    if (!result.success) {
      return Response.json(
        {
          error: 'Invalid request body',
          details: z.prettifyError(result.error),
        },
        { status: 400 },
      );
    }

    const existing = await prisma.proposal.findUnique({ where: { id } });

    if (!existing) {
      return Response.json({ error: 'Proposal not found' }, { status: 404 });
    }

    const VALID_TRANSITIONS: Record<string, string[]> = {
      sent: ['approved'],
      approved: ['paid'],
    };

    if (!VALID_TRANSITIONS[existing.status]?.includes(result.data.status)) {
      return Response.json(
        {
          error: `Cannot transition from "${existing.status}" to "${result.data.status}"`,
        },
        { status: 409 },
      );
    }

    const proposal = await prisma.proposal.update({
      where: { id },
      data: { status: result.data.status },
    });

    return Response.json(proposal);
  } catch {
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
