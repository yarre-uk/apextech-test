import { prisma } from '@/lib/db';
import { buildProposalEmailBody } from '@/lib/email';
import type { NextRequest } from 'next/server';

export async function POST(
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
      },
    });

    if (!proposal) {
      return Response.json({ error: 'Proposal not found' }, { status: 404 });
    }

    if (proposal.status !== 'draft') {
      return Response.json(
        {
          error: `Proposal is already "${proposal.status}" — only drafts can be sent`,
        },
        { status: 409 },
      );
    }

    const { member, villa, destination, arrivalDate, departureDate } =
      proposal.reservation;

    const bodyPreview = buildProposalEmailBody({
      proposalId: id,
      memberName: member.name,
      villa,
      destination,
      arrivalDate,
      departureDate,
      itemCount: proposal.items.length,
    });

    const [updatedProposal] = await prisma.$transaction([
      prisma.proposal.update({
        where: { id },
        data: { status: 'sent', sentAt: new Date() },
      }),
      prisma.sentEmail.create({
        data: { proposalId: id, toEmail: member.email, bodyPreview },
      }),
    ]);

    console.log(`[EMAIL] To: ${member.email}`);
    console.log(`[EMAIL] ${bodyPreview}`);

    return Response.json(updatedProposal);
  } catch {
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
