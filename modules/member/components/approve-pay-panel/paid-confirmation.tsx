import { CheckSeal } from './check-seal'
import { GoldRule } from './gold-rule'

interface PaidConfirmationProps {
  memberName: string
  arrivalMonth: string
}

export function PaidConfirmation({ memberName, arrivalMonth }: PaidConfirmationProps) {
  return (
    <div
      className="text-center"
      style={{ background: '#FBF6EC', border: '1px solid rgba(62,74,46,0.4)', padding: '32px 28px' }}
    >
      <CheckSeal />
      <h3 className="font-serif text-[#211C14]" style={{ fontSize: '28px', fontWeight: 500 }}>
        You&rsquo;re Confirmed
      </h3>
      <p
        className="font-serif text-[#6B6151] mt-3"
        style={{ fontSize: '18px', lineHeight: 1.5, textWrap: 'pretty' } as React.CSSProperties}
      >
        Your stay is locked in, {memberName}. A full itinerary and villa details are on their way to your inbox.
      </p>
      <GoldRule label={`See you in ${arrivalMonth}`} />
    </div>
  )
}
