import * as React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export type CarouselProps = {
  slides: React.ReactNode[]
  /** Controlled slide (0-based). Pair with onIndexChange. */
  index?: number
  defaultIndex?: number
  onIndexChange?: (index: number) => void
  className?: string
  'aria-label'?: string
  /** Accessible names, for localized products. */
  previousLabel?: string
  nextLabel?: string
  slideLabel?: (index: number, total: number) => string
}

/** Horizontal slides with scroll snapping. No autoplay: the reader moves it. */
export function Carousel({ slides, index: indexProp, defaultIndex = 0, onIndexChange, className, 'aria-label': ariaLabel = 'Carousel', previousLabel = 'Previous', nextLabel = 'Next', slideLabel = (i, n) => `${i} / ${n}` }: CarouselProps) {
  const view = React.useRef<HTMLDivElement>(null)
  const [indexState, setIndexState] = React.useState(defaultIndex)
  const index = indexProp ?? indexState

  const scrollTo = (i: number, behavior: ScrollBehavior = 'smooth') => {
    const el = view.current
    const slide = el?.children[i] as HTMLElement | undefined
    if (el && slide) el.scrollTo({ left: slide.offsetLeft - el.offsetLeft, behavior })
  }
  const go = (i: number) => {
    const n = Math.max(0, Math.min(slides.length - 1, i))
    scrollTo(n)
    if (indexProp === undefined) setIndexState(n)
    onIndexChange?.(n)
  }
  const onScroll = () => {
    const el = view.current
    if (!el) return
    const w = (el.children[0] as HTMLElement | undefined)?.offsetWidth ?? 1
    const next = Math.round(el.scrollLeft / w)
    if (next === index) return
    if (indexProp === undefined) setIndexState(next)
    onIndexChange?.(next)
  }
  // A controlled index moves the slides; an uncontrolled one follows the reader's scrolling.
  React.useEffect(() => {
    if (indexProp !== undefined) scrollTo(indexProp)
  }, [indexProp])

  return (
    <div data-slot="carousel" role="region" aria-roledescription="carousel" aria-label={ariaLabel} className={className}>
      <div data-slot="carousel-viewport" ref={view} onScroll={onScroll} tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'ArrowRight') { e.preventDefault(); go(index + 1) } if (e.key === 'ArrowLeft') { e.preventDefault(); go(index - 1) } }}>
        {slides.map((s, i) => (
          <div key={i} data-slot="carousel-slide" role="group" aria-roledescription="slide" aria-label={slideLabel(i + 1, slides.length)}>{s}</div>
        ))}
      </div>
      <div data-slot="carousel-footer">
        <div data-slot="carousel-dots">
          {slides.map((_, i) => <button key={i} type="button" data-slot="carousel-dot" data-active={i === index} aria-label={`Slide ${i + 1}`} onClick={() => go(i)} />)}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--fp-space-2)' }}>
          <span data-slot="carousel-count">{index + 1} / {slides.length}</span>
          <button type="button" data-slot="button" data-variant="outline" data-size="icon" aria-label={previousLabel} disabled={index === 0} onClick={() => go(index - 1)} style={{ width: 'var(--fp-control-sm)', height: 'var(--fp-control-sm)' }}><ChevronLeft size={16} /></button>
          <button type="button" data-slot="button" data-variant="outline" data-size="icon" aria-label={nextLabel} disabled={index === slides.length - 1} onClick={() => go(index + 1)} style={{ width: 'var(--fp-control-sm)', height: 'var(--fp-control-sm)' }}><ChevronRight size={16} /></button>
        </div>
      </div>
    </div>
  )
}
