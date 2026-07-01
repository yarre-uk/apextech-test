import { ApprovePayPanel } from './approve-pay-panel'
import { ProposalHeader } from './proposal-header'
import { ItineraryTimeline } from './itinerary-timeline'
import { formatCurrency } from '@/modules/member/utils'
import type { ProposalDetailData } from '@/modules/member/types'

interface ProposalViewProps {
  proposal: ProposalDetailData
}

export function ProposalView({ proposal }: ProposalViewProps) {
  const total = proposal.items.reduce((sum, item) => sum + item.price, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      <ProposalHeader proposal={proposal} />

      <div className="max-w-2xl mx-auto px-6 py-8 space-y-8">
        {proposal.notes && (
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
              Note from your concierge
            </p>
            <p className="text-sm text-gray-700">{proposal.notes}</p>
          </div>
        )}

        <ItineraryTimeline items={proposal.items} />

        <div className="bg-white rounded-lg border border-gray-200 p-4 flex justify-between items-center">
          <p className="text-sm font-semibold text-gray-900">Total</p>
          <p className="text-lg font-semibold text-gray-900">{formatCurrency(total)}</p>
        </div>

        <ApprovePayPanel proposalId={proposal.id} status={proposal.status} />
      </div>
    </div>
  )
}
