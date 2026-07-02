import { formatPrice, groupByDay } from '@/modules/member/utils'
import type { ProposalItem } from '@/modules/member/types'

const CATEGORY_TINTS: Record<string, string> = {
  Dining:      '#B0603C',
  Wellness:    '#6E7B52',
  Excursions:  '#4A5B78',
  Activities:  '#3F6E63',
  Experiences: '#6E4A63',
  Transport:   '#8A6D3F',
}

const FALLBACK_TINT = '#938A76'

function formatTime(iso: string) {
  return new Date(iso).toLocaleString('en-US', { hour: 'numeric', minute: '2-digit' })
}

function nightCount(arrivalDate: string, departureDate: string) {
  const ms = new Date(departureDate).getTime() - new Date(arrivalDate).getTime()
  return Math.round(ms / (1000 * 60 * 60 * 24))
}

function ItineraryItem({ item }: { item: ProposalItem }) {
  const tint = CATEGORY_TINTS[item.category] ?? FALLBACK_TINT

  return (
    <article
      style={{
        background: '#FCFAF2',
        border: '1px solid rgba(33,28,20,0.12)',
        borderLeft: `2px solid ${tint}`,
        padding: '24px 30px 26px',
        marginBottom: '14px',
      }}
    >
      {/* Meta row */}
      <div className="flex justify-between items-baseline gap-6">
        <div className="flex items-center gap-2.5">
          {/* Diamond marker */}
          <span className="shrink-0" style={{ display: 'inline-block', width: '7px', height: '7px', background: tint, transform: 'rotate(45deg)' }} />
          <span
            className="font-display uppercase"
            style={{ fontSize: '10.5px', letterSpacing: '0.2em', fontWeight: 500, color: tint }}
          >
            {item.category}
          </span>
          <span className="text-[#938A76]" style={{ fontSize: '12px' }}>·</span>
          <span className="font-display text-[#938A76]" style={{ fontSize: '12px', letterSpacing: '0.05em', fontWeight: 400 }}>
            {formatTime(item.scheduledAt)}
          </span>
        </div>
        <span
          className="font-serif text-[#211C14] shrink-0"
          style={{ fontSize: '24px', fontWeight: 500, fontVariantNumeric: 'tabular-nums' }}
        >
          {formatPrice(item.price)}
        </span>
      </div>

      {/* Title */}
      <h4
        className="font-serif text-[#211C14] mt-3"
        style={{ fontSize: '27px', fontWeight: 500, letterSpacing: '-0.005em', lineHeight: 1.18 }}
      >
        {item.title}
      </h4>

      {/* Description */}
      {item.description && (
        <p
          className="font-serif text-[#6B6151] mt-2"
          style={{ fontSize: '18px', fontWeight: 400, lineHeight: 1.5, maxWidth: '600px', textWrap: 'pretty' } as React.CSSProperties}
        >
          {item.description}
        </p>
      )}
    </article>
  )
}

interface ItineraryTimelineProps {
  items: ProposalItem[]
  arrivalDate: string
  departureDate: string
}

export function ItineraryTimeline({ items, arrivalDate, departureDate }: ItineraryTimelineProps) {
  const byDay = groupByDay(items)
  const nights = nightCount(arrivalDate, departureDate)

  return (
    <div>
      {/* Section header */}
      <div className="flex items-baseline gap-4 mb-9">
        <h2 className="font-serif text-[#211C14]" style={{ fontSize: '30px', fontWeight: 500, letterSpacing: '-0.01em' }}>
          Your Itinerary
        </h2>
        <span className="font-display text-[#A6853F] uppercase" style={{ fontSize: '11px', letterSpacing: '0.2em', fontWeight: 400 }}>
          {nights} {nights === 1 ? 'night' : 'nights'}
        </span>
      </div>

      {/* Days */}
      <div className="space-y-8">
        {Object.entries(byDay).map(([day, dayItems]) => {
          const date = new Date(day)
          const weekday = date.toLocaleDateString('en-US', { weekday: 'long' })
          const monthDay = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })

          return (
            <div key={day}>
              {/* Day heading */}
              <div className="flex items-baseline gap-4 mb-4">
                <span className="font-serif text-[#211C14]" style={{ fontSize: '24px', fontWeight: 500 }}>
                  {weekday}
                </span>
                <span className="font-display text-[#938A76] uppercase" style={{ fontSize: '12px', letterSpacing: '0.12em', fontWeight: 400 }}>
                  {monthDay}
                </span>
                <div className="flex-1 h-px bg-[rgba(33,28,20,0.12)]" />
              </div>

              {dayItems.map((item) => (
                <ItineraryItem key={item.id} item={item} />
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}
