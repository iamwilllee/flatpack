import * as React from 'react'
import { Dialog as BaseDialog } from '@base-ui-components/react/dialog'

export function Dialog({ children, defaultOpen = false }: { children: React.ReactNode; defaultOpen?: boolean }) {
  return <BaseDialog.Root defaultOpen={defaultOpen}>{children}</BaseDialog.Root>
}

export function DialogTrigger({ children, size = 'md', variant = 'outline', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { size?: 'sm' | 'md' | 'lg'; variant?: 'default' | 'secondary' | 'outline' | 'ghost' }) {
  return (
    <BaseDialog.Trigger
      {...props}
      render={<button data-slot="button" data-variant={variant} data-size={size === 'md' ? 'default' : size} type="button">{children}</button>}
    />
  )
}

export function DialogContent({ children }: { children: React.ReactNode }) {
  return (
    <BaseDialog.Portal>
      <BaseDialog.Backdrop data-slot="dialog-overlay" />
      <BaseDialog.Popup data-slot="dialog-content" role="dialog" aria-modal="true">
        {children}
      </BaseDialog.Popup>
    </BaseDialog.Portal>
  )
}

export function DialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div data-slot="dialog-header" className={className} {...props} />
}

export function DialogTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <BaseDialog.Title data-slot="dialog-title" className={className} {...props} />
}

export function DialogDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <BaseDialog.Description data-slot="dialog-description" className={className} {...props} />
}

export function DialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div data-slot="dialog-footer" className={className} {...props} />
}

export function DialogClose({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <BaseDialog.Close
      {...props}
      render={<button data-slot="button" data-variant="ghost" type="button">{children}</button>}
    />
  )
}
