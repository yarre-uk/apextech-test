'use client'

import { useState } from 'react'
import { Separator } from '@/components/ui/separator'
import { useProposalStore } from '@/modules/concierge/store/proposal-store'
import { CategorySelector } from './category-selector'
import { ItemForm } from './item-form'
import { ItemsList } from './items-list'
import { ProposalActions } from './proposal-actions'
import { ProposalPreviewDialog } from './proposal-preview-dialog'
import type { ReservationData } from '@/modules/concierge/types'

interface ProposalBuilderProps {
  reservation: ReservationData
  isSending: boolean
  successId: string | null
  sendError: string | null
  onSend: () => void
}

export function ProposalBuilder({
  reservation,
  isSending,
  successId,
  sendError,
  onSend,
}: ProposalBuilderProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const items = useProposalStore((s) => s.items)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
          New Proposal
        </h2>
        {successId && (
          <span className="text-sm font-medium text-emerald-600">✓ Proposal sent</span>
        )}
        {sendError && (
          <span className="text-sm font-medium text-red-500">{sendError}</span>
        )}
      </div>

      <CategorySelector />
      <Separator />
      <ItemForm arrivalDate={reservation.arrivalDate} departureDate={reservation.departureDate} />
      <Separator />

      <div>
        <p className="text-xs font-medium text-gray-500 mb-2">
          Proposal Items{items.length > 0 && ` (${items.length})`}
        </p>
        <ItemsList />
      </div>

      {items.length > 0 && (
        <>
          <Separator />
          <ProposalActions
            isSending={isSending}
            onSend={onSend}
            onOpenPreview={() => setIsPreviewOpen(true)}
          />
        </>
      )}

      <ProposalPreviewDialog
        open={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
        reservation={reservation}
        isSending={isSending}
        onConfirmSend={onSend}
      />
    </div>
  )
}
