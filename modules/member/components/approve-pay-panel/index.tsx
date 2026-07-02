'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { patchProposalStatus } from '@/modules/member/api'
import type { ProposalStatus } from '@/modules/member/types'
import { PaidConfirmation } from './paid-confirmation'
import { SentCta } from './sent-cta'
import { ApprovedCta } from './approved-cta'

interface ApprovePayPanelProps {
  proposalId: string
  status: ProposalStatus
  memberName: string
  arrivalDate: string
}

export function ApprovePayPanel({ proposalId, status: initialStatus, memberName, arrivalDate }: ApprovePayPanelProps) {
  const router = useRouter()
  const [status, setStatus] = useState<ProposalStatus>(initialStatus)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const arrivalMonth = new Date(arrivalDate).toLocaleString('en-US', { month: 'long' })

  async function handleTransition(next: 'approved' | 'paid') {
    setIsLoading(true)
    setError(null)
    try {
      await patchProposalStatus(proposalId, next)
      setStatus(next)
      router.refresh()
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (status === 'paid') {
    return <PaidConfirmation memberName={memberName} arrivalMonth={arrivalMonth} />
  }

  return (
    <div className="space-y-3">
      {error && (
        <p className="font-display text-center text-red-600" style={{ fontSize: '12px' }}>{error}</p>
      )}
      {status === 'sent' && (
        <SentCta isLoading={isLoading} onApprove={() => handleTransition('approved')} />
      )}
      {status === 'approved' && (
        <ApprovedCta isLoading={isLoading} onPay={() => handleTransition('paid')} />
      )}
    </div>
  )
}
