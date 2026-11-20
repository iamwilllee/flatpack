import * as React from 'react'
import { PreviewCard } from '@base-ui/react/preview-card'

export type HoverCardProps = {
  /** The link or text that shows the card on hover / focus. */
  trigger: React.ReactNode
  href?: string
  children: React.ReactNode
  side?: 'top' | 'bottom' | 'left' | 'right'
  delay?: number
  className?: string
}

/** A preview that appears when hovering a link. Not for essential content: touch users may never see it. */
export function HoverCard({ trigger, href, children, side = 'bottom', delay = 300, className }: HoverCardProps) {
  return (
    <PreviewCard.Root>
      <PreviewCard.Trigger data-slot="hover-card-trigger" href={href} delay={delay}>{trigger}</PreviewCard.Trigger>
      <PreviewCard.Portal>
        <PreviewCard.Positioner data-slot="hover-card-positioner" side={side} sideOffset={8}>
          <PreviewCard.Popup data-slot="hover-card-content" className={className}>{children}</PreviewCard.Popup>
        </PreviewCard.Positioner>
      </PreviewCard.Portal>
    </PreviewCard.Root>
  )
}
