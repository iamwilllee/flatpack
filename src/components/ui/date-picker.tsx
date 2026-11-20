import * as React from 'react'
import { Popover as BasePopover } from '@base-ui/react/popover'
import { CalendarDays } from 'lucide-react'
import { Calendar, type DateRange } from '@/components/ui/calendar'

type Shared = {
  placeholder?: string
  locale?: string
  min?: Date
  max?: Date
  disabled?: boolean
  /** Controlled popover (`open` + `onOpenChange`). */
  open?: boolean
  onOpenChange?: (open: boolean) => void
  /** Form field name: a hidden input carries the ISO date (`2026-11-20`, or `from/to` for a range). */
  name?: string
  id?: string
  className?: string
  'aria-label'?: string
  'aria-labelledby'?: string
  weekStartsOn?: 0 | 1
}

/** The three popover and field props every picker forwards. */
function useOpen({ open, onOpenChange }: Shared) {
  const [state, setState] = React.useState(false)
  return [open ?? state, (o: boolean) => { if (open === undefined) setState(o); onOpenChange?.(o) }] as const
}

const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

const fmt = (d: Date, locale?: string) => new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(d)

function Shell({ label, empty, disabled, open, setOpen, field, aria, id, className, children }: {
  label: string | null
  empty: string
  disabled?: boolean
  open: boolean
  setOpen: (o: boolean) => void
  /** Hidden form input(s), when the picker has a name. */
  field?: React.ReactNode
  aria: Pick<Shared, 'aria-label' | 'aria-labelledby'>
  id?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <BasePopover.Root open={open} onOpenChange={setOpen}>
      {field}
      <BasePopover.Trigger data-slot="date-picker-trigger" disabled={disabled} id={id} className={className} {...aria}>
        <span data-placeholder={label ? 'false' : 'true'}>{label ?? empty}</span>
        <CalendarDays size={16} />
      </BasePopover.Trigger>
      <BasePopover.Portal>
        <BasePopover.Positioner data-slot="date-picker-positioner" sideOffset={4} align="start">
          <BasePopover.Popup data-slot="date-picker-content">{children}</BasePopover.Popup>
        </BasePopover.Positioner>
      </BasePopover.Portal>
    </BasePopover.Root>
  )
}

/** One date in a popover calendar. Controlled (`value`) or uncontrolled (`defaultValue`). */
export function DatePicker(props: Shared & {
  value?: Date | null
  defaultValue?: Date | null
  onValueChange?: (d: Date) => void
}) {
  const { value, defaultValue = null, onValueChange, placeholder = 'Pick a date', locale, min, max, disabled, name, id, className, weekStartsOn } = props
  const [inner, setInner] = React.useState<Date | null>(defaultValue)
  const [open, setOpen] = useOpen(props)
  const current = value !== undefined ? value : inner
  return (
    <Shell
      label={current ? fmt(current, locale) : null}
      empty={placeholder}
      disabled={disabled}
      open={open}
      setOpen={setOpen}
      id={id}
      className={className}
      aria={{ 'aria-label': props['aria-label'], 'aria-labelledby': props['aria-labelledby'] }}
      field={name ? <input type="hidden" name={name} value={current ? iso(current) : ''} disabled={disabled} /> : null}
    >
      <Calendar value={current} min={min} max={max} locale={locale} weekStartsOn={weekStartsOn} onValueChange={(d) => { setInner(d); onValueChange?.(d); setOpen(false) }} />
    </Shell>
  )
}

/** A start and end date. The first click sets the start, the second the end. */
export function DateRangePicker(props: Shared & {
  value?: DateRange
  defaultValue?: DateRange
  onValueChange?: (r: DateRange) => void
}) {
  const { value, defaultValue = { from: null, to: null }, onValueChange, placeholder = 'Pick a range', locale, min, max, disabled, name, id, className, weekStartsOn } = props
  const [inner, setInner] = React.useState<DateRange>(defaultValue)
  const [open, setOpen] = useOpen(props)
  const current = value ?? inner
  const label = current.from ? `${fmt(current.from, locale)} – ${current.to ? fmt(current.to, locale) : '…'}` : null
  return (
    <Shell
      label={label}
      empty={placeholder}
      disabled={disabled}
      open={open}
      setOpen={setOpen}
      id={id}
      className={className}
      aria={{ 'aria-label': props['aria-label'], 'aria-labelledby': props['aria-labelledby'] }}
      field={name ? <input type="hidden" name={name} value={current.from ? `${iso(current.from)}/${current.to ? iso(current.to) : ''}` : ''} disabled={disabled} /> : null}
    >
      <Calendar
        mode="range"
        value={current}
        min={min}
        max={max}
        locale={locale}
        weekStartsOn={weekStartsOn}
        onValueChange={(r) => { setInner(r); onValueChange?.(r); if (r.from && r.to) setOpen(false) }}
      />
    </Shell>
  )
}
