import * as React from 'react'

export type BeamStop = { color: string; percent: number }
export type BeamColor = string | BeamStop[]

export type BorderBeamItem = {
  color?: BeamColor
  lineWidth?: number | string
  size?: number | string
  outset?: number | string
}

export type BorderBeamProps = {
  children: React.ReactNode
  /** single color, or gradient stops (percent: 0–100) */
  color?: BeamColor
  /** number of beams spread evenly around the border */
  count?: number
  /** seconds for one full lap */
  duration?: number
  /** per-beam overrides; length wins over count */
  items?: BorderBeamItem[]
  /** stroke width of the beam */
  lineWidth?: number | string
  /** expands the beam layer outside the container edge (px or css length) */
  outset?: number | string
  /** visible length of each beam segment (px or css length) */
  size?: number | string
  /** corner radius of the beam path; defaults to inheriting the container's */
  radius?: number | string
  className?: string
  style?: React.CSSProperties
}

const px = (v: number | string | undefined, fallback: number) =>
  v == null ? fallback : typeof v === 'number' ? v : parseFloat(v) || fallback

function gradientStops(color: BeamColor | undefined, id: string) {
  if (!color) {
    return { stops: [{ color: 'var(--fp-ink)', percent: 0 }, { color: 'var(--fp-ink)', percent: 55 }, { color: 'transparent', percent: 100 }], id }
  }
  if (typeof color === 'string') {
    return { stops: [{ color, percent: 0 }, { color, percent: 70 }, { color: 'transparent', percent: 100 }], id }
  }
  return { stops: color, id }
}

/**
 * A line that travels along a container's border. Optional and decorative:
 * the Flatpack rules have no looping animation, so no page in this site uses
 * it. It never carries state (focus/validation/status), defaults to ink with
 * no glow, and stops for reduced motion.
 */
export function BorderBeam({
  children,
  color,
  count = 1,
  duration = 6,
  items,
  lineWidth = 1,
  outset = 0,
  size = 100,
  radius,
  className,
  style,
}: BorderBeamProps) {
  const hostRef = React.useRef<HTMLDivElement>(null)
  const rectRef = React.useRef<SVGRectElement>(null)
  const [box, setBox] = React.useState({ w: 0, h: 0 })
  const [len, setLen] = React.useState(0)

  const beams: BorderBeamItem[] = items && items.length > 0
    ? items
    : Array.from({ length: Math.max(1, Math.round(count)) }, () => ({}))

  React.useLayoutEffect(() => {
    const host = hostRef.current
    if (!host) return
    const measure = () => {
      const r = host.getBoundingClientRect()
      setBox({ w: r.width, h: r.height })
    }
    measure()
    if (typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(measure)
    ro.observe(host)
    return () => ro.disconnect()
  }, [])

  React.useLayoutEffect(() => {
    const el = rectRef.current
    if (!el || box.w === 0) return
    try { setLen(el.getTotalLength()) } catch { /* jsdom / unsupported */ }
  }, [box.w, box.h, radius, lineWidth])

  const os = px(outset, 0)
  const stroke = px(lineWidth, 1)
  const beamLen = px(size, 100)
  const r = radius == null ? undefined : radius

  const dashFor = (i: number) => {
    const b = beams[i]
    const l = px(b.size, beamLen)
    const gap = len > 0 ? Math.max(1, (len - l * beams.length) / beams.length) : l * 4
    // rotate each beam evenly around the path
    const offset = len > 0 ? (len / beams.length) * i : 0
    return { dash: `${l} ${gap}`, offset }
  }

  return (
    <div
      ref={hostRef}
      className={className}
      data-slot="border-beam"
      style={{ position: 'relative', borderRadius: r, ...style }}
    >
      {children}
      {box.w > 0 && (
        <svg
          data-slot="border-beam-svg"
          aria-hidden="true"
          width={box.w + os * 2}
          height={box.h + os * 2}
          viewBox={`${-os - stroke / 2} ${-os - stroke / 2} ${box.w + os * 2 + stroke} ${box.h + os * 2 + stroke}`}
          style={{ position: 'absolute', inset: -os, pointerEvents: 'none', overflow: 'visible' }}
        >
          <defs>
            {beams.map((b, i) => {
              const g = gradientStops(b.color ?? color, `fp-beam-${i}`)
              return (
                <linearGradient key={i} id={g.id} x1="0" y1="0" x2="1" y2="1">
                  {g.stops.map((s, j) => (
                    <stop key={j} offset={`${s.percent}%`} stopColor={s.color} />
                  ))}
                </linearGradient>
              )
            })}
          </defs>
          <rect
            ref={rectRef}
            x={0}
            y={0}
            width={box.w}
            height={box.h}
            rx={typeof r === 'number' ? r : undefined}
            fill="none"
            stroke="transparent"
          />
          {beams.map((b, i) => {
            const d = dashFor(i)
            const w = px(b.lineWidth, stroke)
            return (
              <rect
                key={i}
                x={0}
                y={0}
                width={box.w}
                height={box.h}
                rx={typeof r === 'number' ? r : undefined}
                fill="none"
                stroke={`url(#fp-beam-${i})`}
                strokeWidth={w}
                strokeLinecap="round"
                strokeDasharray={d.dash}
                data-slot="border-beam-path"
                style={{
                  animation: `fp-beam-travel ${duration}s linear infinite`,
                  ['--fp-beam-start' as string]: `${-d.offset}px`,
                  ['--fp-beam-len' as string]: `${len || 1}px`,
                  color: typeof (b.color ?? color) === 'string' ? (b.color ?? color) as string : 'var(--fp-ink)',
                }}
              />
            )
          })}
        </svg>
      )}
    </div>
  )
}