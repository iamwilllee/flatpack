import * as React from 'react'

type ImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  ratio?: 'square' | '4:3' | '16:9' | '3:4'
  fallback?: React.ReactNode
}

export function Image({ ratio = '4:3', alt = '', className, fallback, ...props }: ImageProps) {
  const [failed, setFailed] = React.useState(false)
  return (
    <div data-slot="image" data-ratio={ratio} className={className}>
      {failed || !props.src
        ? (fallback ?? <span data-slot="image-fallback" role="img" aria-label={alt || undefined} />)
        : <img data-slot="image-element" alt={alt} onError={() => setFailed(true)} {...props} />}
    </div>
  )
}
