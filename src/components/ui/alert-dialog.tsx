import * as React from 'react'
import { AlertDialog as BaseAlertDialog } from '@base-ui/react/alert-dialog'

export type AlertDialogProps = {
  /** The element that opens the dialog, usually a Button. */
  trigger: React.ReactElement<Record<string, unknown>>
  title: React.ReactNode
  description?: React.ReactNode
  confirmLabel?: React.ReactNode
  cancelLabel?: React.ReactNode
  /** Destructive action: the confirm button becomes an outline with red text. */
  danger?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onConfirm?: () => void
}

/** "Delete this project?" — a modal that needs an explicit answer. */
export function AlertDialog({ trigger, title, description, confirmLabel = 'Confirm', cancelLabel = 'Cancel', danger, open, onOpenChange, onConfirm }: AlertDialogProps) {
  return (
    <BaseAlertDialog.Root open={open} onOpenChange={(o) => onOpenChange?.(o)}>
      <BaseAlertDialog.Trigger render={trigger} />
      <BaseAlertDialog.Portal>
        <BaseAlertDialog.Backdrop data-slot="dialog-overlay" />
        <BaseAlertDialog.Popup data-slot="alert-dialog-content">
          <div data-slot="dialog-header">
            <BaseAlertDialog.Title data-slot="dialog-title">{title}</BaseAlertDialog.Title>
            {description != null && <BaseAlertDialog.Description data-slot="dialog-description">{description}</BaseAlertDialog.Description>}
          </div>
          <div data-slot="dialog-footer">
            <BaseAlertDialog.Close data-slot="button" data-variant="outline">{cancelLabel}</BaseAlertDialog.Close>
            <BaseAlertDialog.Close
              data-slot="button"
              data-variant={danger ? 'outline' : 'default'}
              style={danger ? { color: 'var(--fp-danger)' } : undefined}
              onClick={onConfirm}
            >
              {confirmLabel}
            </BaseAlertDialog.Close>
          </div>
        </BaseAlertDialog.Popup>
      </BaseAlertDialog.Portal>
    </BaseAlertDialog.Root>
  )
}
