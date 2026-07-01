import type { ProposalStatus } from '@/modules/concierge/schemas'

export type { ProposalStatus }

export interface MemberData {
  id: string
  name: string
  email: string
}

export interface ReservationData {
  id: string
  destination: string
  villa: string
  arrivalDate: string
  departureDate: string
  member: MemberData
  proposals: ProposalData[]
}

export interface ProposalData {
  id: string
  status: ProposalStatus
  createdAt: string
  sentAt: string | null
  notes: string | null
  _count: { items: number }
  reservation: { member: MemberData }
}

export interface DraftItem {
  _localId: string
  category: string
  title: string
  description: string
  scheduledAt: string
  price: number
}
