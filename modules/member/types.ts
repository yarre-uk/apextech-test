import type { MemberData, ProposalStatus } from '@/modules/concierge/types';

export type { ProposalStatus };

export interface ProposalItem {
  id: string;
  category: string;
  title: string;
  description: string;
  scheduledAt: string;
  price: number;
}

export interface ProposalDetailData {
  id: string;
  status: ProposalStatus;
  notes: string | null;
  createdAt: string;
  sentAt: string | null;
  reservation: {
    destination: string;
    villa: string;
    arrivalDate: string;
    departureDate: string;
    member: MemberData;
  };
  items: ProposalItem[];
}
