import { getReservation } from '@/modules/concierge/api.server'
import { TripHeader } from '@/modules/concierge/components/trip-header'
import { ConciergeDashboard } from '@/modules/concierge/components/dashboard'

export const metadata = {
  title: 'Concierge Portal — Exclusive Resorts',
}

export default async function HomePage() {
  const reservation = await getReservation()

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
      <ConciergeDashboard reservation={reservation} initialProposals={reservation.proposals} />
    </div>
  )
}
