import * as React from 'react'
import { Toast as BaseToast } from '@base-ui/react/toast'
import { CircleCheck, CircleAlert, Info, X } from 'lucide-react'

/**
 * Global toast manager. Mount <Toaster /> once near the root, then call
 * toast({ title, description, type }) from anywhere.
 */
const manager = BaseToast.createToastManager()

export type ToastOptions = {
  title: React.ReactNode
  description?: React.ReactNode
  type?: 'default' | 'success' | 'error'
  /** ms before it closes; 0 keeps it open */
  timeout?: number
  action?: { label: string; onClick: () => void }
}

export function toast({ title, description, type = 'default', timeout, action }: ToastOptions) {
  return manager.add({
    title,
    description,
    type,
    timeout,
    actionProps: action ? { children: action.label, onClick: action.onClick } : undefined,
  })
}
toast.close = (id: string) => manager.close(id)

const ICON = { default: Info, success: CircleCheck, error: CircleAlert }

function ToastList() {
  const { toasts } = BaseToast.useToastManager()
  return toasts.map((t) => {
    const type = (t.type ?? 'default') as keyof typeof ICON
    const Icon = ICON[type] ?? Info
    return (
      <BaseToast.Root key={t.id} toast={t} data-slot="toast" data-type={type}>
        <span data-slot="toast-icon"><Icon size={16} /></span>
        <div data-slot="toast-body">
          <BaseToast.Title data-slot="toast-title" />
          <BaseToast.Description data-slot="toast-description" />
          {t.actionProps && <BaseToast.Action data-slot="button" data-variant="outline" data-size="sm" />}
        </div>
        <BaseToast.Close data-slot="toast-close" aria-label="Close"><X size={16} /></BaseToast.Close>
      </BaseToast.Root>
    )
  })
}

export function Toaster({ timeout = 4000, limit = 3 }: { timeout?: number; limit?: number }) {
  return (
    <BaseToast.Provider toastManager={manager} timeout={timeout} limit={limit}>
      <BaseToast.Portal>
        <BaseToast.Viewport data-slot="toast-viewport">
          <ToastList />
        </BaseToast.Viewport>
      </BaseToast.Portal>
    </BaseToast.Provider>
  )
}
