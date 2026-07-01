'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { patchProposalStatus } from '@/modules/member/api'
import type { ProposalStatus } from '@/modules/member/types'

interface ApprovePayPanelProps {
  proposalId: string
  status: ProposalStatus
}

export function ApprovePayPanel({ proposalId, status: initialStatus }: ApprovePayPanelProps) {
  const router = useRouter()
  const [status, setStatus] = useState<ProposalStatus>(initialStatus)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 text-center">
        <p className="text-sm font-semibold text-emerald-700">Proposal Locked In</p>
        <p className="text-xs text-emerald-600 mt-1">
          Your itinerary is confirmed. See you soon!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}

      {status === 'sent' && (
        <Button
          className="w-full"
          disabled={isLoading}
          onClick={() => handleTransition('approved')}
        >
          {isLoading ? 'Approving…' : 'Approve Proposal'}
        </Button>
      )}

      {status === 'approved' && (
        <>
          <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-center">
            <p className="text-xs text-blue-700 font-medium">You approved this proposal</p>
          </div>
          <Button
            className="w-full"
            disabled={isLoading}
            onClick={() => handleTransition('paid')}
          >
            {isLoading ? 'Processing…' : 'Pay & Lock In'}
          </Button>
        </>
      )}
    </div>
  )
}
