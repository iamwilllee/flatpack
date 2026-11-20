import * as React from 'react'

/**
 * Loading indicator: three squares that change opacity in turn.
 * It only exists while something loads, so it is the one allowed animation;
 * with reduced motion it stays still.
 */
export function Spinner({ size = 'md', label = 'Loading', ...props }: Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'> & { size?: 'md' | 'lg'; label?: string }) {
  return (
    <span data-slot="spinner" data-size={size} role="status" aria-label={label} {...props}>
      <span data-slot="spinner-dot" />
      <span data-slot="spinner-dot" />
      <span data-slot="spinner-dot" />
    </span>
  )
}
