'use client'

import { cn } from '@/lib/utils'
import { CATEGORIES, type Category } from '@/modules/concierge/constants'
import { CATEGORY_CONFIG } from './category-config'
import { useProposalStore } from '@/modules/concierge/store/proposal-store'

export function CategorySelector() {
  const selectedCategory = useProposalStore((s) => s.selectedCategory)
  const setSelectedCategory = useProposalStore((s) => s.setSelectedCategory)

  return (
    <div>
      <p className="text-xs font-medium text-gray-500 mb-2">Category</p>
      <div className="grid grid-cols-3 gap-2">
        {CATEGORIES.map((cat) => {
          const { icon: Icon, color, activeColor } = CATEGORY_CONFIG[cat]
          const isActive = selectedCategory === cat
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat as Category)}
              className={cn(
                'flex flex-col items-center gap-1.5 rounded-lg border p-3 text-xs font-medium transition-all cursor-pointer',
                isActive ? activeColor : cn(color, 'hover:brightness-95'),
              )}
            >
              <Icon className="w-4 h-4" />
              {cat}
            </button>
          )
        })}
      </div>
    </div>
  )
}
