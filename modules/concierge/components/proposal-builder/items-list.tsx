'use client'

import { Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useProposalStore } from '@/modules/concierge/store/proposal-store'
import { CATEGORY_CONFIG, formatPrice, formatDateTime } from './category-config'
import type { Category } from '@/modules/concierge/schemas'

export function ItemsList() {
  const items = useProposalStore((s) => s.items)
  const removeItem = useProposalStore((s) => s.removeItem)
  const total = items.reduce((sum, i) => sum + i.price, 0)

  if (items.length === 0) {
    return (
      <p className="text-sm text-gray-400 text-center py-4 rounded-lg border border-dashed border-gray-200">
        No items added yet
      </p>
    )
  }

  return (
    <div className="space-y-2">
      {items.map((item) => {
        const { icon: Icon, color } = CATEGORY_CONFIG[item.category as Category]
        return (
          <div
            key={item._localId}
            className="flex items-start gap-3 rounded-lg border border-gray-200 bg-white p-3"
          >
            <div className={cn('rounded-md p-1.5 mt-0.5 shrink-0', color)}>
              <Icon className="w-3.5 h-3.5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
              {item.description && (
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{item.description}</p>
              )}
              <p className="text-xs text-gray-400 mt-0.5">{formatDateTime(item.scheduledAt)}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-sm font-semibold text-gray-900">{formatPrice(item.price)}</p>
              <button
                type="button"
                onClick={() => removeItem(item._localId)}
                className="text-gray-300 hover:text-red-400 transition-colors mt-1"
                aria-label="Remove item"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )
      })}
      <div className="flex justify-end pt-1">
        <p className="text-sm font-semibold text-gray-900">Total: {formatPrice(total)}</p>
      </div>
    </div>
  )
}
