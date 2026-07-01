import { ExternalLink, Package } from 'lucide-react'
import { StatusBadge } from './status-badge'
import type { ProposalData } from '@/lib/types'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

interface ProposalsListProps {
  proposals: ProposalData[]
}

export function ProposalsList({ proposals }: ProposalsListProps) {
  return (
    <div>
      <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4">
        Proposal History
      </h2>

      {proposals.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-200 px-4 py-8 text-center text-sm text-gray-400">
          No proposals yet
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {proposals.map((proposal) => (
            <a
              key={proposal.id}
              href={`/proposal/${proposal.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col gap-2 rounded-lg border border-gray-200 bg-white p-4 hover:border-gray-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-center justify-between gap-2">
                <StatusBadge status={proposal.status} />
                <ExternalLink className="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-500 transition-colors" />
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Package className="w-3.5 h-3.5" />
                <span>{proposal._count.items} item{proposal._count.items !== 1 ? 's' : ''}</span>
                <span className="text-gray-300">·</span>
                <span>Created {formatDate(proposal.createdAt)}</span>
              </div>
              {proposal.sentAt && (
                <p className="text-xs text-gray-400">
                  Sent {formatDate(proposal.sentAt)} to{' '}
                  {proposal.reservation.member.name}
                </p>
              )}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
