export function ApprovalBanner() {
  return (
    <div
      className="flex items-center gap-3"
      style={{ background: '#F6EFDC', border: '1px solid rgba(166,133,63,0.4)', padding: '16px 20px' }}
    >
      <span
        className="shrink-0"
        style={{ display: 'inline-block', width: '9px', height: '9px', background: '#A6853F', transform: 'rotate(45deg)' }}
      />
      <p className="font-serif text-[#5A4A24]" style={{ fontSize: '17px', fontWeight: 400 }}>
        Approved — thank you. A single payment locks in every reservation.
      </p>
    </div>
  )
}
