import * as React from 'react'
import { Popover as BasePopover } from '@base-ui/react/popover'
import { CalendarDays } from 'lucide-react'
import { Calendar, type DateRange } from '@/components/ui/calendar'

type Shared = { placeholder?: string; locale?: string; min?: Date; max?: Date; disabled?: boolean }

const fmt = (d: Date, locale?: string) => new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(d)

function Shell({ label, empty, disabled, open, setOpen, children }: { label: string | null; empty: string; disabled?: boolean; open: boolean; setOpen: (o: boolean) => void; children: React.ReactNode }) {
  return (
    <BasePopover.Root open={open} onOpenChange={setOpen}>
      <BasePopover.Trigger data-slot="date-picker-trigger" disabled={disabled}>
        <span data-placeholder={label ? 'false' : 'true'}>{label ?? empty}</span>
        <CalendarDays size={16} />
      </BasePopover.Trigger>
      <BasePopover.Portal>
        <BasePopover.Positioner sideOffset={4} align="start" style={{ zIndex: 50 }}>
          <BasePopover.Popup data-slot="date-picker-content">{children}</BasePopover.Popup>
        </BasePopover.Positioner>
      </BasePopover.Portal>
    </BasePopover.Root>
  )
}

/** One date in a popover calendar. */
export function DatePicker({ value, defaultValue = null, onValueChange, placeholder = 'Pick a date', locale, min, max, disabled }: Shared & {
  value?: Date | null
  defaultValue?: Date | null
  onValueChange?: (d: Date) => void
}) {
  const [inner, setInner] = React.useState<Date | null>(defaultValue)
  const [open, setOpen] = React.useState(false)
  const current = value !== undefined ? value : inner
  return (
    <Shell label={current ? fmt(current, locale) : null} empty={placeholder} disabled={disabled} open={open} setOpen={setOpen}>
      <Calendar value={current} min={min} max={max} locale={locale} onValueChange={(d) => { setInner(d); onValueChange?.(d); setOpen(false) }} />
    </Shell>
  )
}

/** A start and end date. The first click sets the start, the second the end. */
export function DateRangePicker({ value, defaultValue = { from: null, to: null }, onValueChange, placeholder = 'Pick a range', locale, min, max, disabled }: Shared & {
  value?: DateRange
  defaultValue?: DateRange
  onValueChange?: (r: DateRange) => void
}) {
  const [inner, setInner] = React.useState<DateRange>(defaultValue)
  const [open, setOpen] = React.useState(false)
  const current = value ?? inner
  const label = current.from ? `${fmt(current.from, locale)} – ${current.to ? fmt(current.to, locale) : '…'}` : null
  return (
    <Shell label={label} empty={placeholder} disabled={disabled} open={open} setOpen={setOpen}>
      <Calendar
        mode="range"
        value={current}
        min={min}
        max={max}
        locale={locale}
        onValueChange={(r) => { setInner(r); onValueChange?.(r); if (r.from && r.to) setOpen(false) }}
      />
    </Shell>
  )
}
