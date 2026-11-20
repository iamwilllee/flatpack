import * as React from 'react'

export type DividerProps = React.HTMLAttributes<HTMLElement> & { label?: string; orientation?: 'horizontal' | 'vertical' }

export function Divider({ label, orientation = 'horizontal', ...props }: DividerProps) {
  if (orientation === 'vertical') return <span data-slot="divider" data-orientation="vertical" aria-hidden="true" {...props} />
  if (label) return <div data-slot="divider" data-orientation="horizontal" data-with-label="true" {...props}><span>{label}</span></div>
  return <hr data-slot="divider" data-orientation="horizontal" {...props} />
}
