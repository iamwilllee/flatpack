import * as React from 'react'
import { Toolbar as BaseToolbar } from '@base-ui/react/toolbar'
import { Toggle as BaseToggle } from '@base-ui/react/toggle'

/** A row of quiet actions above an editor or table. Arrow keys move between items. */
export function Toolbar({ children, ...props }: React.ComponentProps<typeof BaseToolbar.Root>) {
  return <BaseToolbar.Root data-slot="toolbar" {...props}>{children}</BaseToolbar.Root>
}

export function ToolbarGroup({ children, ...props }: React.ComponentProps<typeof BaseToolbar.Group>) {
  return <BaseToolbar.Group data-slot="toolbar-group" {...props}>{children}</BaseToolbar.Group>
}

export function ToolbarButton({ children, ...props }: React.ComponentProps<typeof BaseToolbar.Button>) {
  return <BaseToolbar.Button data-slot="toolbar-button" {...props}>{children}</BaseToolbar.Button>
}

/** A toolbar button that stays pressed (bold, italic …). */
export function ToolbarToggle({ children, pressed, defaultPressed, onPressedChange, ...props }: Omit<React.ComponentProps<typeof BaseToolbar.Button>, 'render'> & {
  pressed?: boolean
  defaultPressed?: boolean
  onPressedChange?: (pressed: boolean) => void
}) {
  return (
    <BaseToolbar.Button
      data-slot="toolbar-button"
      {...props}
      render={<BaseToggle pressed={pressed} defaultPressed={defaultPressed} onPressedChange={(p) => onPressedChange?.(p)} />}
    >
      {children}
    </BaseToolbar.Button>
  )
}

export function ToolbarSeparator() {
  return <BaseToolbar.Separator data-slot="toolbar-separator" />
}

/** Pushes the items after it to the far end. */
export function ToolbarSpacer() {
  return <span data-slot="toolbar-spacer" />
}
