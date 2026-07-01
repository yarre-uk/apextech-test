'use client'

import { Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { useProposalStore } from '@/modules/concierge/store/proposal-store'
import { CATEGORY_CONFIG, formatPrice, formatDateTime } from './category-config'
import type { Category } from '@/modules/concierge/schemas'
import type { ReservationData } from '@/modules/concierge/types'

interface ProposalPreviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  reservation: ReservationData
  isSending: boolean
  onConfirmSend: () => void
}

export function ProposalPreviewDialog({
  open,
  onOpenChange,
  reservation,
  isSending,
  onConfirmSend,
}: ProposalPreviewDialogProps) {
  const items = useProposalStore((s) => s.items)
  const notes = useProposalStore((s) => s.notes)
  const total = items.reduce((sum, i) => sum + i.price, 0)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Proposal Preview</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <div className="rounded-lg bg-gray-50 p-4 text-sm">
            <p className="font-medium">{reservation.member.name}</p>
            <p className="text-gray-500 text-xs mt-0.5">
              {reservation.villa} · {reservation.destination}
            </p>
          </div>

          {notes && (
            <p className="text-sm text-gray-700 italic border-l-2 border-gray-200 pl-3">
              &ldquo;{notes}&rdquo;
            </p>
          )}

          <div className="space-y-2">
            {items.map((item) => {
              const { icon: Icon, color } = CATEGORY_CONFIG[item.category as Category]
              return (
                <div
                  key={item._localId}
                  className="flex justify-between gap-3 rounded-md border border-gray-100 p-3"
                >
                  <div className="flex items-start gap-2.5">
                    <div className={cn('rounded p-1 mt-0.5 shrink-0', color)}>
                      <Icon className="w-3 h-3" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{item.title}</p>
                      {item.description && (
                        <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                      )}
                      <p className="text-xs text-gray-400 mt-0.5">
                        {formatDateTime(item.scheduledAt)}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold shrink-0">{formatPrice(item.price)}</p>
                </div>
              )
            })}
          </div>

          <div className="flex justify-between border-t pt-3">
            <span className="text-sm font-medium">Total</span>
            <span className="text-sm font-bold">{formatPrice(total)}</span>
          </div>

          <Button
            className="w-full gap-1.5"
            disabled={items.length === 0 || isSending}
            onClick={() => {
              onOpenChange(false)
              onConfirmSend()
            }}
          >
            <Send className="w-4 h-4" />
            Confirm &amp; Send
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
