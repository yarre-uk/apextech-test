import { formatDate } from '@/modules/member/utils'
import type { ProposalDetailData, ProposalStatus } from '@/modules/member/types'

const STATUS_BADGE: Record<ProposalStatus, { label: string; style: React.CSSProperties }> = {
  draft: {
    label: 'Draft',
    style: { border: '1px solid rgba(201,162,75,0.3)', color: '#C9A24B' },
  },
  sent: {
    label: 'Awaiting Approval',
    style: { border: '1px solid rgba(201,162,75,0.55)', color: '#DFC078' },
  },
  approved: {
    label: 'Approved',
    style: { background: 'linear-gradient(180deg,#D9B463,#B58A38)', color: '#211C14', border: 'none' },
  },
  paid: {
    label: 'Confirmed',
    style: { background: '#3E4A2E', color: '#F4ECD8', border: '1px solid rgba(201,162,75,0.35)' },
  },
}

interface ProposalHeaderProps {
  proposal: ProposalDetailData
}

export function ProposalHeader({ proposal }: ProposalHeaderProps) {
  const { reservation, status } = proposal
  const badge = STATUS_BADGE[status]

  return (
    <div
      className="relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg,#1C1710 0%,#241C12 55%,#14100B 100%)', boxShadow: 'inset 0 -1px 0 rgba(201,162,75,0.35)' }}
    >
      <div className="relative max-w-300 mx-auto w-full flex flex-col" style={{ minHeight: '560px', padding: '56px 40px 60px' }}>
        {/* Top row */}
        <div className="flex items-center justify-between gap-4">
          <p className="font-display text-[#C9A24B] uppercase" style={{ fontSize: '12.5px', letterSpacing: '0.32em', fontWeight: 400 }}>
            Exclusive Resorts · Itinerary Proposal
          </p>
          <span
            className="font-display uppercase px-4 py-1.5 rounded-full"
            style={{ fontSize: '11px', letterSpacing: '0.2em', fontWeight: 400, ...badge.style }}
          >
            {badge.label}
          </span>
        </div>

        {/* Bottom block pushed to bottom */}
        <div className="mt-auto" style={{ paddingTop: '64px' }}>
          <h1
            className="font-serif text-[#F4ECD8] leading-none"
            style={{ fontSize: 'clamp(46px,6.4vw,80px)', fontWeight: 500, letterSpacing: '-0.01em' }}
          >
            {reservation.villa}
          </h1>
          <p
            className="font-serif italic mt-2"
            style={{ fontSize: 'clamp(20px,2.4vw,26px)', fontWeight: 400, color: 'rgba(244,236,216,0.72)' }}
          >
            {reservation.destination}
          </p>

          <div className="flex items-stretch mt-6">
            <DateChip label="Arrival" date={reservation.arrivalDate} side="left" />
            <div
              className="flex items-center justify-center font-display text-[#C9A24B]"
              style={{ width: '52px', borderTop: '1px solid rgba(201,162,75,0.4)', borderBottom: '1px solid rgba(201,162,75,0.4)', fontSize: '14px' }}
            >
              →
            </div>
            <DateChip label="Departure" date={reservation.departureDate} side="right" />
          </div>

          <p
            className="font-display uppercase mt-5 text-[#F4ECD8]/50"
            style={{ fontSize: '12px', letterSpacing: '0.16em', fontWeight: 400 }}
          >
            Prepared exclusively for {reservation.member.name}
          </p>
        </div>
      </div>
    </div>
  )
}

function DateChip({ label, date, side }: { label: string; date: string; side: 'left' | 'right' }) {
  const radius = side === 'left' ? '6px 0 0 6px' : '0 6px 6px 0'
  return (
    <div
      className="flex flex-col px-6 py-3.5"
      style={{
        minWidth: '180px',
        background: 'rgba(20,16,11,0.35)',
        border: '1px solid rgba(201,162,75,0.4)',
        borderRadius: radius,
      }}
    >
      <span className="font-display text-[#C9A24B] uppercase" style={{ fontSize: '10.5px', letterSpacing: '0.24em', fontWeight: 400 }}>
        {label}
      </span>
      <span className="font-serif text-[#F4ECD8] mt-0.5" style={{ fontSize: '22px', fontWeight: 400 }}>
        {formatDate(date)}
      </span>
    </div>
  )
}
