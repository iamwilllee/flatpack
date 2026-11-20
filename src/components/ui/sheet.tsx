import { Dialog as BaseDialog } from '@base-ui/react/dialog'
import { X } from 'lucide-react'

/** A side panel. Controlled (`open` + `onOpenChange`) or uncontrolled (`defaultOpen`). */
export function Sheet(props: BaseDialog.Root.Props) {
  return <BaseDialog.Root {...props} />
}

export type SheetTriggerProps = Omit<BaseDialog.Trigger.Props, 'className'> & {
  size?: 'sm' | 'md' | 'default' | 'lg'
  variant?: 'default' | 'secondary' | 'outline' | 'ghost'
  className?: string
}

export function SheetTrigger({ size = 'md', variant = 'outline', className, render, ...props }: SheetTriggerProps) {
  const own = render === undefined
  return (
    <BaseDialog.Trigger
      className={className}
      render={render}
      {...(own ? { 'data-slot': 'button', 'data-variant': variant, 'data-size': size === 'md' ? 'default' : size } : {})}
      {...props}
    />
  )
}

export type SheetContentProps = Omit<BaseDialog.Popup.Props, 'className' | 'title'> & {
  title: string
  className?: string
  /** Accessible name of the × button, for localized products. */
  closeLabel?: string
}

export function SheetContent({ title, children, className, closeLabel = 'Close', ...props }: SheetContentProps) {
  return (
    <BaseDialog.Portal>
      <BaseDialog.Backdrop data-slot="sheet-overlay" />
      <BaseDialog.Popup data-slot="sheet-content" className={className} {...props}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--fp-space-1)' }}>
          <BaseDialog.Title data-slot="sheet-title">{title}</BaseDialog.Title>
          <BaseDialog.Close data-slot="button" data-variant="ghost" data-size="icon" aria-label={closeLabel}>
            <X size={16} />
          </BaseDialog.Close>
        </div>
        {children}
      </BaseDialog.Popup>
    </BaseDialog.Portal>
  )
}
