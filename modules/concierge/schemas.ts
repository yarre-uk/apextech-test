import { z } from 'zod'
import { CATEGORIES } from '@/modules/concierge/constants'

export const ProposalStatus = z.enum(['draft', 'sent', 'approved', 'paid'])
export type ProposalStatus = z.infer<typeof ProposalStatus>

export const ProposalItemSchema = z.object({
  category: z.enum(CATEGORIES),
  title: z.string().min(1),
  description: z.string(),
  scheduledAt: z.iso.datetime(),
  price: z.number().positive(),
})

export const CreateProposalSchema = z.object({
  reservationId: z.string().min(1),
  notes: z.string().optional(),
  items: z.array(ProposalItemSchema).min(1, 'At least one item is required'),
})

export type ProposalItemInput = z.infer<typeof ProposalItemSchema>
export type CreateProposalInput = z.infer<typeof CreateProposalSchema>
