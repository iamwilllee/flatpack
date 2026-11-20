import * as React from 'react'

export type Status = 'default' | 'success' | 'danger' | 'idle'

/** An 8px square status mark with a label. Red and green only tint the mark and text. */
export function StatusDot({ status = 'default', children, ...props }: React.HTMLAttributes<HTMLSpanElement> & { status?: Status }) {
  return (
    <span data-slot="status-dot" data-status={status} {...props}>
      <span data-slot="status-dot-mark" aria-hidden="true" />
      {children}
    </span>
  )
}
