import { ApprovalBanner } from './approval-banner'
import { CtaButton } from './cta-button'
import { HelperText } from './helper-text'

interface ApprovedCtaProps {
  isLoading: boolean
  onPay: () => void
}

export function ApprovedCta({ isLoading, onPay }: ApprovedCtaProps) {
  return (
    <>
      <ApprovalBanner />
      <CtaButton variant="gold" label="Pay & Lock In" loadingLabel="Processing…" isLoading={isLoading} onClick={onPay} />
      <HelperText>Secured payment · fully refundable up to 14 days before arrival.</HelperText>
    </>
  )
}
