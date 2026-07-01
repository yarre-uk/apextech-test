import { getProposal } from '@/modules/member/api.server';
import { ProposalView } from '@/modules/member/components/proposal-view';
import { notFound } from 'next/navigation';

export default async function ProposalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const proposal = await getProposal(id);

  if (!proposal) notFound();

  if (proposal.status === 'draft') {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-400">
        This proposal has not been sent yet.
      </div>
    );
  }

  return <ProposalView proposal={proposal} />;
}
