import * as React from 'react'
import { Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export type ApprovalStatus = 'pending' | 'approved' | 'denied'

export type ApprovalProps = Omit<React.ComponentProps<'div'>, 'title' | 'onChange'> & {
  /** What the assistant wants to do: "Delete 12 draft orders?" */
  title: React.ReactNode
  description?: React.ReactNode
  /** Details to check before deciding: a CodeBlock, a list of the items affected. */
  children?: React.ReactNode
  /** Controlled status. Without it the component keeps its own, starting at `defaultStatus`. */
  status?: ApprovalStatus
  defaultStatus?: ApprovalStatus
  onApprove?: () => void
  onDeny?: () => void
  approveLabel?: string
  denyLabel?: string
  approvedLabel?: string
  deniedLabel?: string
}

/**
 * A question the assistant asks before it acts, placed in the message flow. It shows two buttons
 * until the user decides, then the buttons give way to the result so the history reads correctly.
 */
export function Approval({
  title, description, children, status, defaultStatus = 'pending', onApprove, onDeny,
  approveLabel = 'Approve', denyLabel = 'Deny', approvedLabel = 'Approved', deniedLabel = 'Denied', ...props
}: ApprovalProps) {
  const [inner, setInner] = React.useState<ApprovalStatus>(defaultStatus)
  const current = status ?? inner
  const id = React.useId()
  const decide = (next: ApprovalStatus, cb?: () => void) => {
    if (status === undefined) setInner(next)
    cb?.()
  }
  return (
    <div data-slot="approval" data-status={current} role="group" aria-labelledby={`${id}-title`} {...props}>
      <div data-slot="approval-title" id={`${id}-title`}>{title}</div>
      {description && <div data-slot="approval-description">{description}</div>}
      {children}
      <div data-slot="approval-footer" aria-live="polite">
        {current === 'pending' ? (
          <>
            <Button size="sm" variant="outline" onClick={() => decide('denied', onDeny)}>{denyLabel}</Button>
            <Button size="sm" onClick={() => decide('approved', onApprove)}>{approveLabel}</Button>
          </>
        ) : (
          <span data-slot="approval-result">
            {current === 'approved' ? <Check size={16} aria-hidden="true" /> : <X size={16} aria-hidden="true" />}
            {current === 'approved' ? approvedLabel : deniedLabel}
          </span>
        )}
      </div>
    </div>
  )
}
