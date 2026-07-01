import { env } from '@/lib/env'
import type { ReservationData } from '@/modules/concierge/types'

export async function getReservation(): Promise<ReservationData | null> {
  const res = await fetch(`${env.APP_URL}/api/reservations`, { cache: 'no-store' })
  if (!res.ok) return null
  return res.json()
}
