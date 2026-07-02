import { ApprovePayPanel } from './approve-pay-panel'
import { ProposalHeader } from './proposal-header'
import { ItineraryTimeline } from './itinerary-timeline'
import { formatPrice } from '@/modules/member/utils'
import type { ProposalDetailData } from '@/modules/member/types'

interface ProposalViewProps {
  proposal: ProposalDetailData
}

export function ProposalView({ proposal }: ProposalViewProps) {
  const total = proposal.items.reduce((sum, item) => sum + item.price, 0)
  const { reservation } = proposal

  return (
    <div className="min-h-screen bg-[#F2ECDF]">
      <ProposalHeader proposal={proposal} />

      <div className="max-w-300 mx-auto px-6 md:px-10" style={{ paddingTop: '72px', paddingBottom: '140px' }}>
        <div className="flex flex-col md:grid gap-10 md:gap-15" style={{ gridTemplateColumns: 'minmax(0,1fr) 384px' }}>

          {/* Main content */}
          <div className="min-w-0 space-y-14">
            {proposal.notes && <ConciergeNote note={proposal.notes} />}
            <ItineraryTimeline
              items={proposal.items}
              arrivalDate={reservation.arrivalDate}
              departureDate={reservation.departureDate}
            />
          </div>

          {/* Sticky sidebar */}
          <div className="md:sticky md:top-8 space-y-4 self-start">
            {/* Summary card */}
            <div className="bg-[#FBF6EC]" style={{ border: '1px solid rgba(33,28,20,0.12)', padding: '34px 34px 30px' }}>
              <div className="flex items-baseline justify-between pb-4" style={{ borderBottom: '1px solid rgba(33,28,20,0.12)', marginBottom: '4px' }}>
                <span className="font-display text-[#A6853F] uppercase" style={{ fontSize: '11px', letterSpacing: '0.26em', fontWeight: 400 }}>
                  Summary
                </span>
                <span className="font-display text-[#938A76] uppercase" style={{ fontSize: '11px', letterSpacing: '0.12em', fontWeight: 400 }}>
                  {proposal.items.length} {proposal.items.length === 1 ? 'arrangement' : 'arrangements'}
                </span>
              </div>

              <div>
                {proposal.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-baseline gap-4 py-2.75"
                    style={{ borderBottom: '1px solid rgba(33,28,20,0.07)' }}
                  >
                    <span className="font-serif text-[#3B342A] truncate" style={{ fontSize: '18px', fontWeight: 400 }}>
                      {item.title}
                    </span>
                    <span className="font-serif text-[#938A76] shrink-0" style={{ fontSize: '18px', fontWeight: 400, fontVariantNumeric: 'tabular-nums' }}>
                      {formatPrice(item.price)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex justify-between items-baseline">
                <span className="font-display text-[#211C14] uppercase" style={{ fontSize: '19px', letterSpacing: '0.16em', fontWeight: 400 }}>
                  Total
                </span>
                <span className="font-serif text-[#211C14]" style={{ fontSize: '34px', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                  {formatPrice(total)}
                </span>
              </div>
              <p className="font-display text-[#938A76] text-right mt-1" style={{ fontSize: '11px', letterSpacing: '0.08em', fontWeight: 400 }}>
                USD · taxes &amp; gratuities included
              </p>
            </div>

            <ApprovePayPanel
              proposalId={proposal.id}
              status={proposal.status}
              memberName={reservation.member.name}
              arrivalDate={reservation.arrivalDate}
            />
          </div>

        </div>
      </div>
    </div>
  )
}

function ConciergeNote({ note }: { note: string }) {
  return (
    <figure
      className="relative"
      style={{ background: '#FBF6EC', border: '1px solid rgba(33,28,20,0.12)', borderLeft: '2px solid #A6853F', padding: '34px 40px 32px', marginBottom: '56px' }}
    >
      <span
        className="font-serif text-[#A6853F]/28 absolute select-none"
        style={{ top: '14px', left: '28px', fontSize: '64px', lineHeight: 1, color: 'rgba(166,133,63,0.28)' }}
      >
        &ldquo;
      </span>
      <figcaption className="font-display text-[#A6853F] uppercase ml-4 mb-3.5" style={{ fontSize: '11px', letterSpacing: '0.24em', fontWeight: 400 }}>
        A note from your concierge
      </figcaption>
      <blockquote
        className="font-serif italic text-[#3B342A]"
        style={{ fontSize: '23px', lineHeight: 1.52, maxWidth: '640px', textWrap: 'pretty' } as React.CSSProperties}
      >
        {note}
      </blockquote>
    </figure>
  )
}
