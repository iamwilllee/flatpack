import * as React from 'react'

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ['year', 31536000], ['month', 2592000], ['week', 604800],
  ['day', 86400], ['hour', 3600], ['minute', 60], ['second', 1],
]

/** "3 minutes ago" for a date, in the given locale. */
export function formatRelative(date: Date, now = new Date(), locale?: string) {
  const diff = Math.round((date.getTime() - now.getTime()) / 1000)
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })
  for (const [unit, sec] of UNITS) {
    if (Math.abs(diff) >= sec || unit === 'second') return rtf.format(Math.round(diff / sec), unit)
  }
  return ''
}

export type TimestampProps = Omit<React.TimeHTMLAttributes<HTMLTimeElement>, 'dateTime' | 'children'> & {
  date: Date | string | number
  /** relative ("3 min ago"), date, or datetime */
  format?: 'relative' | 'date' | 'datetime'
  locale?: string
  /** Refresh relative text every N ms. Off by default. */
  refreshMs?: number
}

/** A <time> element: relative or absolute, with the full date on hover. */
export function Timestamp({ date, format = 'relative', locale, refreshMs, ...props }: TimestampProps) {
  const d = React.useMemo(() => new Date(date), [date])
  const [now, setNow] = React.useState(() => new Date())
  React.useEffect(() => {
    if (!refreshMs || format !== 'relative') return
    const id = setInterval(() => setNow(new Date()), refreshMs)
    return () => clearInterval(id)
  }, [refreshMs, format])
  const full = new Intl.DateTimeFormat(locale, { dateStyle: 'long', timeStyle: 'short' }).format(d)
  const text = format === 'relative'
    ? formatRelative(d, now, locale)
    : new Intl.DateTimeFormat(locale, format === 'date' ? { dateStyle: 'medium' } : { dateStyle: 'medium', timeStyle: 'short' }).format(d)
  return <time data-slot="timestamp" dateTime={d.toISOString()} title={full} {...props}>{text}</time>
}
