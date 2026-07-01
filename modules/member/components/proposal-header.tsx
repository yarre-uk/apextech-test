import { formatDate } from '@/modules/member/utils'
import type { ProposalDetailData } from '@/modules/member/types'

interface ProposalHeaderProps {
  proposal: ProposalDetailData
}

export function ProposalHeader({ proposal }: ProposalHeaderProps) {
  const { reservation } = proposal
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-6">
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
        Itinerary Proposal
      </p>
      <h1 className="text-2xl font-semibold text-gray-900">{reservation.villa}</h1>
      <p className="text-sm text-gray-500 mt-1">
        {reservation.destination} · {formatDate(reservation.arrivalDate)} – {formatDate(reservation.departureDate)}
      </p>
      <p className="text-sm text-gray-500 mt-0.5">Prepared for {reservation.member.name}</p>
    </div>
  )
}
