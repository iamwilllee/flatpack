import * as React from 'react'
import { Dialog as BaseDialog } from '@base-ui/react/dialog'
import { X } from 'lucide-react'

export function Sheet({ children, defaultOpen = false }: { children: React.ReactNode; defaultOpen?: boolean }) {
  return <BaseDialog.Root defaultOpen={defaultOpen}>{children}</BaseDialog.Root>
}

export function SheetTrigger({ children, size = 'md', variant = 'outline' }: { children: React.ReactNode } & { size?: 'sm' | 'md' | 'lg'; variant?: 'default' | 'secondary' | 'outline' | 'ghost' }) {
  return (
    <BaseDialog.Trigger render={<button data-slot="button" data-variant={variant} data-size={size === 'md' ? 'default' : size} type="button">{children}</button>} />
  )
}

export function SheetContent({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <BaseDialog.Portal>
      <BaseDialog.Backdrop data-slot="sheet-overlay" />
      <BaseDialog.Popup data-slot="sheet-content" role="dialog" aria-modal="true">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--fp-space-1)' }}>
          <BaseDialog.Title data-slot="sheet-title">{title}</BaseDialog.Title>
          <BaseDialog.Close data-slot="button" data-variant="ghost" data-size="icon" aria-label="关闭">
            <X size={16} />
          </BaseDialog.Close>
        </div>
        {children}
      </BaseDialog.Popup>
    </BaseDialog.Portal>
  )
}
