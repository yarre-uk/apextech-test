'use client'

import { useState } from 'react'
import {
  UtensilsCrossed,
  Waves,
  Sparkles,
  Compass,
  Car,
  Star,
  Trash2,
  Plus,
  Send,
  Eye,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { CATEGORIES, type Category } from '@/lib/schemas'
import type { DraftItem, ReservationData } from '@/lib/types'

const CATEGORY_CONFIG: Record<
  Category,
  { icon: React.ElementType; color: string; activeColor: string }
> = {
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

const EMPTY_FORM = {
  title: '',
  description: '',
  scheduledAt: '',
  price: '',
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price)
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

interface ProposalBuilderProps {
  reservation: ReservationData
  isSending: boolean
  successId: string | null
  onSend: (items: DraftItem[], notes: string) => Promise<void>
  onSuccess: () => void
}

export function ProposalBuilder({
  reservation,
  isSending,
  successId,
  onSend,
  onSuccess,
}: ProposalBuilderProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category>('Dining')
  const [form, setForm] = useState(EMPTY_FORM)
  const [items, setItems] = useState<DraftItem[]>([])
  const [notes, setNotes] = useState('')
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  function handleAddItem() {
    if (!form.title.trim() || !form.scheduledAt || !form.price) {
      setFormError('Title, date/time, and price are required.')
      return
    }
    const price = parseFloat(form.price)
    if (isNaN(price) || price <= 0) {
      setFormError('Price must be a positive number.')
      return
    }
    setFormError(null)
    setItems((prev) => [
      ...prev,
      {
        _localId: crypto.randomUUID(),
        category: selectedCategory,
        title: form.title.trim(),
        description: form.description.trim(),
        scheduledAt: new Date(form.scheduledAt).toISOString(),
        price,
      },
    ])
    setForm(EMPTY_FORM)
  }

  function handleRemoveItem(localId: string) {
    setItems((prev) => prev.filter((i) => i._localId !== localId))
  }

  async function handleSend() {
    await onSend(items, notes)
    setItems([])
    setNotes('')
    setForm(EMPTY_FORM)
  }

  const total = items.reduce((sum, i) => sum + i.price, 0)
  const canSend = items.length > 0 && !isSending

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
          New Proposal
        </h2>
        {successId && (
          <span className="text-sm font-medium text-emerald-600 flex items-center gap-1">
            ✓ Proposal sent successfully
          </span>
        )}
      </div>

      {/* Category selector */}
      <div>
        <p className="text-xs font-medium text-gray-500 mb-2">Category</p>
        <div className="grid grid-cols-3 gap-2">
          {CATEGORIES.map((cat) => {
            const config = CATEGORY_CONFIG[cat]
            const Icon = config.icon
            const isActive = selectedCategory === cat
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  'flex flex-col items-center gap-1.5 rounded-lg border p-3 text-xs font-medium transition-all cursor-pointer',
                  isActive ? config.activeColor : cn(config.color, 'hover:brightness-95'),
                )}
              >
                <Icon className="w-4 h-4" />
                {cat}
              </button>
            )
          })}
        </div>
      </div>

      <Separator />

      {/* Item form */}
      <div className="space-y-3">
        <p className="text-xs font-medium text-gray-500">Add Item</p>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <Label htmlFor="title" className="text-xs text-gray-600">
              Title
            </Label>
            <Input
              id="title"
              placeholder={`e.g. Private chef dinner`}
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="mt-1"
            />
          </div>
          <div className="col-span-2">
            <Label htmlFor="description" className="text-xs text-gray-600">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Add details for the member..."
              rows={2}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="mt-1 resize-none"
            />
          </div>
          <div>
            <Label htmlFor="scheduledAt" className="text-xs text-gray-600">
              Date &amp; Time
            </Label>
            <Input
              id="scheduledAt"
              type="datetime-local"
              value={form.scheduledAt}
              onChange={(e) => setForm((f) => ({ ...f, scheduledAt: e.target.value }))}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="price" className="text-xs text-gray-600">
              Price (USD)
            </Label>
            <Input
              id="price"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={form.price}
              onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
              className="mt-1"
            />
          </div>
        </div>
        {formError && <p className="text-xs text-red-500">{formError}</p>}
        <Button
          onClick={handleAddItem}
          variant="outline"
          size="sm"
          className="w-full gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          Add to Proposal
        </Button>
      </div>

      <Separator />

      {/* Items list */}
      <div>
        <p className="text-xs font-medium text-gray-500 mb-2">
          Proposal Items {items.length > 0 && `(${items.length})`}
        </p>
        {items.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4 rounded-lg border border-dashed border-gray-200">
            No items added yet
          </p>
        ) : (
          <div className="space-y-2">
            {items.map((item) => {
              const config = CATEGORY_CONFIG[item.category as Category]
              const Icon = config.icon
              return (
                <div
                  key={item._localId}
                  className="flex items-start gap-3 rounded-lg border border-gray-200 bg-white p-3"
                >
                  <div className={cn('rounded-md p-1.5 mt-0.5', config.color)}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                    {item.description && (
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                        {item.description}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-0.5">
                      {formatDateTime(item.scheduledAt)}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold text-gray-900">
                      {formatPrice(item.price)}
                    </p>
                    <button
                      onClick={() => handleRemoveItem(item._localId)}
                      className="text-gray-300 hover:text-red-400 transition-colors mt-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )
            })}
            <div className="flex justify-end pt-1">
              <p className="text-sm font-semibold text-gray-900">
                Total: {formatPrice(total)}
              </p>
            </div>
          </div>
        )}
      </div>

      {items.length > 0 && (
        <>
          <Separator />
          {/* Notes */}
          <div>
            <Label htmlFor="notes" className="text-xs text-gray-600">
              Message to Member <span className="text-gray-400">(optional)</span>
            </Label>
            <Textarea
              id="notes"
              placeholder="Add a personal note to include with the proposal..."
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-1 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setIsPreviewOpen(true)}
              className="flex-1 gap-1.5"
            >
              <Eye className="w-4 h-4" />
              Preview
            </Button>
            <Button
              onClick={handleSend}
              disabled={!canSend}
              className="flex-1 gap-1.5"
            >
              <Send className="w-4 h-4" />
              {isSending ? 'Sending…' : 'Send Proposal'}
            </Button>
          </div>
        </>
      )}

      {/* Preview dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Proposal Preview</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="rounded-lg bg-gray-50 p-4 text-sm">
              <p className="font-medium">{reservation.member.name}</p>
              <p className="text-gray-500 text-xs mt-0.5">
                {reservation.villa} · {reservation.destination}
              </p>
            </div>
            {notes && (
              <div className="text-sm text-gray-700 italic border-l-2 border-gray-200 pl-3">
                &ldquo;{notes}&rdquo;
              </div>
            )}
            <div className="space-y-2">
              {items.map((item) => {
                const config = CATEGORY_CONFIG[item.category as Category]
                const Icon = config.icon
                return (
                  <div
                    key={item._localId}
                    className="flex justify-between gap-3 rounded-md border border-gray-100 p-3"
                  >
                    <div className="flex items-start gap-2.5">
                      <div className={cn('rounded p-1 mt-0.5', config.color)}>
                        <Icon className="w-3 h-3" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{item.title}</p>
                        {item.description && (
                          <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                        )}
                        <p className="text-xs text-gray-400 mt-0.5">
                          {formatDateTime(item.scheduledAt)}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm font-semibold shrink-0">{formatPrice(item.price)}</p>
                  </div>
                )
              })}
            </div>
            <div className="flex justify-between border-t pt-3">
              <span className="text-sm font-medium">Total</span>
              <span className="text-sm font-bold">{formatPrice(total)}</span>
            </div>
            <Button
              className="w-full gap-1.5"
              onClick={() => {
                setIsPreviewOpen(false)
                handleSend()
              }}
              disabled={!canSend}
            >
              <Send className="w-4 h-4" />
              Confirm &amp; Send
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
