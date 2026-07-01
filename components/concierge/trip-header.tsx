import { MapPin, Calendar, Moon } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import type { ReservationData } from '@/lib/types'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function nightsBetween(arrival: string, departure: string) {
  return Math.round(
    (new Date(departure).getTime() - new Date(arrival).getTime()) / 86_400_000,
  )
}

interface TripHeaderProps {
  reservation: ReservationData
}

export function TripHeader({ reservation }: TripHeaderProps) {
  const nights = nightsBetween(reservation.arrivalDate, reservation.departureDate)

  return (
    <div className="bg-gray-900 text-white px-6 py-5">
      <div className="max-w-7xl mx-auto">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
          Concierge Portal — Exclusive Resorts
        </p>
        <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
          <div>
            <p className="text-2xl font-semibold">{reservation.member.name}</p>
            <p className="text-sm text-gray-400">{reservation.member.email}</p>
          </div>
          <Separator orientation="vertical" className="h-10 bg-gray-700 hidden sm:block" />
          <div className="flex items-center gap-2 text-gray-300">
            <MapPin className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-sm font-medium text-white">{reservation.villa}</p>
              <p className="text-xs text-gray-400">{reservation.destination}</p>
            </div>
          </div>
          <Separator orientation="vertical" className="h-10 bg-gray-700 hidden sm:block" />
          <div className="flex items-center gap-2 text-gray-300">
            <Calendar className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-sm font-medium text-white">
                {formatDate(reservation.arrivalDate)} → {formatDate(reservation.departureDate)}
              </p>
              <p className="text-xs text-gray-400 flex items-center gap-1">
                <Moon className="w-3 h-3" />
                {nights} night{nights !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
