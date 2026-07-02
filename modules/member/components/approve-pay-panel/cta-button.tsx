export type CtaVariant = 'dark' | 'gold'

const CTA_STYLES: Record<CtaVariant, React.CSSProperties> = {
  dark: { background: '#211C14', border: '1px solid #211C14', color: '#F4ECD8' },
  gold: { background: 'linear-gradient(180deg,#C79E4E,#A6813A)', border: '1px solid #A6853F', color: '#221B0E' },
}

const CTA_HOVER: Record<CtaVariant, (el: HTMLButtonElement) => void> = {
  dark: el => { el.style.background = '#2E2619' },
  gold: el => { el.style.filter = 'brightness(1.06)' },
}

const CTA_HOVER_OUT: Record<CtaVariant, (el: HTMLButtonElement) => void> = {
  dark: el => { el.style.background = '#211C14' },
  gold: el => { el.style.filter = '' },
}

interface CtaButtonProps {
  variant: CtaVariant
  label: string
  loadingLabel: string
  isLoading: boolean
  onClick: () => void
}

export function CtaButton({ variant, label, loadingLabel, isLoading, onClick }: CtaButtonProps) {
  return (
    <button
      className="w-full disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed transition-[background,filter] duration-200"
      disabled={isLoading}
      onClick={onClick}
      style={{
        ...CTA_STYLES[variant],
        padding: '20px',
        fontFamily: 'var(--font-jost)',
        fontSize: '13px',
        fontWeight: 400,
        letterSpacing: '0.24em',
        textTransform: 'uppercase',
      }}
      onMouseEnter={e => { if (!isLoading) CTA_HOVER[variant](e.currentTarget as HTMLButtonElement) }}
      onMouseLeave={e => { CTA_HOVER_OUT[variant](e.currentTarget as HTMLButtonElement) }}
    >
      {isLoading ? loadingLabel : label}
    </button>
  )
}
