'use client'

import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { ItemFormSchema, type ItemFormValues } from '@/modules/concierge/form-schemas'
import { useProposalStore } from '@/modules/concierge/store/proposal-store'

function toDateTimeLocal(iso: string) {
  return iso.slice(0, 16) // "2026-03-15T00:00"
}

function formatShort(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

interface ItemFormProps {
  arrivalDate: string
  departureDate: string
}

export function ItemForm({ arrivalDate, departureDate }: ItemFormProps) {
  const selectedCategory = useProposalStore((s) => s.selectedCategory)
  const addItem = useProposalStore((s) => s.addItem)

  const schema = useMemo(() => {
    const arrival = new Date(arrivalDate)
    const departure = new Date(departureDate)
    return ItemFormSchema.extend({
      scheduledAt: z
        .string()
        .min(1, 'Date & time is required')
        .refine(
          (val) => {
            const d = new Date(val)
            return d >= arrival && d <= departure
          },
          `Must fall within the stay: ${formatShort(arrivalDate)} – ${formatShort(departureDate)}`,
        ),
    })
  }, [arrivalDate, departureDate])

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ItemFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { description: '' },
  })

  function onSubmit(values: ItemFormValues) {
    addItem({
      _localId: crypto.randomUUID(),
      category: selectedCategory,
      title: values.title.trim(),
      description: values.description?.trim() ?? '',
      scheduledAt: new Date(values.scheduledAt).toISOString(),
      price: values.price,
    })
    reset()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <p className="text-xs font-medium text-gray-500">Add Item</p>
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <Label htmlFor="title" className="text-xs text-gray-600">
            Title
          </Label>
          <Input
            id="title"
            placeholder="e.g. Private chef dinner"
            className="mt-1"
            {...register('title')}
          />
          {errors.title && (
            <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>
          )}
        </div>

        <div className="col-span-2">
          <Label htmlFor="description" className="text-xs text-gray-600">
            Description
          </Label>
          <Textarea
            id="description"
            placeholder="Add details for the member..."
            rows={2}
            className="mt-1 resize-none"
            {...register('description')}
          />
        </div>

        <div>
          <Label htmlFor="scheduledAt" className="text-xs text-gray-600">
            Date &amp; Time
          </Label>
          <Input
            id="scheduledAt"
            type="datetime-local"
            min={toDateTimeLocal(arrivalDate)}
            max={toDateTimeLocal(departureDate)}
            className="mt-1"
            {...register('scheduledAt')}
          />
          {errors.scheduledAt && (
            <p className="text-xs text-red-500 mt-1">{errors.scheduledAt.message}</p>
          )}
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
            className="mt-1"
            {...register('price', { valueAsNumber: true })}
          />
          {errors.price && (
            <p className="text-xs text-red-500 mt-1">{errors.price.message}</p>
          )}
        </div>
      </div>

      <Button type="submit" variant="outline" size="sm" className="w-full gap-1.5">
        <Plus className="w-3.5 h-3.5" />
        Add to Proposal
      </Button>
    </form>
  )
}
