import { prisma } from '@/lib/db'
import { UpdateProposalStatusSchema } from '@/modules/member/schemas'
import type { NextRequest } from 'next/server'
import { z } from 'zod'

const VALID_TRANSITIONS: Record<string, string[]> = {
  sent: ['approved'],
  approved: ['paid'],
}

/**
 * PATCH /api/proposals/[id]
 * Member action — advances a proposal's status via allowed transitions:
 *   sent → approved → paid
 * 400 — malformed JSON or schema validation failure
 * 404 — proposal not found
 * 409 — transition not permitted from current status
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return Response.json(
        { error: 'Request body must be valid JSON' },
        { status: 400 },
      )
    }

    const result = UpdateProposalStatusSchema.safeParse(body)

    if (!result.success) {
      return Response.json(
        { error: 'Invalid request body', details: z.prettifyError(result.error) },
        { status: 400 },
      )
    }

    const existing = await prisma.proposal.findUnique({ where: { id } })

    if (!existing) {
      return Response.json({ error: 'Proposal not found' }, { status: 404 })
    }

    if (!VALID_TRANSITIONS[existing.status]?.includes(result.data.status)) {
      return Response.json(
        { error: `Cannot transition from "${existing.status}" to "${result.data.status}"` },
        { status: 409 },
      )
    }

    const proposal = await prisma.proposal.update({
      where: { id },
      data: { status: result.data.status },
    })

    return Response.json(proposal)
  } catch {
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
