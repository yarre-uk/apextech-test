export async function patchProposalStatus(proposalId: string, status: 'approved' | 'paid') {
  const res = await fetch(`/api/proposals/${proposalId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  })
  if (!res.ok) throw new Error('Failed to update proposal status')
}
