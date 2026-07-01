import { prisma } from '@/lib/db'
import { buildProposalEmailBody, sendEmail } from '@/modules/concierge/email'
import type { NextRequest } from 'next/server'

/**
 * POST /api/proposals/[id]/send
 * Marks a draft proposal as "sent", records a SentEmail row, and logs the
 * email body to stdout (simulated delivery).
 * 404 — proposal not found
 * 409 — proposal is not in "draft" status
 * 422 — proposal has no items
 */
export async function POST(
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
      },
    })

    if (!proposal) {
      return Response.json({ error: 'Proposal not found' }, { status: 404 })
    }

    if (proposal.items.length === 0) {
      return Response.json(
        { error: 'Cannot send a proposal with no items' },
        { status: 422 },
      )
    }

    if (proposal.status !== 'draft') {
      return Response.json(
        { error: `Proposal is already "${proposal.status}" — only drafts can be sent` },
        { status: 409 },
      )
    }

    const { member, villa, destination, arrivalDate, departureDate } = proposal.reservation

    const bodyPreview = buildProposalEmailBody({
      proposalId: id,
      memberName: member.name,
      villa,
      destination,
      arrivalDate,
      departureDate,
      itemCount: proposal.items.length,
    })

    // Interactive transaction: the updateMany re-checks status atomically.
    // If a concurrent request already sent this proposal, count === 0 and
    // we abort without creating a duplicate SentEmail or sending again.
    const updatedProposal = await prisma.$transaction(async (tx) => {
      const { count } = await tx.proposal.updateMany({
        where: { id, status: 'draft' },
        data: { status: 'sent', sentAt: new Date() },
      })

      if (count === 0) {
        throw Object.assign(new Error('ALREADY_SENT'), { status: 409 })
      }

      await tx.sentEmail.create({
        data: { proposalId: id, toEmail: member.email, bodyPreview },
      })

      return tx.proposal.findUniqueOrThrow({ where: { id } })
    })

    try {
      sendEmail({ to: member.email, body: bodyPreview })
    } catch (err) {
      // Delivery failure does not roll back the DB — the proposal is sent.
      // Log and continue; a retry job would re-attempt from the SentEmail record.
      console.error('[EMAIL] Delivery failed, will require retry:', err)
    }

    return Response.json(updatedProposal)
  } catch (err) {
    if (err instanceof Error && err.message === 'ALREADY_SENT') {
      return Response.json(
        { error: 'Proposal has already been sent' },
        { status: 409 },
      )
    }
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
