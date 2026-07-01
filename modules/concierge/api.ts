import type { DraftItem } from '@/modules/concierge/types'

export async function createProposal(
  reservationId: string,
  notes: string | undefined,
  items: Omit<DraftItem, '_localId'>[],
): Promise<{ id: string }> {
  const res = await fetch('/api/proposals', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reservationId, notes, items }),
  })
  if (!res.ok) throw new Error('Failed to create proposal')
  return res.json()
}

export async function sendProposal(proposalId: string): Promise<void> {
  const res = await fetch(`/api/proposals/${proposalId}/send`, { method: 'POST' })
  if (!res.ok) throw new Error('Failed to send proposal')
}
