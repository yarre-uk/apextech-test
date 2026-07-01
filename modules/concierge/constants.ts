export const CATEGORIES = [
  'Dining',
  'Activities',
  'Wellness',
  'Excursions',
  'Transport',
  'Experiences',
] as const

export type Category = (typeof CATEGORIES)[number]
