import { env } from '@/lib/env'
import { TripHeader } from '@/modules/concierge/components/trip-header'
import { ConciergeDashboard } from '@/modules/concierge/components/dashboard'
import type { ReservationData, ProposalData } from '@/modules/concierge/types'

export const metadata = {
  title: 'Concierge Portal — Exclusive Resorts',
}

async function getReservation(): Promise<ReservationData | null> {
  const res = await fetch(`${env.APP_URL}/api/reservations`, { cache: 'no-store' })
  if (!res.ok) return null
  return res.json()
}

async function getProposals(): Promise<ProposalData[]> {
  const res = await fetch(`${env.APP_URL}/api/proposals`, { cache: 'no-store' })
  if (!res.ok) return []
  return res.json()
}

export default async function HomePage() {
  const [reservation, proposals] = await Promise.all([getReservation(), getProposals()])

  if (!reservation) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-400">
        No active reservation found.
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TripHeader reservation={reservation} />
      <ConciergeDashboard reservation={reservation} initialProposals={proposals} />
    </div>
  )
}
