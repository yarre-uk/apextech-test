'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useProposalStore } from '@/modules/concierge/store/proposal-store'
import { createProposal, sendProposal } from '@/modules/concierge/api'
import { ProposalBuilder } from './proposal-builder'
import { ProposalsList } from './proposals-list'
import type { ProposalData, ReservationData } from '@/modules/concierge/types'

interface ConciergeDashboardProps {
  reservation: ReservationData
  initialProposals: ProposalData[]
}

export function ConciergeDashboard({ reservation, initialProposals }: ConciergeDashboardProps) {
  const router = useRouter()
  const { items, notes, reset } = useProposalStore()
  const [isSending, setIsSending] = useState(false)
  const [successId, setSuccessId] = useState<string | null>(null)
  const [sendError, setSendError] = useState<string | null>(null)

  async function handleSend() {
    if (items.length === 0) return
    setIsSending(true)
    setSendError(null)
    try {
      const proposal = await createProposal(
        reservation.id,
        notes || undefined,
        items.map(({ category, title, description, scheduledAt, price }) => ({
          category, title, description, scheduledAt, price,
        })),
      )
      await sendProposal(proposal.id)

      reset()
      setSuccessId(proposal.id)
      router.refresh()
      setTimeout(() => setSuccessId(null), 4000)
    } catch {
      setSendError('Failed to send proposal. Please try again.')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ProposalBuilder
            reservation={reservation}
            isSending={isSending}
            successId={successId}
            sendError={sendError}
            onSend={handleSend}
          />
        </div>
        <div className="lg:col-span-1">
          <ProposalsList proposals={initialProposals} />
        </div>
      </div>
    </div>
  )
}
