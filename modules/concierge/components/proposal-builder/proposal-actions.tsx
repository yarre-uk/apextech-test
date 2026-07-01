'use client'

import { Eye, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useProposalStore } from '@/modules/concierge/store/proposal-store'

interface ProposalActionsProps {
  isSending: boolean
  onSend: () => void
  onOpenPreview: () => void
}

export function ProposalActions({ isSending, onSend, onOpenPreview }: ProposalActionsProps) {
  const notes = useProposalStore((s) => s.notes)
  const setNotes = useProposalStore((s) => s.setNotes)
  const items = useProposalStore((s) => s.items)

  const canSend = items.length > 0 && !isSending

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="notes" className="text-xs text-gray-600">
          Message to Member <span className="text-gray-400">(optional)</span>
        </Label>
        <Textarea
          id="notes"
          placeholder="Add a personal note to include with the proposal..."
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="mt-1 resize-none"
        />
      </div>

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onOpenPreview}
          disabled={!canSend}
          className="flex-1 gap-1.5"
        >
          <Eye className="w-4 h-4" />
          Preview
        </Button>
        <Button
          type="button"
          onClick={onSend}
          disabled={!canSend}
          className="flex-1 gap-1.5"
        >
          <Send className="w-4 h-4" />
          {isSending ? 'Sending…' : 'Send Proposal'}
        </Button>
      </div>
    </div>
  )
}
