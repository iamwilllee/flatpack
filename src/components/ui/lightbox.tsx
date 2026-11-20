import * as React from 'react'
import { Dialog as BaseDialog } from '@base-ui/react/dialog'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

export type LightboxImage = { src: string; alt: string; thumb?: string }

export type LightboxProps = {
  images: LightboxImage[]
  open: boolean
  index: number
  onOpenChange: (open: boolean) => void
  onIndexChange: (index: number) => void
}

/** Full-screen image viewer. ← / → change image, Esc closes. */
export function Lightbox({ images, open, index, onOpenChange, onIndexChange }: LightboxProps) {
  const img = images[index]
  const go = (i: number) => onIndexChange((i + images.length) % images.length)
  return (
    <BaseDialog.Root open={open} onOpenChange={(o) => onOpenChange(o)}>
      <BaseDialog.Portal>
        <BaseDialog.Popup
          data-slot="lightbox-content"
          aria-label="Image viewer"
          onKeyDown={(e) => { if (e.key === 'ArrowRight') go(index + 1); if (e.key === 'ArrowLeft') go(index - 1) }}
        >
          <div data-slot="lightbox-bar">
            <BaseDialog.Title style={{ margin: 0, fontSize: 'var(--fp-text-sm)', fontWeight: 'var(--fp-weight-medium)' }}>{img?.alt}</BaseDialog.Title>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--fp-space-3)' }}>
              <span className="fp-num fp-muted" style={{ fontSize: 'var(--fp-text-xs)' }}>{index + 1} / {images.length}</span>
              <BaseDialog.Close data-slot="button" data-variant="ghost" data-size="icon" aria-label="Close"><X size={16} /></BaseDialog.Close>
            </div>
          </div>
          <div data-slot="lightbox-stage">
            <button type="button" data-slot="button" data-variant="outline" data-size="icon" aria-label="Previous image" onClick={() => go(index - 1)}><ChevronLeft size={16} /></button>
            {img && <img data-slot="lightbox-image" src={img.src} alt={img.alt} />}
            <button type="button" data-slot="button" data-variant="outline" data-size="icon" aria-label="Next image" onClick={() => go(index + 1)}><ChevronRight size={16} /></button>
          </div>
          <div data-slot="lightbox-thumbs">
            {images.map((im, i) => (
              <button key={im.src} type="button" data-slot="lightbox-thumb" data-active={i === index} aria-label={im.alt} onClick={() => go(i)}>
                <img src={im.thumb ?? im.src} alt="" />
              </button>
            ))}
          </div>
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  )
}

/** A grid of thumbnails that opens the Lightbox. */
export function LightboxGallery({ images, columns = 3 }: { images: LightboxImage[]; columns?: number }) {
  const [open, setOpen] = React.useState(false)
  const [index, setIndex] = React.useState(0)
  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`, gap: 'var(--fp-space-2)' }}>
        {images.map((im, i) => (
          <button key={im.src} type="button" data-slot="lightbox-open" aria-label={`Open ${im.alt}`} onClick={() => { setIndex(i); setOpen(true) }}>
            <span data-slot="image" data-ratio="square"><img data-slot="image-element" src={im.thumb ?? im.src} alt={im.alt} loading="lazy" /></span>
          </button>
        ))}
      </div>
      <Lightbox images={images} open={open} index={index} onOpenChange={setOpen} onIndexChange={setIndex} />
    </>
  )
}
