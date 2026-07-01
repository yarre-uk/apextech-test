import { env } from '@/lib/env'
import type { ProposalDetailData } from '@/modules/member/types'

export async function getProposal(id: string): Promise<ProposalDetailData | null> {
  const res = await fetch(`${env.APP_URL}/api/proposals/${id}`, { cache: 'no-store' })
  if (res.status === 404) return null
  if (!res.ok) throw new Error('Failed to fetch proposal')
  return res.json()
}
