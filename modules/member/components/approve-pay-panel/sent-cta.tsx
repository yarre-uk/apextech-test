import { CtaButton } from './cta-button'
import { HelperText } from './helper-text'

interface SentCtaProps {
  isLoading: boolean
  onApprove: () => void
}

export function SentCta({ isLoading, onApprove }: SentCtaProps) {
  return (
    <>
      <CtaButton variant="dark" label="Approve Proposal" loadingLabel="Approving…" isLoading={isLoading} onClick={onApprove} />
      <HelperText>No payment is required to approve. We will hold every reservation for 48 hours.</HelperText>
    </>
  )
}
