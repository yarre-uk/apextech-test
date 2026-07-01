import { env } from '@/lib/env';

interface ProposalEmailParams {
  proposalId: string;
  memberName: string;
  villa: string;
  destination: string;
  arrivalDate: Date;
  departureDate: Date;
  itemCount: number;
}

export function buildProposalEmailBody(params: ProposalEmailParams): string {
  const {
    proposalId,
    memberName,
    villa,
    destination,
    arrivalDate,
    departureDate,
    itemCount,
  } = params;
  const proposalUrl = `${env.APP_URL}/proposal/${proposalId}`;
  const experiences = `${itemCount} experience${itemCount !== 1 ? 's' : ''}`;

  return (
    `Dear ${memberName}, your curated itinerary for ${villa} in ${destination} ` +
    `(${arrivalDate.toDateString()} – ${departureDate.toDateString()}) is ready. ` +
    `It includes ${experiences}. ` +
    `View and approve your proposal: ${proposalUrl}`
  );
}
