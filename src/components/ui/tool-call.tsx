import * as React from 'react'
import { Check, X } from 'lucide-react'
import { Spinner } from '@/components/ui/spinner'
import { VisuallyHidden } from '@/components/ui/visually-hidden'

export type ToolCallStatus = 'running' | 'done' | 'error'

export type ToolCallProps = Omit<React.ComponentProps<'span'>, 'children'> & {
  /** What was called: "Search inventory", "Edit orders.ts". */
  name: string
  /** What it was called with or returned: a query, a path, "3 results". Set in the mono face. */
  detail?: string
  status?: ToolCallStatus
  /** Accessible status text, for localized products. */
  statusLabels?: Record<ToolCallStatus, string>
}

const DEFAULT_LABELS: Record<ToolCallStatus, string> = { running: 'Running', done: 'Done', error: 'Failed' }

/** A tool call or code edit as one compact chip in the middle of a message. */
export function ToolCall({ name, detail, status = 'done', statusLabels = DEFAULT_LABELS, ...props }: ToolCallProps) {
  return (
    <span data-slot="tool-call" data-status={status} {...props}>
      {status === 'running' ? <Spinner label={statusLabels.running} /> : (
        <>
          {status === 'done' ? <Check size={16} aria-hidden="true" /> : <X size={16} aria-hidden="true" />}
          <VisuallyHidden>{statusLabels[status]}: </VisuallyHidden>
        </>
      )}
      <span data-slot="tool-call-name">{name}</span>
      {detail && <span data-slot="tool-call-detail" className="fp-num">{detail}</span>}
    </span>
  )
}
