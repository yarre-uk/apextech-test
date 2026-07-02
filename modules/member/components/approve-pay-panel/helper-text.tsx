export function HelperText({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-serif italic text-[#938A76] text-center" style={{ fontSize: '16px', fontWeight: 400 }}>
      {children}
    </p>
  )
}
