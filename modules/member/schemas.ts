import { z } from 'zod'

export const UpdateProposalStatusSchema = z.object({
  status: z.enum(['approved', 'paid']),
})
