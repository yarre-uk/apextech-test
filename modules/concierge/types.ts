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
  status: string
  createdAt: string
  sentAt: string | null
  notes: string | null
  _count: { items: number }
  reservation: { member: MemberData }
}

export interface ProposalItem {
  id: string
  category: string
  title: string
  description: string
  scheduledAt: string
  price: number
}

export interface ProposalDetailData {
  id: string
  status: string
  notes: string | null
  createdAt: string
  sentAt: string | null
  reservation: {
    destination: string
    villa: string
    arrivalDate: string
    departureDate: string
    member: MemberData
  }
  items: ProposalItem[]
}

export interface DraftItem {
  _localId: string
  category: string
  title: string
  description: string
  scheduledAt: string
  price: number
}
