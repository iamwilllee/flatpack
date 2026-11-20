import * as React from 'react'
import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip'

export type TooltipProps = {
  content: React.ReactNode
  side?: 'top' | 'bottom'
  children: React.ReactElement
}

export function Tooltip({ content, side = 'top', children }: TooltipProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <BaseTooltip.Provider delay={120}>
      <BaseTooltip.Root open={open} onOpenChange={setOpen}>
        <BaseTooltip.Trigger
          render={<span data-slot="tooltip">{children}</span>}
        />
        <BaseTooltip.Portal>
          <BaseTooltip.Positioner side={side} sideOffset={8}>
            <BaseTooltip.Popup data-slot="tooltip-content" data-side={side} role="tooltip" style={{ pointerEvents: 'none' }}>
              {content}
            </BaseTooltip.Popup>
          </BaseTooltip.Positioner>
        </BaseTooltip.Portal>
      </BaseTooltip.Root>
    </BaseTooltip.Provider>
  )
}
