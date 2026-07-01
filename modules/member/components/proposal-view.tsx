import { ApprovePayPanel } from './approve-pay-panel'
import type { ProposalDetailData } from '@/modules/concierge/types'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
}

interface ProposalViewProps {
  proposal: ProposalDetailData
}

export function ProposalView({ proposal }: ProposalViewProps) {
  const { reservation, items, notes } = proposal
  const total = items.reduce((sum, item) => sum + item.price, 0)

  const byDay = items.reduce<Record<string, typeof items>>((acc, item) => {
    const day = new Date(item.scheduledAt).toDateString()
    acc[day] = [...(acc[day] ?? []), item]
    return acc
  }, {})

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
          Itinerary Proposal
        </p>
        <h1 className="text-2xl font-semibold text-gray-900">
          {reservation.villa}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {reservation.destination} · {formatDate(reservation.arrivalDate)} – {formatDate(reservation.departureDate)}
        </p>
        <p className="text-sm text-gray-500 mt-0.5">
          Prepared for {reservation.member.name}
        </p>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8 space-y-8">
        {/* Notes */}
        {notes && (
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
              Note from your concierge
            </p>
            <p className="text-sm text-gray-700">{notes}</p>
          </div>
        )}

        {/* Itinerary */}
        <div className="space-y-6">
          {Object.entries(byDay).map(([day, dayItems]) => (
            <div key={day}>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
                {new Date(day).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
              <div className="space-y-2">
                {dayItems.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-gray-400">{item.category}</span>
                          <span className="text-gray-200">·</span>
                          <span className="text-xs text-gray-400">{formatDateTime(item.scheduledAt)}</span>
                        </div>
                        <p className="text-sm font-medium text-gray-900">{item.title}</p>
                        {item.description && (
                          <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                        )}
                      </div>
                      <p className="text-sm font-medium text-gray-900 shrink-0">
                        {formatCurrency(item.price)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 flex justify-between items-center">
          <p className="text-sm font-semibold text-gray-900">Total</p>
          <p className="text-lg font-semibold text-gray-900">{formatCurrency(total)}</p>
        </div>

        {/* Actions */}
        <ApprovePayPanel proposalId={proposal.id} status={proposal.status} />
      </div>
    </div>
  )
}
