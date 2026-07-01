import { create } from 'zustand'
import type { Category } from '@/modules/concierge/schemas'
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

export const useProposalStore = create<ProposalState>((set) => ({
  selectedCategory: 'Dining',
  items: [],
  notes: '',
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  addItem: (item) => set((s) => ({ items: [...s.items, item] })),
  removeItem: (localId) => set((s) => ({ items: s.items.filter((i) => i._localId !== localId) })),
  setNotes: (notes) => set({ notes }),
  reset: () => set({ items: [], notes: '', selectedCategory: 'Dining' }),
}))
