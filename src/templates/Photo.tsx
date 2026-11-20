import * as React from 'react'
import { PHOTOS, type PhotoKey } from '@/site/photos'

/**
 * Photo slot. While the image loads, or if the network is down, the slot is a
 * plain light neutral block (--fp-surface) with no text, so it never reads as
 * a broken image.
 */
export function Photo({
  of,
  alt,
  ratio = '4:3',
  style,
  className,
}: {
  of: PhotoKey
  alt: string
  ratio?: 'square' | '4:3' | '16:9' | '3:4'
  style?: React.CSSProperties
  className?: string
}) {
  const [loaded, setLoaded] = React.useState(false)
  const [failed, setFailed] = React.useState(false)
  const pad = { square: '100%', '4:3': '75%', '3:4': '133%', '16:9': '56.25%' }[ratio]

  return (
    <div
      className={className}
      data-slot="photo"
      style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', ...style }}
    >
      {!failed && (
        <img
          src={PHOTOS[of]}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover',
            opacity: loaded ? 1 : 0,
            transition: 'opacity var(--fp-duration) var(--fp-ease)',
          }}
        />
      )}
      {/* ratio spacer keeps layout stable without fixing height */}
      <span style={{ display: 'block', paddingTop: pad }} />
    </div>
  )
}
