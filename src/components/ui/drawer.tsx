import * as React from 'react'
import { Drawer as BaseDrawer } from '@base-ui/react/drawer'
import { X } from 'lucide-react'

export type DrawerSide = 'bottom' | 'top' | 'left' | 'right'

const SWIPE: Record<DrawerSide, 'down' | 'up' | 'left' | 'right'> = { bottom: 'down', top: 'up', left: 'left', right: 'right' }
const SideContext = React.createContext<DrawerSide>('bottom')

export type DrawerProps = Omit<BaseDrawer.Root.Props, 'swipeDirection'> & {
  /** The edge it slides in from, and the direction a swipe dismisses it. Default bottom. */
  side?: DrawerSide
}

/**
 * A panel that slides in from an edge and closes with a swipe. Controlled (`open` + `onOpenChange`)
 * or uncontrolled (`defaultOpen`). `snapPoints` (bottom only) lets it rest at preset heights.
 * Sheet is the plain side panel; Drawer adds the gestures.
 */
export function Drawer({ side = 'bottom', ...props }: DrawerProps) {
  return (
    <SideContext.Provider value={side}>
      <BaseDrawer.Root swipeDirection={SWIPE[side]} {...props} />
    </SideContext.Provider>
  )
}

export type DrawerTriggerProps = Omit<BaseDrawer.Trigger.Props, 'className'> & {
  size?: 'sm' | 'md' | 'default' | 'lg'
  variant?: 'default' | 'secondary' | 'outline' | 'ghost'
  className?: string
}

/** A Button that opens the drawer. Pass `render` to use your own element. */
export function DrawerTrigger({ size = 'md', variant = 'outline', className, render, ...props }: DrawerTriggerProps) {
  const own = render === undefined
  return (
    <BaseDrawer.Trigger
      className={className}
      render={render}
      {...(own ? { 'data-slot': 'button', 'data-variant': variant, 'data-size': size === 'md' ? 'default' : size } : {})}
      {...props}
    />
  )
}

export type DrawerContentProps = Omit<BaseDrawer.Popup.Props, 'className' | 'title'> & {
  title: string
  description?: React.ReactNode
  className?: string
  /** The grab bar on bottom drawers. Default on. */
  showHandle?: boolean
  /** A corner × button. Off by default; a footer button usually closes it. */
  showCloseButton?: boolean
  /** Accessible name of the × button, for localized products. */
  closeLabel?: string
}

export function DrawerContent({ title, description, children, className, showHandle = true, showCloseButton = false, closeLabel = 'Close', ...props }: DrawerContentProps) {
  const side = React.useContext(SideContext)
  return (
    <BaseDrawer.Portal>
      <BaseDrawer.Backdrop data-slot="drawer-overlay" />
      <BaseDrawer.Viewport data-slot="drawer-viewport" data-side={side}>
        <BaseDrawer.Popup data-slot="drawer-content" data-side={side} className={className} {...props}>
          {side === 'bottom' && showHandle && <div data-slot="drawer-handle" aria-hidden="true" />}
          <BaseDrawer.Content data-slot="drawer-body">
            <div data-slot="drawer-header">
              <BaseDrawer.Title data-slot="drawer-title">{title}</BaseDrawer.Title>
              {description != null && <BaseDrawer.Description data-slot="drawer-description">{description}</BaseDrawer.Description>}
            </div>
            {children}
          </BaseDrawer.Content>
          {showCloseButton && (
            <BaseDrawer.Close data-slot="button" data-variant="ghost" data-size="icon-sm" aria-label={closeLabel} style={{ position: 'absolute', top: 'var(--fp-space-3)', right: 'var(--fp-space-3)' }}>
              <X size={16} />
            </BaseDrawer.Close>
          )}
        </BaseDrawer.Popup>
      </BaseDrawer.Viewport>
    </BaseDrawer.Portal>
  )
}

export function DrawerFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div data-slot="drawer-footer" className={className} {...props} />
}

/** Closes the drawer. A ghost Button by default; pass `render` to compose with another element. */
export function DrawerClose({ className, render, ...props }: Omit<BaseDrawer.Close.Props, 'className'> & { className?: string }) {
  const own = render === undefined
  return (
    <BaseDrawer.Close
      className={className}
      render={render}
      {...(own ? { 'data-slot': 'button', 'data-variant': 'ghost', 'data-size': 'default' } : {})}
      {...props}
    />
  )
}
