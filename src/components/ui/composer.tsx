import * as React from 'react'
import { ArrowUp, Square } from 'lucide-react'
import { Button } from '@/components/ui/button'

export type ComposerProps = Omit<React.ComponentProps<'div'>, 'onSubmit' | 'defaultValue' | 'onChange'> & {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  /** Called with the trimmed text when the user presses Enter or the send button. Empty text is ignored. */
  onSubmit?: (value: string) => void
  /** Called when the stop button is pressed while `loading`. */
  onStop?: () => void
  /** A reply is being produced: the send button becomes a stop button. */
  loading?: boolean
  disabled?: boolean
  placeholder?: string
  /** The textarea grows with its text up to this many lines, then scrolls. Default 8. */
  maxRows?: number
  /** Left of the bar: attach buttons, a model picker or a key hint. */
  leading?: React.ReactNode
  /** Right of the bar, before the send button. */
  actions?: React.ReactNode
  /** Clear the text after a successful submit. Default true; set false when the parent clears it. */
  clearOnSubmit?: boolean
  /** Accessible names, for localized products. */
  inputLabel?: string
  sendLabel?: string
  stopLabel?: string
}

/**
 * The message box of a chat or assistant screen: a growing textarea, a bar for actions and a send
 * button. Enter sends and Shift+Enter adds a line. Enter during IME composition (pinyin, kana)
 * only confirms the text, it never sends. Controlled (`value` + `onValueChange`) or uncontrolled.
 */
export function Composer({
  value, defaultValue = '', onValueChange, onSubmit, onStop, loading = false, disabled = false,
  placeholder, maxRows = 8, leading, actions, clearOnSubmit = true,
  inputLabel = 'Message', sendLabel = 'Send', stopLabel = 'Stop', className, ...rest
}: ComposerProps) {
  const [inner, setInner] = React.useState(defaultValue)
  const controlled = value !== undefined
  const text = controlled ? value : inner
  const ref = React.useRef<HTMLTextAreaElement>(null)

  const fit = React.useCallback(() => {
    const el = ref.current
    if (!el) return
    el.style.height = 'auto'
    const line = parseFloat(getComputedStyle(el).lineHeight) || 22
    const pad = parseFloat(getComputedStyle(el).paddingTop) + parseFloat(getComputedStyle(el).paddingBottom)
    el.style.height = `${Math.min(el.scrollHeight, line * maxRows + pad)}px`
  }, [maxRows])
  React.useLayoutEffect(fit, [text, fit])

  const set = (v: string) => {
    if (!controlled) setInner(v)
    onValueChange?.(v)
  }
  const canSend = !disabled && !loading && text.trim().length > 0
  const send = () => {
    if (!canSend) return
    onSubmit?.(text.trim())
    if (clearOnSubmit) set('')
  }

  return (
    <div data-slot="composer" data-disabled={disabled ? 'true' : undefined} className={className} {...rest}>
      <textarea
        ref={ref}
        data-slot="composer-input"
        rows={1}
        value={text}
        disabled={disabled}
        placeholder={placeholder}
        aria-label={inputLabel}
        onChange={(e) => set(e.target.value)}
        onKeyDown={(e) => {
          if (e.key !== 'Enter' || e.shiftKey || e.nativeEvent.isComposing || e.keyCode === 229) return
          e.preventDefault()
          send()
        }}
      />
      <div data-slot="composer-bar">
        <div data-slot="composer-leading">{leading}</div>
        <div data-slot="composer-actions">
          {actions}
          {loading ? (
            <Button size="icon" aria-label={stopLabel} onClick={onStop}><Square size={16} /></Button>
          ) : (
            <Button size="icon" aria-label={sendLabel} disabled={!canSend} onClick={send}><ArrowUp size={16} /></Button>
          )}
        </div>
      </div>
    </div>
  )
}
