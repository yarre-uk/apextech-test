import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Category } from '@/modules/concierge/constants'
import type { DraftItem } from '@/modules/concierge/types'

interface ProposalState {
  selectedCategory: Category
  items: DraftItem[]
  notes: string
  setSelectedCategory: (category: Category) => void
  addItem: (item: DraftItem) => void
  removeItem: (localId: string) => void
  setNotes: (notes: string) => void
  reset: () => void
}

export const useProposalStore = create<ProposalState>()(
  persist(
    (set) => ({
      selectedCategory: 'Dining',
      items: [],
      notes: '',
      setSelectedCategory: (category) => set({ selectedCategory: category }),
      addItem: (item) => set((s) => ({ items: [...s.items, item] })),
      removeItem: (localId) => set((s) => ({ items: s.items.filter((i) => i._localId !== localId) })),
      setNotes: (notes) => set({ notes }),
      reset: () => set({ items: [], notes: '', selectedCategory: 'Dining' }),
    }),
    {
      name: 'proposal-draft',
      partialize: (state) => ({
        selectedCategory: state.selectedCategory,
        items: state.items,
        notes: state.notes,
      }),
    },
  ),
)
