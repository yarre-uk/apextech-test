'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { DraftItem, ProposalData, ReservationData } from '@/lib/types'
import { ProposalBuilder } from './proposal-builder'
import { ProposalsList } from './proposals-list'

interface ConciergeDashboardProps {
  reservation: ReservationData
  initialProposals: ProposalData[]
}

export function ConciergeDashboard({ reservation, initialProposals }: ConciergeDashboardProps) {
  const router = useRouter()
  const [isSending, setIsSending] = useState(false)
  const [successId, setSuccessId] = useState<string | null>(null)

  async function handleSend(items: DraftItem[], notes: string) {
    setIsSending(true)
    try {
      const createRes = await fetch('/api/proposals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reservationId: reservation.id,
          notes: notes || undefined,
          items: items.map(({ category, title, description, scheduledAt, price }) => ({
            category,
            title,
            description,
            scheduledAt,
            price,
          })),
        }),
      })

      if (!createRes.ok) throw new Error('Failed to create proposal')
      const proposal = await createRes.json()

      const sendRes = await fetch(`/api/proposals/${proposal.id}/send`, { method: 'POST' })
      if (!sendRes.ok) throw new Error('Failed to send proposal')

      setSuccessId(proposal.id)
      router.refresh()
      setTimeout(() => setSuccessId(null), 4000)
    } catch (err) {
      console.error(err)
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
            onSend={handleSend}
            onSuccess={() => setSuccessId(null)}
          />
        </div>
        <div className="lg:col-span-1">
          <ProposalsList proposals={initialProposals} />
        </div>
      </div>
    </div>
  )
}
