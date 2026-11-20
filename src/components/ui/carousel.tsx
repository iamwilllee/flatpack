import * as React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export type CarouselProps = {
  slides: React.ReactNode[]
  'aria-label'?: string
}

/** Horizontal slides with scroll snapping. No autoplay: the reader moves it. */
export function Carousel({ slides, 'aria-label': ariaLabel = 'Carousel' }: CarouselProps) {
  const view = React.useRef<HTMLDivElement>(null)
  const [index, setIndex] = React.useState(0)

  const go = (i: number) => {
    const el = view.current
    if (!el) return
    const n = Math.max(0, Math.min(slides.length - 1, i))
    el.scrollTo({ left: (el.children[n] as HTMLElement).offsetLeft - el.offsetLeft, behavior: 'smooth' })
  }
  const onScroll = () => {
    const el = view.current
    if (!el) return
    const w = (el.children[0] as HTMLElement | undefined)?.offsetWidth ?? 1
    setIndex(Math.round(el.scrollLeft / w))
  }

  return (
    <div data-slot="carousel" role="region" aria-roledescription="carousel" aria-label={ariaLabel}>
      <div data-slot="carousel-viewport" ref={view} onScroll={onScroll} tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'ArrowRight') { e.preventDefault(); go(index + 1) } if (e.key === 'ArrowLeft') { e.preventDefault(); go(index - 1) } }}>
        {slides.map((s, i) => (
          <div key={i} data-slot="carousel-slide" role="group" aria-roledescription="slide" aria-label={`${i + 1} / ${slides.length}`}>{s}</div>
        ))}
      </div>
      <div data-slot="carousel-footer">
        <div data-slot="carousel-dots">
          {slides.map((_, i) => <button key={i} type="button" data-slot="carousel-dot" data-active={i === index} aria-label={`Slide ${i + 1}`} onClick={() => go(i)} />)}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--fp-space-2)' }}>
          <span data-slot="carousel-count">{index + 1} / {slides.length}</span>
          <button type="button" data-slot="button" data-variant="outline" data-size="icon" aria-label="Previous" disabled={index === 0} onClick={() => go(index - 1)} style={{ width: 'var(--fp-control-sm)', height: 'var(--fp-control-sm)' }}><ChevronLeft size={16} /></button>
          <button type="button" data-slot="button" data-variant="outline" data-size="icon" aria-label="Next" disabled={index === slides.length - 1} onClick={() => go(index + 1)} style={{ width: 'var(--fp-control-sm)', height: 'var(--fp-control-sm)' }}><ChevronRight size={16} /></button>
        </div>
      </div>
    </div>
  )
}
