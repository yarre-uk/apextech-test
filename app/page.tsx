import { prisma } from '@/lib/db'
import { TripHeader } from '@/components/concierge/trip-header'
import { ConciergeDashboard } from '@/components/concierge/dashboard'

export const metadata = {
  title: 'Concierge Portal — Exclusive Resorts',
}

export default async function HomePage() {
  const [reservation, proposals] = await Promise.all([
    prisma.reservation.findFirst({
      include: { member: true },
      orderBy: { arrivalDate: 'asc' },
    }),
    prisma.proposal.findMany({
      include: {
        reservation: { include: { member: true } },
        _count: { select: { items: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),
  ])

  if (!reservation) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-400">
        No active reservation found.
      </div>
    )
  }

  const reservationData = {
    id: reservation.id,
    destination: reservation.destination,
    villa: reservation.villa,
    arrivalDate: reservation.arrivalDate.toISOString(),
    departureDate: reservation.departureDate.toISOString(),
    member: reservation.member,
  }

  const proposalsData = proposals.map((p) => ({
    id: p.id,
    status: p.status,
    notes: p.notes,
    createdAt: p.createdAt.toISOString(),
    sentAt: p.sentAt?.toISOString() ?? null,
    _count: p._count,
    reservation: { member: p.reservation.member },
  }))

  return (
    <div className="min-h-screen bg-gray-50">
      <TripHeader reservation={reservationData} />
      <ConciergeDashboard
        reservation={reservationData}
        initialProposals={proposalsData}
      />
    </div>
  )
}
