import * as React from 'react'

export type MasonryKey = string | number
export type MasonryGap = number | Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl', number>>

export type MasonryItem<T = unknown> = {
  key: MasonryKey
  data?: T
  height?: number
  column?: number
  children?: React.ReactNode
}

export type MasonryProps<T = unknown> = {
  items: MasonryItem<T>[]
  /** fixed column count, or a per-breakpoint map */
  columns?: number | Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl', number>>
  /** gap between items: one value, a per-breakpoint map, or [horizontal, vertical] */
  gutter?: MasonryGap | [MasonryGap, MasonryGap]
  itemRender?: (item: MasonryItem<T>, index: number) => React.ReactNode
  /** called after distribution with each item's column index */
  onLayoutChange?: (layout: { key: MasonryKey; column: number }[]) => void
  /** re-measure when item heights change after mount */
  fresh?: boolean
  className?: string
  style?: React.CSSProperties
}

type Bp = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'
const BREAKPOINTS: { bp: Bp; min: number }[] = [
  { bp: 'xxl', min: 1600 }, { bp: 'xl', min: 1200 }, { bp: 'lg', min: 992 },
  { bp: 'md', min: 768 }, { bp: 'sm', min: 576 }, { bp: 'xs', min: 0 },
]

function pick<T>(v: T | Partial<Record<Bp, T>> | undefined, width: number, fallback: T): T {
  if (v == null) return fallback
  if (typeof v !== 'object') return v as T
  const match = BREAKPOINTS.find((b) => width >= b.min)?.bp ?? 'xs'
  const map = v as Partial<Record<Bp, T>>
  // walk from the matched breakpoint up to larger ones, then down
  const order: Bp[] = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl']
  const idx = order.indexOf(match)
  for (let i = idx; i >= 0; i--) {
    const val = map[order[i]]
    if (val != null) return val
  }
  for (let i = idx + 1; i < order.length; i++) {
    const val = map[order[i]]
    if (val != null) return val
  }
  return fallback
}

/**
 * Waterfall layout: items fill the shortest column, left to right.
 * Heights are measured before paint so the first paint is already correct.
 */
export function Masonry<T = unknown>({
  items,
  columns = 3,
  gutter = 0,
  itemRender,
  onLayoutChange,
  fresh = false,
  className,
  style,
}: MasonryProps<T>) {
  const hostRef = React.useRef<HTMLDivElement>(null)
  const probeRef = React.useRef<HTMLDivElement>(null)
  const [width, setWidth] = React.useState(0)
  const [viewport, setViewport] = React.useState(() => (typeof window === 'undefined' ? 1280 : window.innerWidth))
  const [heights, setHeights] = React.useState<Record<string, number>>({})

  React.useEffect(() => {
    if (typeof window === 'undefined') return
    const onResize = () => setViewport(window.innerWidth)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // breakpoints follow the viewport (xs/sm/md…), column width follows the container
  const colCount = Math.max(1, Math.round(pick(columns, viewport, 3)))
  const [hGap, vGap] = React.useMemo(() => {
    if (Array.isArray(gutter)) {
      return [pick(gutter[0], viewport, 0), pick(gutter[1], viewport, 0)]
    }
    const g = pick(gutter, viewport, 0)
    return [g, g]
  }, [gutter, viewport])

  const colWidth = width > 0 ? Math.max(0, (width - hGap * (colCount - 1)) / colCount) : 0

  React.useLayoutEffect(() => {
    const host = hostRef.current
    if (!host) return
    const measure = () => setWidth(host.clientWidth)
    measure()
    if (typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(measure)
    ro.observe(host)
    return () => ro.disconnect()
  }, [])

  // measure item heights in a hidden single-column probe
  const layoutKey = items.map((i) => i.key).join('|')
  React.useLayoutEffect(() => {
    const probe = probeRef.current
    if (!probe || colWidth <= 0) return
    const next: Record<string, number> = {}
    items.forEach((item, i) => {
      const node = probe.querySelector<HTMLElement>(`[data-fp-probe="${i}"]`)
      next[String(item.key)] = item.height ?? (node?.offsetHeight ?? 0)
    })
    setHeights((prev) => {
      const same = Object.keys(next).every((k) => prev[k] === next[k]) && Object.keys(prev).length === Object.keys(next).length
      return same ? prev : next
    })
  }, [layoutKey, colWidth, items, fresh])

  const layout = React.useMemo(() => {
    const cols: MasonryItem<T>[][] = Array.from({ length: colCount }, () => [])
    const used = Array.from({ length: colCount }, () => 0)
    const assigned: { key: MasonryKey; column: number }[] = []
    items.forEach((item) => {
      let col: number
      if (item.column != null && item.column >= 0 && item.column < colCount) {
        col = item.column
      } else {
        col = used.indexOf(Math.min(...used))
      }
      cols[col].push(item)
      used[col] += (heights[String(item.key)] ?? item.height ?? 0) + vGap
      assigned.push({ key: item.key, column: col })
    })
    return { cols, assigned }
  }, [items, colCount, heights, vGap])

  const layoutSignature = layout.assigned.map((a) => `${a.key}:${a.column}`).join(',')
  React.useEffect(() => {
    onLayoutChange?.(layout.assigned)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layoutSignature])

  const renderItem = (item: MasonryItem<T>, index: number) =>
    itemRender ? itemRender(item, index) : (item.children ?? null)

  return (
    <div ref={hostRef} data-slot="masonry" className={className} style={{ width: '100%', ...style }}>
      {/* hidden measurement pass — same width as a column, laid out before paint */}
      <div
        ref={probeRef}
        aria-hidden="true"
        style={{ position: 'absolute', width: colWidth || '100%', visibility: 'hidden', pointerEvents: 'none', left: -99999, top: 0 }}
      >
        {items.map((item, i) => (
          <div key={item.key} data-fp-probe={i}>{renderItem(item, i)}</div>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: hGap }}>
        {layout.cols.map((col, ci) => (
          <div key={ci} data-slot="masonry-column" style={{ flex: '1 1 0', minWidth: 0, display: 'flex', flexDirection: 'column', gap: vGap }}>
            {col.map((item) => {
              const index = items.indexOf(item)
              return (
                <div key={item.key} data-slot="masonry-item">{renderItem(item, index)}</div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}