import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const STATUS_STYLES: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-600 border-gray-200',
  sent: 'bg-blue-50 text-blue-700 border-blue-200',
  approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  paid: 'bg-violet-50 text-violet-700 border-violet-200',
}

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge
      variant="outline"
      className={cn('capitalize font-medium', STATUS_STYLES[status] ?? STATUS_STYLES.draft)}
    >
      {status}
    </Badge>
  )
}
