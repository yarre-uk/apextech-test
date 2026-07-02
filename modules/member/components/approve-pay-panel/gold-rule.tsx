export function GoldRule({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 mt-6">
      <div className="flex-1 h-px bg-[rgba(33,28,20,0.12)]" />
      <span className="font-display text-[#A6853F] uppercase" style={{ fontSize: '10.5px', letterSpacing: '0.24em', fontWeight: 400 }}>
        {label}
      </span>
      <div className="flex-1 h-px bg-[rgba(33,28,20,0.12)]" />
    </div>
  )
}
