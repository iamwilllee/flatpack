import * as React from 'react'
import { Popover as BasePopover } from '@base-ui/react/popover'

export function Popover({ children, defaultOpen = false }: { children: React.ReactNode; defaultOpen?: boolean }) {
  return (
    <BasePopover.Root defaultOpen={defaultOpen}>
      <div data-slot="popover">{children}</div>
    </BasePopover.Root>
  )
}

export function PopoverTrigger({ children, size = 'md', variant = 'outline' }: { children: React.ReactNode } & { size?: 'sm' | 'md' | 'lg'; variant?: 'default' | 'secondary' | 'outline' | 'ghost' }) {
  return (
    <BasePopover.Trigger render={<button data-slot="button" data-variant={variant} data-size={size === 'md' ? 'default' : size} type="button">{children}</button>} />
  )
}

export function PopoverContent({ title, children, side = 'bottom' }: { title?: string; children?: React.ReactNode; side?: 'top' | 'bottom' }) {
  return (
    <BasePopover.Portal>
      <BasePopover.Backdrop />
      <BasePopover.Positioner side={side}>
        <BasePopover.Popup data-slot="popover-content" data-side={side} role="dialog">
          {title && <BasePopover.Title render={<div data-slot="popover-title">{title}</div>} />}
          <div data-slot="popover-body">{children}</div>
        </BasePopover.Popup>
      </BasePopover.Positioner>
    </BasePopover.Portal>
  )
}
