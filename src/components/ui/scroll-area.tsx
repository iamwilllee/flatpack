import * as React from 'react'
import { ScrollArea as BaseScrollArea } from '@base-ui-components/react/scroll-area'

/** A scroll container with a thin square scrollbar that appears on hover. */
export function ScrollArea({ children, style, horizontal }: { children: React.ReactNode; style?: React.CSSProperties; horizontal?: boolean }) {
  return (
    <BaseScrollArea.Root data-slot="scroll-area" style={style}>
      <BaseScrollArea.Viewport data-slot="scroll-area-viewport">{children}</BaseScrollArea.Viewport>
      <BaseScrollArea.Scrollbar data-slot="scroll-area-scrollbar" orientation="vertical">
        <BaseScrollArea.Thumb data-slot="scroll-area-thumb" />
      </BaseScrollArea.Scrollbar>
      {horizontal && (
        <BaseScrollArea.Scrollbar data-slot="scroll-area-scrollbar" orientation="horizontal">
          <BaseScrollArea.Thumb data-slot="scroll-area-thumb" />
        </BaseScrollArea.Scrollbar>
      )}
    </BaseScrollArea.Root>
  )
}
