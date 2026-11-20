import * as React from 'react'

export function Kbd({ children, ...props }: React.HTMLAttributes<HTMLElement>) {
  return <kbd data-slot="kbd" {...props}>{children}</kbd>
}

/** A shortcut such as ⌘ K: one key per box. */
export function KbdGroup({ keys }: { keys: string[] }) {
  return (
    <span data-slot="kbd-group">
      {keys.map((k) => <Kbd key={k}>{k}</Kbd>)}
    </span>
  )
}
