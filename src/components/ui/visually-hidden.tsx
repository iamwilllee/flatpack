import * as React from 'react'

/** Hidden on screen, still read by screen readers. */
export function VisuallyHidden({ children, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return <span data-slot="visually-hidden" {...props}>{children}</span>
}
