import { formatDateTime, formatCurrency, groupByDay } from '@/modules/member/utils'
import type { ProposalItem } from '@/modules/member/types'

function ItineraryItem({ item }: { item: ProposalItem }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
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
        <p className="text-sm font-medium text-gray-900 shrink-0">{formatCurrency(item.price)}</p>
      </div>
    </div>
  )
}

interface ItineraryTimelineProps {
  items: ProposalItem[]
}

export function ItineraryTimeline({ items }: ItineraryTimelineProps) {
  const byDay = groupByDay(items)
  return (
    <div className="space-y-6">
      {Object.entries(byDay).map(([day, dayItems]) => (
        <div key={day}>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
            {new Date(day).toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </p>
          <div className="space-y-2">
            {dayItems.map((item) => (
              <ItineraryItem key={item.id} item={item} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
