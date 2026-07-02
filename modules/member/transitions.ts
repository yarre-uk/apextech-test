export const VALID_TRANSITIONS: Record<string, string[]> = {
  sent: ['approved'],
  approved: ['paid'],
}

export function isValidTransition(from: string, to: string): boolean {
  return VALID_TRANSITIONS[from]?.includes(to) ?? false
}
