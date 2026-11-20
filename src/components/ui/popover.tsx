import * as React from 'react'
import { Popover as BasePopover } from '@base-ui/react/popover'

/** Controlled (`open` + `onOpenChange`) or uncontrolled (`defaultOpen`). */
export function Popover({ children, ...props }: Omit<BasePopover.Root.Props, 'children'> & { children?: React.ReactNode }) {
  return (
    <BasePopover.Root {...props}>
      <div data-slot="popover">{children}</div>
    </BasePopover.Root>
  )
}

export type PopoverTriggerProps = Omit<BasePopover.Trigger.Props, 'className'> & {
  size?: 'sm' | 'md' | 'default' | 'lg'
  variant?: 'default' | 'secondary' | 'outline' | 'ghost'
  className?: string
}

export function PopoverTrigger({ size = 'md', variant = 'outline', className, render, ...props }: PopoverTriggerProps) {
  const own = render === undefined
  return (
    <BasePopover.Trigger
      className={className}
      render={render}
      {...(own ? { 'data-slot': 'button', 'data-variant': variant, 'data-size': size === 'md' ? 'default' : size } : {})}
      {...props}
    />
  )
}

export type PopoverContentProps = Omit<BasePopover.Popup.Props, 'className' | 'title'> & {
  title?: string
  side?: 'top' | 'bottom' | 'left' | 'right'
  align?: 'start' | 'center' | 'end'
  sideOffset?: number
  className?: string
}

export function PopoverContent({ title, children, side = 'bottom', align, sideOffset, className, ...props }: PopoverContentProps) {
  return (
    <BasePopover.Portal>
      <BasePopover.Positioner data-slot="popover-positioner" side={side} align={align} sideOffset={sideOffset}>
        <BasePopover.Popup data-slot="popover-content" data-side={side} className={className} {...props}>
          {title && <BasePopover.Title render={<div data-slot="popover-title">{title}</div>} />}
          <div data-slot="popover-body">{children}</div>
        </BasePopover.Popup>
      </BasePopover.Positioner>
    </BasePopover.Portal>
  )
}
