import { z } from 'zod'

export const ItemFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string(),
  scheduledAt: z.string().min(1, 'Date & time is required'),
  price: z.number().positive('Must be a positive amount'),
})

export type ItemFormValues = z.infer<typeof ItemFormSchema>
