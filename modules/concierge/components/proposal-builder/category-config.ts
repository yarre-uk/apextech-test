import {
  UtensilsCrossed,
  Waves,
  Sparkles,
  Compass,
  Car,
  Star,
} from 'lucide-react'
import type { Category } from '@/modules/concierge/schemas'

export interface CategoryConfig {
  icon: React.ElementType
  color: string
  activeColor: string
}

export const CATEGORY_CONFIG: Record<Category, CategoryConfig> = {
  Dining: {
    icon: UtensilsCrossed,
    color: 'border-orange-200 text-orange-700 bg-orange-50',
    activeColor: 'border-orange-400 bg-orange-100 ring-2 ring-orange-300',
  },
  Activities: {
    icon: Waves,
    color: 'border-blue-200 text-blue-700 bg-blue-50',
    activeColor: 'border-blue-400 bg-blue-100 ring-2 ring-blue-300',
  },
  Wellness: {
    icon: Sparkles,
    color: 'border-purple-200 text-purple-700 bg-purple-50',
    activeColor: 'border-purple-400 bg-purple-100 ring-2 ring-purple-300',
  },
  Excursions: {
    icon: Compass,
    color: 'border-emerald-200 text-emerald-700 bg-emerald-50',
    activeColor: 'border-emerald-400 bg-emerald-100 ring-2 ring-emerald-300',
  },
  Transport: {
    icon: Car,
    color: 'border-gray-200 text-gray-700 bg-gray-50',
    activeColor: 'border-gray-400 bg-gray-100 ring-2 ring-gray-400',
  },
  Experiences: {
    icon: Star,
    color: 'border-amber-200 text-amber-700 bg-amber-50',
    activeColor: 'border-amber-400 bg-amber-100 ring-2 ring-amber-300',
  },
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price)
}

export function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}
