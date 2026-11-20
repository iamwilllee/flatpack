import * as React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export type DateRange = { from: Date | null; to: Date | null }

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate())
export const sameDay = (a?: Date | null, b?: Date | null) => !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
const addMonths = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth() + n, 1)
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n)

type Common = {
  /** First visible month. Defaults to the selected date or today. */
  defaultMonth?: Date
  min?: Date
  max?: Date
  /** 0 = Sunday, 1 = Monday */
  weekStartsOn?: 0 | 1
  locale?: string
}
export type CalendarProps =
  | (Common & { mode?: 'single'; value?: Date | null; onValueChange?: (d: Date) => void })
  | (Common & { mode: 'range'; value?: DateRange; onValueChange?: (r: DateRange) => void })

/** A month grid. Arrow keys move by day / week, PageUp / PageDown by month. */
export function Calendar(props: CalendarProps) {
  const { min, max, weekStartsOn = 1, locale } = props
  const selected = props.mode === 'range' ? props.value?.from ?? null : props.value ?? null
  const [month, setMonth] = React.useState(() => {
    const d = props.defaultMonth ?? selected ?? new Date()
    return new Date(d.getFullYear(), d.getMonth(), 1)
  })
  const [focus, setFocus] = React.useState<Date>(() => startOfDay(selected ?? new Date()))
  const [hover, setHover] = React.useState<Date | null>(null)
  const grid = React.useRef<HTMLDivElement>(null)
  const today = startOfDay(new Date())

  const title = new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long' }).format(month)
  const weekdays = Array.from({ length: 7 }, (_, i) =>
    new Intl.DateTimeFormat(locale, { weekday: 'narrow' }).format(new Date(2024, 0, 7 + ((i + weekStartsOn) % 7))),
  )
  const offset = (month.getDay() - weekStartsOn + 7) % 7
  const first = addDays(month, -offset)
  const days = Array.from({ length: 42 }, (_, i) => addDays(first, i))
  const disabled = (d: Date) => (!!min && d < startOfDay(min)) || (!!max && d > startOfDay(max))

  const range = props.mode === 'range' ? props.value : undefined
  const rangeEnd = range?.from && !range.to ? hover : range?.to ?? null
  const inRange = (d: Date) => {
    if (!range?.from || !rangeEnd) return false
    const [a, b] = range.from <= rangeEnd ? [range.from, rangeEnd] : [rangeEnd, range.from]
    return d > a && d < b
  }
  const isSelected = (d: Date) => (props.mode === 'range' ? sameDay(d, range?.from) || sameDay(d, range?.to) : sameDay(d, props.value))

  const choose = (d: Date) => {
    if (disabled(d)) return
    setFocus(d)
    if (d.getMonth() !== month.getMonth()) setMonth(new Date(d.getFullYear(), d.getMonth(), 1))
    if (props.mode === 'range') {
      const r = props.value
      if (!r?.from || r.to) props.onValueChange?.({ from: d, to: null })
      else props.onValueChange?.(d < r.from ? { from: d, to: r.from } : { from: r.from, to: d })
    } else props.onValueChange?.(d)
  }

  const move = (d: Date) => {
    setFocus(d)
    if (d.getMonth() !== month.getMonth() || d.getFullYear() !== month.getFullYear()) setMonth(new Date(d.getFullYear(), d.getMonth(), 1))
    requestAnimationFrame(() => grid.current?.querySelector<HTMLButtonElement>('[data-focus="true"]')?.focus())
  }
  const onKeyDown = (e: React.KeyboardEvent) => {
    const k = e.key
    const step: Record<string, () => Date> = {
      ArrowLeft: () => addDays(focus, -1), ArrowRight: () => addDays(focus, 1),
      ArrowUp: () => addDays(focus, -7), ArrowDown: () => addDays(focus, 7),
      PageUp: () => new Date(focus.getFullYear(), focus.getMonth() - 1, focus.getDate()),
      PageDown: () => new Date(focus.getFullYear(), focus.getMonth() + 1, focus.getDate()),
    }
    if (step[k]) { e.preventDefault(); move(step[k]()) }
  }

  return (
    <div data-slot="calendar">
      <div data-slot="calendar-header">
        <button type="button" data-slot="button" data-variant="ghost" data-size="icon" aria-label="Previous month" onClick={() => setMonth(addMonths(month, -1))} style={{ width: 'var(--fp-control-sm)', height: 'var(--fp-control-sm)' }}><ChevronLeft size={16} /></button>
        <span data-slot="calendar-title" aria-live="polite">{title}</span>
        <button type="button" data-slot="button" data-variant="ghost" data-size="icon" aria-label="Next month" onClick={() => setMonth(addMonths(month, 1))} style={{ width: 'var(--fp-control-sm)', height: 'var(--fp-control-sm)' }}><ChevronRight size={16} /></button>
      </div>
      <div data-slot="calendar-grid" role="grid" ref={grid} onKeyDown={onKeyDown} onMouseLeave={() => setHover(null)}>
        {weekdays.map((w, i) => <span key={i} data-slot="calendar-weekday" role="columnheader">{w}</span>)}
        {days.map((d) => {
          const focusable = sameDay(d, focus) || (!days.some((x) => sameDay(x, focus)) && sameDay(d, month))
          return (
            <button
              key={d.toISOString()}
              type="button"
              role="gridcell"
              data-slot="calendar-day"
              data-outside={d.getMonth() !== month.getMonth()}
              data-today={sameDay(d, today)}
              data-selected={isSelected(d)}
              data-in-range={inRange(d)}
              data-focus={focusable}
              aria-selected={isSelected(d)}
              aria-label={new Intl.DateTimeFormat(locale, { dateStyle: 'full' }).format(d)}
              tabIndex={focusable ? 0 : -1}
              disabled={disabled(d)}
              onClick={() => choose(d)}
              onMouseEnter={() => setHover(d)}
            >
              {d.getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}
