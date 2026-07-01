import { z } from 'zod';

export const CATEGORIES = [
  'Dining',
  'Activities',
  'Wellness',
  'Excursions',
  'Transport',
  'Experiences',
] as const;

export type Category = (typeof CATEGORIES)[number];

export const ProposalStatus = z.enum(['draft', 'sent', 'approved', 'paid']);
export type ProposalStatus = z.infer<typeof ProposalStatus>;

export const ProposalItemSchema = z.object({
  category: z.enum(CATEGORIES),
  title: z.string().min(1),
  description: z.string().min(1),
  scheduledAt: z.iso.datetime(),
  price: z.number().positive(),
});

export const CreateProposalSchema = z.object({
  reservationId: z.string().min(1),
  notes: z.string().optional(),
  items: z.array(ProposalItemSchema).min(1, 'At least one item is required'),
});

export const UpdateProposalStatusSchema = z.object({
  status: z.enum(['approved', 'paid']),
});

export type ProposalItem = z.infer<typeof ProposalItemSchema>;
export type CreateProposal = z.infer<typeof CreateProposalSchema>;

export const ItemFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string(),
  scheduledAt: z.string().min(1, 'Date & time is required'),
  price: z.number().positive('Must be a positive amount'),
});

export type ItemFormValues = z.infer<typeof ItemFormSchema>;
