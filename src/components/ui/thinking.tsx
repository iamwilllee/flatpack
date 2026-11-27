import * as React from 'react'
import { ChevronDown } from 'lucide-react'
import { Collapsible } from '@base-ui/react/collapsible'
import { Spinner } from '@/components/ui/spinner'

export type ThinkingProps = Omit<React.ComponentProps<'div'>, 'children' | 'onChange'> & {
  /** `thinking` shows a spinner and opens by default; `done` shows the finished label. */
  status?: 'thinking' | 'done'
  /** Seconds the assistant thought for. Shown in the finished label. */
  duration?: number
  /** Replaces the label. Use it to localize: "思考中" / "已思考 12 秒". */
  label?: React.ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  /** The reasoning: paragraphs, a list of steps, ToolCall chips. Without children there is nothing to unfold, so the label is plain text. */
  children?: React.ReactNode
}

/**
 * The assistant's reasoning, folded under one line so the answer stays in front. While it is
 * working the line shows a spinner and the trace is open; when it finishes the line reads
 * "Thought for 12s" and the user can open it to check the steps.
 */
export function Thinking({ status = 'done', duration, label, open, defaultOpen, onOpenChange, children, ...props }: ThinkingProps) {
  const text = label ?? (status === 'thinking' ? 'Thinking…' : duration != null ? `Thought for ${duration}s` : 'Thought process')
  // Nothing to unfold yet (the reply has just started): a plain line, not a button.
  if (children == null) {
    return (
      <div data-slot="thinking" data-status={status} {...props}>
        <span data-slot="thinking-trigger" data-static="">
          {status === 'thinking' && <Spinner label="Working" />}
          <span>{text}</span>
        </span>
      </div>
    )
  }
  return (
    <div data-slot="thinking" data-status={status} {...props}>
      <Collapsible.Root open={open} defaultOpen={defaultOpen ?? status === 'thinking'} onOpenChange={(o) => onOpenChange?.(o)}>
        <Collapsible.Trigger data-slot="thinking-trigger">
          {status === 'thinking' && <Spinner label="Working" />}
          <span>{text}</span>
          <ChevronDown data-slot="thinking-icon" size={16} aria-hidden="true" />
        </Collapsible.Trigger>
        <Collapsible.Panel data-slot="thinking-content">{children}</Collapsible.Panel>
      </Collapsible.Root>
    </div>
  )
}
