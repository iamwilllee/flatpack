import * as React from 'react'
import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip'

export type TooltipProps = {
  content: React.ReactNode
  side?: 'top' | 'bottom' | 'left' | 'right'
  align?: 'start' | 'center' | 'end'
  sideOffset?: number
  /** Controlled (`open` + `onOpenChange`) or uncontrolled (`defaultOpen`). */
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  /** Milliseconds before it opens on hover. */
  delay?: number
  disabled?: boolean
  className?: string
  children: React.ReactElement
}

export function Tooltip({ content, side = 'top', align, sideOffset = 8, open, defaultOpen, onOpenChange, delay = 120, disabled, className, children }: TooltipProps) {
  return (
    <BaseTooltip.Provider delay={delay}>
      <BaseTooltip.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange} disabled={disabled}>
        <BaseTooltip.Trigger render={<span data-slot="tooltip">{children}</span>} />
        <BaseTooltip.Portal>
          <BaseTooltip.Positioner data-slot="tooltip-positioner" side={side} align={align} sideOffset={sideOffset}>
            <BaseTooltip.Popup data-slot="tooltip-content" data-side={side} role="tooltip" className={className} style={{ pointerEvents: 'none' }}>
              {content}
            </BaseTooltip.Popup>
          </BaseTooltip.Positioner>
        </BaseTooltip.Portal>
      </BaseTooltip.Root>
    </BaseTooltip.Provider>
  )
}
